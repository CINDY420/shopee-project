import * as _ from 'lodash'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  BadRequestException,
  ForbiddenException,
  Patch
} from '@nestjs/common'

import {
  ListPipelinesParamsDto,
  ListPipelinesQueryDto,
  ListPipelinesResponseDto,
  CreatePipelinesBodyDto,
  UpdatePipelinesBodyDto,
  CreatePipelineRunParamsDto,
  CreatePipelineRunBodyDto,
  ListPipelineRunsParamsDto,
  ListPipelineRunsQueryDto,
  ListPipelineRunsResponseDto,
  GetPipelineRunDetailParamsDto,
  GetPipelineDetailParamsDto,
  GetPipelineDetailResponseDto,
  PipelineItem,
  PipelineRunDetail,
  GetGitBranchesParamsDto,
  GetPipelineRunLogParamsDto,
  PipelineRunLog,
  RebuildPipelineRunParamsDto,
  AbortPipelineRunParamsDto,
  ConfirmPipelineRunBodyDto,
  ConfirmPipelineRunParamsDto,
  CreatePipelinesParamsDto,
  UpdatePipelinesParamsDto,
  ImportPipelinesParamsDto,
  ImportPipelinesBodyDto,
  MovePipelineParamsDto,
  MovePipelineBodyDto,
  AbortPendingPipelineParamsDto,
  ListPipelineEnginesParamsDto,
  ListAllPipelinesParamsDto,
  GetPipelineMigrationParamsDto,
  MigratePipelineParamsDto,
  MigratePipelineBodyDto,
  PipelineEngine,
  BatchMigratePipelinesParamsDto,
  BatchMigratePipelinesBodyDto,
  BatchMigratePipelineResponseDto,
  PipelineMigrationItem,
  ListAllPipelinesQueryDto,
  GetPipelineRunResultParamsDto,
  PipelineRunResult,
  GetPipelineRunResultQueryDto
} from './dto/pipelines.dto'
import { PipelinesService } from './pipelines.service'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { ApplicationsService } from 'applications-management/applications/applications.service'
import { RBACCheckTenantResourceAction } from 'common/helpers/rbac'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { AuthService } from 'common/modules/auth/auth.service'
import { ENV } from 'common/constants/env'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'
import { FreezesService } from 'release-freezes-management/freezes.service'
import { ENGINE, MIGRATION_FAILED } from 'common/constants/pipeline'
import { TenantResourceGuard, TENANT_LOCATION } from 'common/decorators/parameters/TenantResourceGuard'

@ApiTags('Pipelines')
@Controller('tenants/:tenantId')
export class PipelinesController {
  constructor(
    private readonly pipelinesService: PipelinesService,
    private readonly projectService: ProjectsService,
    private readonly applicationService: ApplicationsService,
    private readonly authService: AuthService,
    private readonly freezesService: FreezesService
  ) {}

  @Get('/pipelines')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Get pipeline list.' })
  @ApiResponse({ status: 200, type: ListPipelinesResponseDto })
  async ListPipelines(
    @Param() params: ListPipelinesParamsDto,
    @Query() query: ListPipelinesQueryDto,
    @AuthToken() authToken: string
  ): Promise<ListPipelinesResponseDto> {
    const { tenantId } = params
    return this.pipelinesService.getPipelinesList(tenantId, query, authToken)
  }

  @Post('/pipelines')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Create a new pipeline.' })
  @ApiResponse({ status: 200, type: Object })
  async CreatePipeline(
    @Param() params: CreatePipelinesParamsDto,
    @Body() body: CreatePipelinesBodyDto,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    const { tenantId } = params
    const { envs, project, module: pipelineModule } = body
    if (envs.length < 1) {
      throw new BadRequestException('invalid params: envs')
    }

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    let action = RESOURCE_ACTION.CreateNonLive
    const hasLive = envs.find((env) => env.toUpperCase() === ENV.live)
    if (hasLive) {
      action = RESOURCE_ACTION.CreateLive
    }
    const hasPermission = RBACCheckTenantResourceAction(tenantPermissions, tenantId, RESOURCE_TYPE.PIPELINE, action)

    if (!hasPermission) {
      throw new ForbiddenException(`not allow to create pipeline ${project}-${pipelineModule}-${envs.join(';')}`)
    }

    await this.projectService.getEsProject(project, tenantId)
    // await this.applicationService.getEsApplicationByName(project, pipelineModule)

    return this.pipelinesService.createPipelines(params, body, authToken)
  }

