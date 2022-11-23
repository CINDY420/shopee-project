import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseInterceptors,
  Delete,
  Post,
  ForbiddenException
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { ProjectsService } from './projects.service'
import {
  IPlayLoadInfo,
  IGetProjectDetailDtoResponse,
  IProjectListResult,
  IGetMetricsResult,
  IESProjectDetailResponse,
  IProjectInfo,
  ListQueryDto,
  ClusterListByConfigInfoResponse
} from './dto/create-project.dto'
// import { IProjectQuota } from './entities/project.entity'
import { IProjectQuotasDto, ICrdQuota, updateResourceQuotasBody } from './dto/project.quotas.dto'

import { EsSync, Pagination } from 'common/decorators/methods'
import { PaginateInterceptor } from 'common/interceptors/paginate.interceptor'

import { TenantResourceGuard, TENANT_LOCATION } from 'common/decorators/parameters/TenantResourceGuard'
import { RESOURCE_TYPE, RESOURCE_ACTION, PLATFORM_TENANT_ID } from 'common/constants/rbac'

import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { ESIndex } from 'common/constants/es'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { AuthService } from 'common/modules/auth/auth.service'
import { ITransferProjectDto, ITransferProjectResponse } from './dto/transfer-project.dto'
import { EsSyncInterceptor } from 'common/interceptors/esSync.interceptor'

