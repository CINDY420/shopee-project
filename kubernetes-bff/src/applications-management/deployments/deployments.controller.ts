import {
  Controller,
  Get,
  Param,
  Query,
  Put,
  Body,
  ForbiddenException,
  ParseBoolPipe,
  Delete,
  HttpStatus
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IGlobalConfig } from 'common/interfaces'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'

import { DeploymentsService } from 'applications-management/deployments/deployments.service'
import { GetOrUpdateDeployParamsDto } from 'applications-management/deployments/dto/common/params.dto'
import { GetOrUpdateDeployQueryDto } from 'applications-management/deployments/dto/common/query.dto'

import {
  ApiDeploymentClusterInfo,
  ApiDeployPathParams,
  ScaleDeployBody,
  FullReleaseBody,
  GetDeployContainerTagsRequestDto,
  IGetDeployContainerTagsResponseDto,
  RollbackDeploymentRequestBodyDto,
  RollbackDeploymentRequestParamsDto,
  RolloutRestartDeploymentRequestBodyDto,
  RolloutRestartDeploymentRequestParamsDto,
  CancelCanaryDeployBody,
  IDeployScaleResponseDto,
  IDeploymentEventsParamsDto,
  IDeploymentEventsQuery,
  IDeploymentLatestEvents,
  IDeploymentDetailResponseDto
} from 'applications-management/deployments/dto/deployment.dto'
import {
  DeleteDeploymentParam,
  DeleteDeploymentBody
} from 'applications-management/deployments/dto/delete-deployment.dto'

import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { ENV } from 'common/constants/env'

import { UpdateDeployLimitBody, UpdateDeployLimitResponse } from './dto/update-deployLimit.dto'
import { GetDeploymentBasicInfoResponseDto } from './dto/get-deployment-basicInfo.dto'
import { TenantResourceGuard, TENANT_LOCATION } from 'common/decorators/parameters/TenantResourceGuard'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'common/constants/rbac'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { parseDeploymentName, parseClusterId } from 'common/helpers/deployment'
import { RBACCheckTenantResourceAction } from 'common/helpers/rbac'
import { PodsService } from 'applications-management/pods/pods.service'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { AuthService } from 'common/modules/auth/auth.service'

@ApiTags('Deployments')
@Controller('tenants/:tenantId/projects/:projectName/apps/:appName')
export class DeploymentsController {
  constructor(
    private readonly deploymentsService: DeploymentsService,
    private readonly openApiService: OpenApiService,
    private readonly authService: AuthService,
    private readonly podsService: PodsService,
    private readonly configService: ConfigService
  ) {}

  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @Get('/deploys/:deployName/clusters/:clusterName/detail')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @ApiResponse({ status: 200, type: IDeploymentDetailResponseDto })
  getApplicationDeployClusterDetail(
    @Param() deploymentInfo: ApiDeploymentClusterInfo,
    @Query('clusterId') clusterId: string,
    @AuthToken() authToken: string
  ) {
    return this.deploymentsService.getApplicationDeployClusterDetail(deploymentInfo, clusterId, authToken)
  }

