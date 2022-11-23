import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import {
  Controller,
  Get,
  Param,
  Query,
  Delete,
  ForbiddenException,
  Body,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'

import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { EventService } from 'common/modules/event/event.service'

import { PodsService } from 'applications-management/pods/pods.service'
import {
  IPodListResponse,
  IGetPodListParams,
  IGetPodListQuery,
  IDeletePodParams,
  IDeletePodQuery,
  IBatchDeletePodParams,
  IBatchDeletePodsPayload,
  IPodContainerFileLogParams,
  IPodContainerFileLogQuery,
  GetApplicationEventsResponseDto
} from './dto/pod.dto'
import { GetPodEventParams, GetPodEventQuery } from './dto/get-event.dto'
import { parseFiltersMap } from 'common/helpers/filter'
import { GetPodDetailParamsDto, GetPodDetailQueryDto, GetPodDetailResponseDto } from './dto/get-pod-detail.dto'
import {
  GetPodContainerParamsDto,
  GetPodContainerQueryDto,
  GetPodContainerResponseDto
} from './dto/get-pod-container.dto'
import { parseClusterIdWithFte } from 'common/helpers/cluster'

import { RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'
import { RBACCheckTenantResourceAction } from 'common/helpers/rbac'
import { RbacUser } from 'common/decorators/parameters/RbacUser'
import { IRbacUser } from 'rbac/entities/rbac.entity'
import {
  GetLogDirectoryParamsDto,
  GetLogDirectoryQueryDto,
  GetLogDirectoryResponseDto,
  GetLogPreviousLogParamDto,
  GetPodPreviousLogQueryDto,
  GetPodPreviousLogResponse
} from './dto/get-log-directory.dto'
import { AuthService } from 'common/modules/auth/auth.service'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { TenantResourceGuard, TENANT_LOCATION } from 'common/decorators/parameters/TenantResourceGuard'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { ENV } from 'common/constants/env'

interface IEvent {
  name: string
  namespace: string
  message: string
  reason: string
  kind: string
  creationTimestamp: string
  podip: string
  hostip: string
}

@ApiTags('Pods')
@Controller('tenants/:tenantId/projects/:projectName/apps/:appName')
export class PodsController {
  constructor(
    private readonly podsService: PodsService,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  @Get('/deploys/:deployName/pods')
  @ApiTags('Open APIs')
  @ApiOperation({ description: 'Get deploy pod list.' })
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  @ApiResponse({ status: 200, type: IPodListResponse, description: 'Get pod list' })
  // @Pagination({
  //   key: 'pods',
  //   countKey: 'totalCount',
  //   defaultOrder: ''
  // })
  // @UseInterceptors(PaginateInterceptor)
  getDeploymentPods(
    @Param() params: IGetPodListParams,
    @Query() queryParams: IGetPodListQuery,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    return this.podsService.getDeploymentPods({ ...params, ...queryParams }, authToken, authUser, queryParams)
  }

  @Get('/pods/:podName/events')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  @ApiResponse({ status: 200, type: GetApplicationEventsResponseDto, description: 'Get pod events' })
  async getApplicationEvents(@Param() params: GetPodEventParams, @Query() query: GetPodEventQuery) {
    const { projectName, appName, podName } = params
    const { offset, limit, orderBy, filterBy, clusterId } = query

    const { clusterName } = parseClusterIdWithFte(clusterId)

    const queryObject = parseFiltersMap(filterBy)
    const { creationTimestamp = [], kind = [], all = [] } = queryObject

    const startTime = creationTimestamp[0] || ''
    const endTime = creationTimestamp[1] || ''
    const queryItems = {
      cluster: [clusterName],
      kind
    }
    const isDesc = orderBy && orderBy.includes('desc')

    const { eventList: esEvents, totalCount, kindList } = await this.eventService.getEvents({
      startTime,
      endTime,
      query: queryItems,
      searchAll: all,
      offset,
      limit,
      isCreateTimeDesc: isDesc,
      projectName,
      appName,
      podName
    })

    const events: IEvent[] = esEvents.map((esEvent: any) => {
      const { name, namespace, message, reason, kind, createtime, podip: tempPod, hostip: tempHost } = esEvent
      return { name, namespace, message, reason, kind, creationTimestamp: createtime, podip: tempHost, hostip: tempPod }
    })

    return { totalCount, events, kindList }
  }

  @Get('/pods/:podName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: GetPodDetailResponseDto, description: 'Get pod detail' })
  async getPodDetail(
    @Param() params: GetPodDetailParamsDto,
    @Query() query: GetPodDetailQueryDto,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    return this.podsService.getPodDetail(params, query, authToken, authUser)
  }

  @Get('/pods/:podName/containers/:containerName/envs')
  @ApiTags('Open APIs')
  @ApiOperation({ description: 'Get container envs.' })
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  @ApiResponse({ status: 200, type: GetPodContainerResponseDto, description: 'Get pod container envs' })
  async getPodContainerEnvs(
    @Param() params: GetPodContainerParamsDto,
    @Query() query: GetPodContainerQueryDto,
    @AuthToken() authToken: string
  ) {
    return this.podsService.getPodContainerEnvs(params, query, authToken)
  }

  @Delete('/pods/:podName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  async deleteOnePod(
    @AuthUser() authUser: IAuthUser,
    @Param() podParams: IDeletePodParams,
    @Query() query: IDeletePodQuery,
    @RbacUser() rbacUser: IRbacUser,
    @AuthToken() authToken: string
  ) {
    const { tenantId, projectName, appName, podName } = podParams
    const { clusterId } = query
    await this.authService.getTenantById(tenantId, authToken)
    const { env, clusterName } = parseClusterIdWithFte(clusterId)

    let hasPermission = false
    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    if (env.toUpperCase() === ENV.live) {
      hasPermission = RBACCheckTenantResourceAction(
        tenantPermissions,
        tenantId,
        RESOURCE_TYPE.POD,
        RESOURCE_ACTION.KillLive
      )
    } else {
      hasPermission = RBACCheckTenantResourceAction(
        tenantPermissions,
        tenantId,
        RESOURCE_TYPE.POD,
        RESOURCE_ACTION.KillNonLive
      )
    }

    if (!hasPermission) {
      throw new ForbiddenException(`You don't have permission to delete the pod ${podName}`)
    }

    return await this.podsService.deletePod(projectName, appName, podName, clusterName)
  }

  @Delete('/pods')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  async batchDeletePods(
    @AuthUser() authUser: IAuthUser,
    @Param() podParams: IBatchDeletePodParams,
    @Body() payload: IBatchDeletePodsPayload,
    @AuthToken() authToken: string
  ) {
    const { tenantId, projectName, appName } = podParams
    const { pods } = payload

    return await this.podsService.batchDeletePods(authUser, Number(tenantId), projectName, appName, pods, authToken)
  }

  @Get('/pods/:podName/containers/:containerName/logDirectory/:fileName')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  async getPodContainerFileLog(
    @Param() params: IPodContainerFileLogParams,
    @Query() query: IPodContainerFileLogQuery,
    @AuthToken() authToken: string
  ) {
    const { tenantId, projectName, appName, podName, containerName, fileName } = params
    const { clusterId, searchBy } = query
    await this.authService.getTenantById(tenantId, authToken)

    // check if filename is validated
    const { files } = await this.getLogDirectory(
      { tenantId, projectName, appName, podName, containerName },
      { clusterId },
      authToken
    )

    const isValidatedFilename = files.some((item) => {
      const { name } = item
      return fileName === name
    })

    if (!isValidatedFilename) {
      throw new NotFoundException(`Log file: ${fileName} is not validated log filename `)
    }

    return await this.podsService.getPodContainerFileLog(
      projectName,
      appName,
      podName,
      containerName,
      fileName,
      clusterId,
      searchBy
    )
  }

  @Get('/pods/:podName/containers/:containerName/logDirectory')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: GetLogDirectoryResponseDto })
  async getLogDirectory(
    @Param() params: GetLogDirectoryParamsDto,
    @Query() query: GetLogDirectoryQueryDto,
    @AuthToken() authToken: string
  ) {
    return this.podsService.getLogDirectory(params, query, authToken)
  }

  @Get('/pods/:podName/containers/:containerName/previousLog')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: GetPodPreviousLogResponse })
  async getLogPrevousLog(
    @Param() params: GetLogPreviousLogParamDto,
    @Query() query: GetPodPreviousLogQueryDto,
    @AuthToken() token: string
  ): Promise<GetPodPreviousLogResponse> {
    const { appName, podName, containerName, projectName, tenantId } = params
    const { clusterId } = query
    const logString = await this.podsService
      .getPodPreviousLog(tenantId, clusterId, podName, containerName, projectName, appName, token)
      .catch((err) => {
        throw new InternalServerErrorException(err)
      })
    return {
      logString
    }
  }
}