@ApiTags('Projects')
@Controller('tenants/:tenantId')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService, private readonly authService: AuthService) {}

  @Get('/projects/:projectName')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.PROJECT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PROJECT)
  @ApiResponse({ status: 200, type: IGetProjectDetailDtoResponse, description: 'Get project detail' })
  async getDetail(@Param() projectInfo: IProjectInfo, @AuthToken() authToken: string, @AuthUser() authUser: IAuthUser) {
    const { tenantId, projectName } = projectInfo
    return this.projectsService.getDetail(tenantId, projectName, authToken)
  }

  @Get('/projects/:projectName/clusterListByConfigInfo')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.PROJECT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, type: ClusterListByConfigInfoResponse, description: 'Get cluster list by config info' })
  getClusterListByConfigInfo(
    @Param('tenantId') tenantId: number,
    @Param('projectName') projectName: string,
    @Query('environments') environments: string[],
    @Query('cids') cids: string[],
    @AuthToken() authToken: string
  ) {
    return this.projectsService.getClusterListByConfigInfo(
      tenantId,
      projectName,
      environments instanceof Array ? environments : [environments],
      cids instanceof Array ? cids : [cids],
      authToken
    )
  }

  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.PROJECT,
    action: RESOURCE_ACTION.View
  })
  @Get('/projects')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PROJECT)
  @Pagination({
    key: 'projects',
    countKey: 'totalCount',
    defaultOrder: 'name'
  })
  @ApiResponse({ status: 200, type: IProjectListResult, description: 'Get project list' })
  @UseInterceptors(PaginateInterceptor)
  list(@Param('tenantId') tenantId: number, @AuthToken() authToken: string, @Query() query: ListQueryDto) {
    return this.projectsService.getList(tenantId, authToken)
  }

  @Get('/projects/:projectName/resourceQuotas')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.PROJECT_QUOTA,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RESOURCE_QUOTA)
  @ApiResponse({ status: 200, type: IProjectQuotasDto, description: 'Get resource quotas' })
  getResourceQuotas(
    @Param('tenantId') tenantId: number,
    @Param('projectName') projectName: string,
    @AuthToken() authToken: string
  ) {
    return this.projectsService.getQuotas(tenantId, projectName, authToken)
  }

  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.PROJECT_QUOTA,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PROJECT)
  @Get('/projects/:projectName/metrics')
  @ApiResponse({ status: 200, type: IGetMetricsResult, description: 'Get project metrics' })
  getProjectMetrics(
    @Param('tenantId') tenantId: number,
    @Param('projectName') projectName: string,
    @Query('env') env: string,
    @Query('cluster') cluster: string,
    @AuthToken() authToken: string
  ) {
    return this.projectsService.getMetrics(tenantId, projectName, cluster, env, authToken)
  }

  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.PROJECT,
    action: RESOURCE_ACTION.Delete
  })
  @Delete('/projects/:projectName')
  // @EsBooleanSync({
  //   esIndex: ESIndex.PROJECT,
  //   esBooleanQueryItems: [
  //     {
  //       queryKey: 'project',
  //       dataIndex: 'projectName',
  //       position: 'params'
  //     }
  //   ],
  //   operation: 'delete'
  // })
  // @UseInterceptors(EsBooleanSyncInterceptor)
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PROJECT)
  @ApiResponse({ status: 200, type: Object, description: 'Delete project' })
  deleteProject(
    @Param('tenantId') tenantId: number,
    @Param('projectName') projectName: string,
    @AuthToken() authToken: string
  ) {
    return this.projectsService.delete(tenantId, projectName, authToken)
  }

  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.PROJECT,
    action: RESOURCE_ACTION.Edit
  })
  @Put('/projects/:projectName')
  // @EsBooleanSync({
  //   esIndex: ESIndex.PROJECT,
  //   secondEsIndex: ESIndex.PROJECT_QUOTAS,
  //   esBooleanQueryItems: [
  //     {
  //       queryKey: 'project',
  //       dataIndex: 'projectName',
  //       position: 'params'
  //     }
  //   ],
  //   operation: 'update',
  //   validator: validateProjectQuotas
  // })
  // @UseInterceptors(EsBooleanSyncInterceptor)
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PROJECT)
  @ApiResponse({ status: 200, type: IESProjectDetailResponse, description: 'Update project' })
  update(
    @Param('tenantId') tenantId: number,
    @Param('projectName') projectName: string,
    @Body() payload: IPlayLoadInfo
  ) {
    return this.projectsService.update(tenantId, projectName, payload)
  }

  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.PROJECT,
    action: RESOURCE_ACTION.Create
  })
  @Post('/projects')
  // @EsBooleanSync({
  //   esIndex: ESIndex.PROJECT,
  //   esBooleanQueryItems: [
  //     {
  //       queryKey: 'project',
  //       dataIndex: 'project',
  //       position: 'body'
  //     }
  //   ],
  //   operation: 'create'
  // })
  // @UseInterceptors(EsBooleanSyncInterceptor)
  @AuditResourceType(AUDIT_RESOURCE_TYPE.PROJECT)
  @ApiResponse({ status: 200, type: IESProjectDetailResponse, description: 'Create project' })
  create(@Param('tenantId') tenantId: number, @Body() payload: IPlayLoadInfo, @AuthToken() authToken: string) {
    return this.projectsService.create(tenantId, payload, authToken)
  }

  // huadong TODO update resource guard
  // @GroupResourceGuard({
  //   groupLocation: GROUP_LOCATION.PARAMS,
  //   groupKey: 'groupName',
  //   resource: GROUP_RESOURCES.PROJECT_QUOTA,
  //   verb: ACCESS_CONTROL_VERBS.EDIT
  // })
  @Put('/projects/:projectName/resourceQuotas')
  // huadong TODO update
  // @EsBooleanSync({
  //   esIndex: ESIndex.PROJECT_QUOTAS,
  //   esBooleanQueryItems: [
  //     {
  //       // huadong TODO replace group with tenant in v1.1
  //       queryKey: 'group',
  //       dataIndex: 'groupName',
  //       position: 'params'
  //     },
  //     {
  //       queryKey: 'project',
  //       dataIndex: 'projectName',
  //       position: 'params'
  //     }
  //   ],
  //   operation: 'update',
  //   validator: (updateData: IProjectQuotaMap, esData) => {
  //     const updateDataEntries = Object.entries(updateData)
  //     const esQuotasMap = JSON.parse(esData.quotas).Quotas

  //     return updateDataEntries.every(([quotaName, quota]) => {
  //       const { env, clusterName } = parseClusterQuotaName(quotaName)
  //       const key = generateClusterId(env, '*', clusterName)
  //       const esQuota = esQuotasMap[key]

  //       return (
  //         esQuota &&
  //         roundToTwo(Number(esQuota.cpuTotal)) === roundToTwo(Number(quota.cpuTotal)) &&
  //         roundToTwo(Number(esQuota.memoryTotal)) === roundToTwo(Number(quota.memoryTotal))
  //       )
  //     })
  //   }
  // })
  // @UseInterceptors(EsBooleanSyncInterceptor)
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RESOURCE_QUOTA)
  @ApiResponse({ status: 200, type: [ICrdQuota], description: 'Update quotas' })
  updateResourceQuotas(
    @Param('tenantId') tenantId: number,
    @Param('projectName') projectName: string,
    @Body() body: updateResourceQuotasBody,
    @AuthToken() authToken: string
  ) {
    return this.projectsService.updateQuotas(tenantId, projectName, body, authToken)
  }

  @AuditResourceType(AUDIT_RESOURCE_TYPE.PROJECT)
  @EsSync({
    esContext: {
      index: ESIndex.PROJECT,
      key: 'project'
    },
    reqContext: {
      key: 'projectName',
      position: 'params'
    },
    operation: 'update',
    validator: (updateData: ITransferProjectResponse, esData) => {
      return updateData.tenantId.toString() === esData.tenant
    }
  })
  @UseInterceptors(EsSyncInterceptor)
  @Post('/projects/:projectName/transfer')
  @ApiResponse({ status: 200, type: IESProjectDetailResponse, description: 'Create project' })
  async transferProject(
    @Param('tenantId') tenantId: number,
    @Param('projectName') projectName: string,
    @AuthUser() authUser: IAuthUser,
    @Body() transferProjectDto: ITransferProjectDto
  ): Promise<ITransferProjectResponse> {
    const isPlatformAdmin = authUser.roles.some(({ tenantId }) => tenantId === PLATFORM_TENANT_ID)
    if (!isPlatformAdmin) {
      throw new ForbiddenException('only platform admin can perform this action')
    }
    return this.projectsService.transferProject(tenantId, transferProjectDto.targetTenantId, projectName)
  }
}