  @Put('deploys/:deployName/resources')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.DEPLOY)
  @ApiResponse({ status: 200, type: UpdateDeployLimitResponse, description: 'Update deploy container limit' })
  async updateDeployLimit(
    @Param() params: GetOrUpdateDeployParamsDto,
    @Query() query: GetOrUpdateDeployQueryDto,
    @Body() body: UpdateDeployLimitBody,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ): Promise<UpdateDeployLimitResponse> {
    const { appName, deployName, tenantId } = params
    const { clusterName } = query
    const { env } = parseDeploymentName(deployName)

    let hasPermission = false
    const tenantPermissions = await this.authService.getTenantPermisssionsWithPolicy(
      authUser.roles,
      authToken,
      RESOURCE_TYPE.DEPLOYMENT,
      `${RESOURCE_TYPE.CLUSTER}-${clusterName}`
    )
    hasPermission = RBACCheckTenantResourceAction(
      tenantPermissions,
      tenantId,
      RESOURCE_TYPE.DEPLOYMENT,
      env.toUpperCase() === ENV.live ? RESOURCE_ACTION.EditResourceLive : RESOURCE_ACTION.EditResourceNonLive
    )

    if (!hasPermission) {
      throw new ForbiddenException('you do not have permission to edit this deployment')
    }

    if (this.openApiService.checkIsOam(appName)) {
      return this.openApiService.editDeploymentResource(params, query, body, authToken)
    } else {
      await this.deploymentsService.updateDeployLimit(authUser, params, query, body, authToken)
      return {}
    }
  }

  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.DEPLOY)
  @ApiTags('Open APIs')
  @ApiOperation({ description: 'Get container tags.' })
  @ApiResponse({ status: 200, type: IGetDeployContainerTagsResponseDto })
  @Get('/deploys/:deployName/containers/:containerName/tags')
  getApplicationDeployContainerTags(
    @Param() getApplicationDeployContainerTags: GetDeployContainerTagsRequestDto,
    @Query('clusterId') clusterId: string,
    @AuthToken() authToken: string
  ): Promise<IGetDeployContainerTagsResponseDto> {
    return this.deploymentsService.getContainerTags(getApplicationDeployContainerTags, clusterId, authToken)
  }

  @AuditResourceType(AUDIT_RESOURCE_TYPE.DEPLOY)
  @ApiTags('Open APIs')
  @ApiOperation({ description: 'Batch scale deploys.' })
  @ApiResponse({ status: 200, type: IDeployScaleResponseDto, description: 'Return successful message' })
  @Put('/deploysscale')
  async scaleApplicationDeploys(
    @AuthUser() authUser: IAuthUser,
    @Param() deploymentInfo: ApiDeployPathParams,
    @Body() request: ScaleDeployBody,
    @AuthToken() authToken: string
  ) {
    const { appName, tenantId } = deploymentInfo
    const forbiddenScaleDeploys = []
    await Promise.all(
      request.deploys.map(async (deploy) => {
        const { env, clusterName } = parseClusterId(deploy.clusterId)
        const tenantPermissions = await this.authService.getTenantPermisssionsWithPolicy(
          authUser.roles,
          authToken,
          RESOURCE_TYPE.DEPLOYMENT,
          `${RESOURCE_TYPE.CLUSTER}-${clusterName}`
        )
        let hasPermission = false
        hasPermission = RBACCheckTenantResourceAction(
          tenantPermissions,
          tenantId,
          RESOURCE_TYPE.DEPLOYMENT,
          env.toUpperCase() === ENV.live ? RESOURCE_ACTION.ScaleLive : RESOURCE_ACTION.ScaleNonLive
        )
        if (!hasPermission) forbiddenScaleDeploys.push(deploy.name)
      })
    )
    request.deploys = request.deploys.filter((deploy) => !forbiddenScaleDeploys.includes(deploy.name))

    let res: any
    if (this.openApiService.checkIsOam(appName)) {
      res = await this.openApiService.scale(deploymentInfo, request, authToken)
    } else {
      res = await this.deploymentsService.scaleApplicationDeploys(authUser, deploymentInfo, request, authToken)
    }
    if (forbiddenScaleDeploys.length > 0) {
      throw new ForbiddenException(`you do not have permission to scale deployment ${forbiddenScaleDeploys.toString()}`)
    }
    return res
  }

  @AuditResourceType(AUDIT_RESOURCE_TYPE.DEPLOY)
  @ApiTags('Open APIs')
  @ApiOperation({ description: 'Batch cancel canary for deploys.' })
  @ApiResponse({ status: 200, type: IDeployScaleResponseDto, description: 'Return successful message' })
  @Put('/cancelcanary')
  cancelCanaryApplicationDeploys(
    @AuthUser() authUser: IAuthUser,
    @Param() deploymentInfo: ApiDeployPathParams,
    @Body() request: CancelCanaryDeployBody,
    @AuthToken() authToken: string
  ) {
    const { appName } = deploymentInfo
    if (this.openApiService.checkIsOam(appName)) {
      return this.openApiService.cancelCanary(deploymentInfo, request, authToken)
    } else {
      return this.deploymentsService.cancelCanaryDeploys(authUser, deploymentInfo, request, authToken)
    }
  }

  @AuditResourceType(AUDIT_RESOURCE_TYPE.DEPLOY)
  @ApiTags('Open APIs')
  @ApiOperation({ description: 'Batch full release deploys.' })
  @ApiResponse({ status: 200, type: IDeployScaleResponseDto, description: 'Return successful message' })
  @Put('/deploysfullRelease')
  fullReleaseApplicationDeploys(
    @AuthUser() authUser: IAuthUser,
    @Param() deploymentInfo: ApiDeployPathParams,
    @Body() request: FullReleaseBody,
    @AuthToken() authToken: string
  ) {
    const { appName } = deploymentInfo
    if (this.openApiService.checkIsOam(appName)) {
      return this.openApiService.fullRelease(deploymentInfo, request, authToken)
    } else {
      return this.deploymentsService.fullReleaseApplicationDeploys(authUser, deploymentInfo, request, authToken)
    }
  }

  @AuditResourceType(AUDIT_RESOURCE_TYPE.DEPLOY)
  @ApiTags('Open APIs')
  @ApiOperation({ description: 'Batch rollback deploys.' })
  @ApiResponse({ status: 200, type: IDeployScaleResponseDto, description: 'Return successful message' })
  @Put('/deploysrollback')
  async rollbackDeployment(
    @AuthUser() authUser: IAuthUser,
    @Param() rollbackDeploymentParamsDto: RollbackDeploymentRequestParamsDto,
    @Body() rollbackDeploymentBodyDto: RollbackDeploymentRequestBodyDto,
    @AuthToken() authToken: string
  ) {
    const { appName } = rollbackDeploymentParamsDto
    if (this.openApiService.checkIsOam(appName)) {
      return this.openApiService.rollback(rollbackDeploymentParamsDto, rollbackDeploymentBodyDto, authToken)
    } else {
      return this.deploymentsService.rollbackDeployment(
        authUser,
        rollbackDeploymentParamsDto,
        rollbackDeploymentBodyDto,
        authToken
      )
    }
  }

  @AuditResourceType(AUDIT_RESOURCE_TYPE.DEPLOY)
  @ApiTags('Open APIs')
  @ApiOperation({ description: 'Batch rollout restart deploys.' })
  @Put('/deploysrolloutRestart')
  async rolloutRestartDeployment(
    @AuthUser() authUser: IAuthUser,
    @Param() rolloutRestartDeploymentParamsDto: RolloutRestartDeploymentRequestParamsDto,
    @Body() rolloutRestartDeploymentBodyDto: RolloutRestartDeploymentRequestBodyDto,
    @AuthToken() authToken: string
  ) {
    const { appName } = rolloutRestartDeploymentParamsDto
    if (this.openApiService.checkIsOam(appName)) {
      return this.openApiService.rolloutRestart(
        rolloutRestartDeploymentParamsDto,
        rolloutRestartDeploymentBodyDto,
        authToken
      )
    } else {
      return this.deploymentsService.rolloutRestart(
        authUser,
        rolloutRestartDeploymentParamsDto,
        rolloutRestartDeploymentBodyDto,
        authToken
      )
    }
  }

  @Get('/deploys/:deployName/clusters/:clusterName/basicInfo')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.DEPLOY)
  @ApiResponse({ status: 200, type: GetDeploymentBasicInfoResponseDto, description: 'Get deployment basic info' })
  getDeploymentBasicInfo(
    @Param() deploymentInfo: ApiDeploymentClusterInfo,
    @Query('clusterId') clusterId: string,
    @Query('isCanary', ParseBoolPipe) isCanary: boolean,
    @AuthToken() authToken: string
  ) {
    return this.deploymentsService.getDeploymentBasicInfo(deploymentInfo, clusterId, isCanary, authToken)
  }

  @Get('/deploys/:deployName/latestAbnormalEvents')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.DEPLOY)
  @ApiResponse({ status: 200, type: IDeploymentLatestEvents, description: 'Get deployment events' })
  getDeploymentEvents(
    @Param() params: IDeploymentEventsParamsDto,
    @Query() query: IDeploymentEventsQuery,
    @AuthToken() authToken: string
  ) {
    return this.deploymentsService.getDeploymentLatestAbnormalEvents({ ...params, ...query }, authToken)
  }

  @Delete('deploys/:deployName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.DEPLOY)
  @ApiResponse({ status: HttpStatus.OK, type: IDeployScaleResponseDto, description: 'Delete a deployment' })
  async deleteDeploymeny(
    @Param() deleteDeploymentParam: DeleteDeploymentParam,
    @Body() deleteDeploymentBody: DeleteDeploymentBody,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    const { tenantId, deployName, projectName } = deleteDeploymentParam
    const { cluster, phase } = deleteDeploymentBody
    const { env, cid, clusterName } = parseClusterId(cluster)

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    const hasPermission = RBACCheckTenantResourceAction(
      tenantPermissions,
      tenantId,
      RESOURCE_TYPE.DEPLOYMENT,
      env.toUpperCase() === ENV.live ? RESOURCE_ACTION.DeleteLive : RESOURCE_ACTION.DeleteNonLive
    )

    if (!hasPermission) {
      throw new ForbiddenException(`you do not have permission to delete deployment ${deployName}`)
    }

    const globalConfig = this.configService.get<IGlobalConfig>('global')
    const { deleteDeploymentConfig } = globalConfig
    const { allowDeleteClusters = [], prohibitDeleteProjects = [] } = deleteDeploymentConfig
    const deletable = allowDeleteClusters.includes(clusterName) && !prohibitDeleteProjects.includes(projectName)
    if (!deletable) {
      throw new ForbiddenException('Not allow to delete this deployment!')
    }

    const deleteDeploymentQuery = {
      cluster: clusterName,
      phase,
      env: env.toLocaleLowerCase(),
      cid: cid.toLocaleLowerCase()
    }

    const result = this.openApiService.deleteDeployment(deleteDeploymentParam, deleteDeploymentQuery, authToken)
    return result
  }
}