  @Put('/pipelines/:pipelineName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Update pipeline.' })
  @ApiResponse({ status: 200, type: PipelineItem })
  async UpdatePipeline(
    @Param() params: UpdatePipelinesParamsDto,
    @Body() body: UpdatePipelinesBodyDto,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ): Promise<PipelineItem> {
    const { tenantId, pipelineName } = params
    const pipelineDetail = await this.pipelinesService.getPipelineDetail(params, authToken)
    if (!pipelineDetail) {
      throw new BadRequestException(`invalid pipeline name: ${pipelineName}`)
    }

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    const { env } = pipelineDetail
    let action = RESOURCE_ACTION.EditNonLive
    if (env.toUpperCase() === ENV.live) {
      action = RESOURCE_ACTION.EditLive
    }
    const hasPermission = RBACCheckTenantResourceAction(tenantPermissions, tenantId, RESOURCE_TYPE.PIPELINE, action)
    if (!hasPermission) {
      throw new ForbiddenException(`not allow to edit pipeline ${pipelineName}`)
    }

    return this.pipelinesService.updatePipelines(params, body, authToken)
  }

  @Get('/pipelines/:pipelineName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Get pipeline detail.' })
  @ApiResponse({ status: 200, type: GetPipelineDetailResponseDto })
  async GetPipelineDetail(
    @Param() params: GetPipelineDetailParamsDto,
    @AuthToken() authToken: string
  ): Promise<GetPipelineDetailResponseDto> {
    return this.pipelinesService.getPipelineDetail(params, authToken)
  }

  @Get('/pipelines/:pipelineName/git_branches')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Get pipeline git branches.' })
  @ApiResponse({ status: 200, type: [String] })
  async GetGitBranches(@Param() params: GetGitBranchesParamsDto, @AuthToken() authToken: string): Promise<string[]> {
    return this.pipelinesService.getGitBranches(params, authToken)
  }

  @Post('/pipelines/:pipelineName/runs')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Create a pipeline run.' })
  @ApiResponse({ status: 200, type: PipelineRunDetail })
  async CreatePipelineRun(
    @Param() params: CreatePipelineRunParamsDto,
    @Body() body: CreatePipelineRunBodyDto,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    const { tenantId, pipelineName } = params
    const pipelineDetail = await this.pipelinesService.getPipelineDetail(params, authToken)
    if (!pipelineDetail) {
      throw new BadRequestException(`invalid pipeline name: ${pipelineName}`)
    }

    const { env } = pipelineDetail
    const isEnvFreezing = await this.freezesService.isEnvFreezing(env, authToken)
    const canOperate = await this.freezesService.canOperateDuringFreezing(authUser.roles)
    if (isEnvFreezing && !canOperate) {
      throw new ForbiddenException('Release freeze now! you cannot run the pipeline')
    }

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    let action = RESOURCE_ACTION.RunNonLive
    if (env.toUpperCase() === ENV.live) {
      action = RESOURCE_ACTION.RunLive
    }
    const hasPermission = RBACCheckTenantResourceAction(tenantPermissions, tenantId, RESOURCE_TYPE.PIPELINE, action)
    if (!hasPermission) {
      throw new ForbiddenException(`not allow to run pipeline ${pipelineName}`)
    }
    return this.pipelinesService.createPipelineRuns(params, body, authToken)
  }

  @Get('/pipelines/:pipelineName/runs')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Get pipeline runs list.' })
  @ApiResponse({ status: 200, type: ListPipelineRunsResponseDto })
  ListPipelineRuns(
    @Param() params: ListPipelineRunsParamsDto,
    @Query() query: ListPipelineRunsQueryDto,
    @AuthToken() authToken: string
  ): Promise<ListPipelineRunsResponseDto> {
    return this.pipelinesService.getPipelineRunList(params, query, authToken)
  }

  @Get('/pipelines/:pipelineName/runs/:runId')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Get pipeline run detail.' })
  @ApiResponse({ status: 200, type: PipelineRunDetail })
  async GetPipelineRunDetail(
    @Param() params: GetPipelineRunDetailParamsDto,
    @AuthToken() authToken: string
  ): Promise<PipelineRunDetail> {
    return this.pipelinesService.getPipelineRunDetail(params, authToken)
  }

  @Get('/pipelines/:pipelineName/runs/:runId/result')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Get pipeline run result.' })
  @ApiResponse({ status: 200, type: PipelineRunResult })
  async GetPipelineRunResult(
    @Param() params: GetPipelineRunResultParamsDto,
    @Query() query: GetPipelineRunResultQueryDto,
    @AuthToken() authToken: string
  ): Promise<PipelineRunResult> {
    return this.pipelinesService.getPipelineRunResult(params, query, authToken)
  }

  @Get('/pipelines/:pipelineName/runs/:runId/steps/:stepId/log')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Get pipeline run log.' })
  @ApiResponse({ status: 200, type: PipelineRunLog })
  async GetPipelineRunLog(
    @Param() params: GetPipelineRunLogParamsDto,
    @AuthToken() authToken: string
  ): Promise<PipelineRunLog> {
    return this.pipelinesService.getPipelineRunLog(params, authToken)
  }

  @Post('/pipelines/:pipelineName/runs/:runId/abort')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Abort a pipeline run.' })
  @ApiResponse({ status: 200, type: Object })
  async AbortPipelineRun(
    @Param() params: AbortPipelineRunParamsDto,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const { tenantId, pipelineName } = params
    const pipelineDetail = await this.pipelinesService.getPipelineDetail(params, authToken)
    if (!pipelineDetail) {
      throw new BadRequestException(`invalid pipeline name: ${pipelineName}`)
    }

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    const { env } = pipelineDetail
    let action = RESOURCE_ACTION.AbortNonLive
    if (env.toUpperCase() === ENV.live) {
      action = RESOURCE_ACTION.AbortLive
    }
    const hasPermission = RBACCheckTenantResourceAction(tenantPermissions, tenantId, RESOURCE_TYPE.PIPELINE, action)
    if (!hasPermission) {
      throw new ForbiddenException(`not allow to abort pipeline ${pipelineName}`)
    }
    return this.pipelinesService.abortPipelineRun(params, authToken)
  }

  @Post('/pipelines/:pipelineName/queues/:queueId/abort')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Abort a pending pipeline.' })
  @ApiResponse({ status: 200, type: Object })
  async AbortPendingPipeline(
    @Param() params: AbortPendingPipelineParamsDto,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const { tenantId, pipelineName } = params
    const pipelineDetail = await this.pipelinesService.getPipelineDetail(params, authToken)
    if (!pipelineDetail) {
      throw new BadRequestException(`invalid pipeline name: ${pipelineName}`)
    }

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    const { env } = pipelineDetail
    let action = RESOURCE_ACTION.AbortNonLive
    if (env.toUpperCase() === ENV.live) {
      action = RESOURCE_ACTION.AbortLive
    }
    const hasPermission = RBACCheckTenantResourceAction(tenantPermissions, tenantId, RESOURCE_TYPE.PIPELINE, action)
    if (!hasPermission) {
      throw new ForbiddenException(`not allow to abort pipeline ${pipelineName}`)
    }
    return this.pipelinesService.abortPendingPipeline(params, authToken)
  }

  @Post('/pipelines/:pipelineName/runs/:runId/rebuild')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Rebuild a pipeline run.' })
  @ApiResponse({ status: 200, type: Object })
  async rebuildPipelineRun(
    @Param() params: RebuildPipelineRunParamsDto,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const { tenantId, pipelineName } = params
    const pipelineDetail = await this.pipelinesService.getPipelineDetail(params, authToken)
    if (!pipelineDetail) {
      throw new BadRequestException(`invalid pipeline name: ${pipelineName}`)
    }

    const { env } = pipelineDetail
    const isEnvFreezing = await this.freezesService.isEnvFreezing(env, authToken)
    const canOperate = await this.freezesService.canOperateDuringFreezing(authUser.roles)
    if (isEnvFreezing && !canOperate) {
      throw new ForbiddenException('Release freeze now! you cannot rebuild the pipeline')
    }

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    let action = RESOURCE_ACTION.RebuildNonLive
    if (env.toUpperCase() === ENV.live) {
      action = RESOURCE_ACTION.RebuildLive
    }
    const hasPermission = RBACCheckTenantResourceAction(tenantPermissions, tenantId, RESOURCE_TYPE.PIPELINE, action)
    if (!hasPermission) {
      throw new ForbiddenException(`not allow to rebuild pipeline ${pipelineName}`)
    }
    return this.pipelinesService.rebuildPipelineRun(params, authToken)
  }

  @Post('/pipelines/:pipelineName/runs/:runId/confirmation')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Rebuild a pipeline run.' })
  @ApiResponse({ status: 200, type: Object })
  async ConfirmPipelineRun(
    @Param() params: ConfirmPipelineRunParamsDto,
    @Body() body: ConfirmPipelineRunBodyDto,
    @AuthToken() authToken: string
  ) {
    return this.pipelinesService.confirmPipelineRun(params, body, authToken)
  }

  @Post('/pipelines/batchImport')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Import pipelines.' })
  @ApiResponse({ status: 200, type: Object })
  async ImportPipelines(
    @Param() params: ImportPipelinesParamsDto,
    @AuthUser() authUser: IAuthUser,
    @Body() body: ImportPipelinesBodyDto,
    @AuthToken() authToken: string
  ) {
    const { tenantId } = params
    const { project, engine } = body

    const formatEngine = engine.toLowerCase()
    if (formatEngine !== ENGINE.ENGINE_SG_LIVE && formatEngine !== ENGINE.ENGINE_SG_NON_LIVE) {
      throw new BadRequestException(`Invalid engine input ${formatEngine}`)
    }

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    const action = RESOURCE_ACTION.Import
    const hasPermission = RBACCheckTenantResourceAction(tenantPermissions, tenantId, RESOURCE_TYPE.PIPELINE, action)
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to import pipelines')
    }
    await this.projectService.getEsProject(project, tenantId)
    return this.pipelinesService.importPipelines(params, body, authToken)
  }

  @Patch('/pipelines/:pipelineName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'Move pipeline to another tenant.' })
  @ApiResponse({ status: 200, type: Object })
  async MovePipeline(
    @Param() params: MovePipelineParamsDto,
    @AuthUser() authUser: IAuthUser,
    @Body() body: MovePipelineBodyDto,
    @AuthToken() authToken: string
  ) {
    const { tenantId } = params
    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    const action = RESOURCE_ACTION.Move
    const hasPermission = RBACCheckTenantResourceAction(tenantPermissions, tenantId, RESOURCE_TYPE.PIPELINE, action)
    if (!hasPermission) {
      throw new ForbiddenException('Only platform admin is allowed to move pipeline')
    }
    return this.pipelinesService.movePipeline(params, body, authToken)
  }

  @Get('/pipelines/engines/list')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'get all pipelines engines.' })
  @ApiResponse({ status: 200, type: [PipelineEngine] })
  async GetAllPipelineEngines(@Param() params: ListPipelineEnginesParamsDto, @AuthToken() authToken: string) {
    return this.pipelinesService.getPipelineEngines(authToken)
  }

  @Get('/pipelines/names/list')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'get all pipeline names of a tenant.' })
  @ApiResponse({ status: 200, type: [String] })
  async ListAllPipelines(
    @Param() params: ListAllPipelinesParamsDto,
    @Query() query: ListAllPipelinesQueryDto,
    @AuthToken() authToken: string
  ): Promise<string[]> {
    const { tenantId } = params
    const { filterBy } = query
    return this.pipelinesService.getAllPipelines(tenantId, filterBy, authToken)
  }

  @Post('/pipelines/migrations')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.PIPELINE,
    action: RESOURCE_ACTION.BatchMigrate
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'batch migrate some pipelines to another engine.' })
  @ApiResponse({ status: 200, type: BatchMigratePipelineResponseDto })
  async BatchMigratePipelines(
    @Param() params: BatchMigratePipelinesParamsDto,
    @Body() body: BatchMigratePipelinesBodyDto,
    @AuthUser() user: IAuthUser,
    @AuthToken() authToken: string
  ): Promise<BatchMigratePipelineResponseDto> {
    const { tenantId } = params
    const { sourcePipelines, destEngine } = body
    return this.pipelinesService.batchMigratePipelines(tenantId, sourcePipelines, user.Email, destEngine, authToken)
  }

  @Post('/pipelines/:pipelineName/migration')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.PIPELINE,
    action: RESOURCE_ACTION.Migrate
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'migrate a pipeline to another engine.' })
  @ApiResponse({ status: 200, type: Object })
  async MigratePipeline(
    @Param() params: MigratePipelineParamsDto,
    @Body() body: MigratePipelineBodyDto,
    @AuthUser() user: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const { tenantId, pipelineName } = params
    const { destEngine } = body
    const operator = user.Email
    return this.pipelinesService.migratePipeline(tenantId, pipelineName, destEngine, operator, authToken)
  }

  @Get('/pipelines/migrations/detail')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PIPELINE)
  @ApiOperation({ description: 'get pipeline migration list.' })
  @ApiResponse({ status: 200, type: PipelineMigrationItem })
  async GetPipelineMigrationDetail(
    @Param() params: GetPipelineMigrationParamsDto,
    @AuthUser() user: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const { tenantId } = params

    const items = await this.pipelinesService.getPipelineMigrations(tenantId, user.Email, authToken)
    if (!items || items.length < 1) {
      return {}
    }

    const item = _.sortBy(items, 'startedAt')[items.length - 1]
    if (item && item.details) {
      item.details = item.details.filter((item) => item.status === MIGRATION_FAILED)
    }
    return item || {}
  }
}
