import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Get,
  Query,
  HttpStatus,
  Res,
  Header
} from '@nestjs/common'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { Response } from 'express'
import { constants as HTTP_CONSTANTS } from 'http2'

import { ApplicationsService } from 'applications-management/applications/applications.service'
import {
  ICreateApplicationDto,
  IApplicationTemplate
} from 'applications-management/applications/dto/create-application.dto'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { EventService } from 'common/modules/event/event.service'

import { EsBooleanSync, Pagination } from 'common/decorators/methods'
import { EsBooleanSyncInterceptor } from 'common/interceptors/esBooleanSync.interceptor'
import { ApplicationParamsDto, ApplicationsParamsDto } from 'applications-management/applications/dto/common/params.dto'
import { ApplicationGetResponseDto } from 'applications-management/applications/dto/get-application.dto'
import { ApplicationDeploysFilterInfo } from 'applications-management/applications/dto/get-applicationDeploysFliterInfo.dto'
import { PaginateInterceptor } from 'common/interceptors/paginate.interceptor'
import { ListQueryDto } from 'applications-management/projects/dto/create-project.dto'
import { ProjectApplicationsResponseDto } from 'applications-management/applications/dto/get-projectApplications.dto'
import {
  ApplicationDeploysQueryDto,
  ApplicationDeploysResponseDto,
  GetApplicationEventsResponseDto
} from 'applications-management/applications/dto/get-applicationDeploys.dto'
import {
  ApplicationConfigParamsDto,
  ApplicationConfigHistoryQueryDto,
  ApplicationConfigReleaseQueryDto,
  IApplicationConfigHistoryListDto,
  IConfigReleaseResponseDto,
  ICreateApplicationConfigBodyDto,
  INewApplicationConfigDto,
  ApplicationReplayDetailParamsDto,
  ApplicationTerminalConfigParamsDto
} from 'applications-management/applications/dto/get-applicationConfig.dto'
import { RbacUser } from 'common/decorators/parameters/RbacUser'
import { IRbacUser } from 'rbac/entities/rbac.entity'
import { parseFiltersMap } from 'common/helpers/filter'
import { IEvent } from 'applications-management/applications/entities/application.entity'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import {
  ApplicationTerminalLogsQueryDto,
  ApplicationTerminalLogsResponseDto
} from 'applications-management/applications/dto/get-application-terminal-logs.dto'
import { AuthService } from 'common/modules/auth/auth.service'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { ESIndex } from 'common/constants/es'
import { TenantResourceGuard, TENANT_LOCATION } from 'common/decorators/parameters/TenantResourceGuard'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'common/constants/rbac'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import {
  ApplicationTerminalReplayDetailQueryDto,
  ApplicationTerminalReplaysResponseDto,
  Replay
} from 'applications-management/applications/dto/get-application-terminal-replays.dto'
import { WriteStream } from 'fs'

@ApiTags('Applications')
@Controller('tenants/:tenantId/projects/:projectName/apps')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private eventService: EventService,
    private authService: AuthService,
    private openApiService: OpenApiService
  ) {}

  @Get()
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @Pagination({
    key: 'apps',
    countKey: 'totalCount',
    defaultOrder: 'name'
  })
  @UseInterceptors(PaginateInterceptor)
  @ApiResponse({ status: 200, type: ProjectApplicationsResponseDto, description: 'Get applications of a project' })
  getProjectApplications(
    @Param() params: ApplicationsParamsDto,
    @Query() query: ListQueryDto,
    @AuthToken() authToken: string
  ): Promise<ProjectApplicationsResponseDto> {
    return this.applicationsService.getApplications(params, authToken)
  }

  @Get(':appName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: ApplicationGetResponseDto, description: 'Get an application' })
  getApplication(
    @Param() params: ApplicationParamsDto,
    @AuthToken() authToken: string
  ): Promise<ApplicationGetResponseDto> {
    return this.applicationsService.getApplication(params, authToken)
  }

  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.Create
  })
  @Post()
  @EsBooleanSync({
    esIndex: ESIndex.APPLICATION_TEMPLATE,
    esBooleanQueryItems: [
      {
        queryKey: 'project',
        dataIndex: 'projectName',
        position: 'params'
      },
      {
        queryKey: 'app',
        dataIndex: 'appName',
        position: 'body'
      }
    ],
    operation: 'create'
  })
  @UseInterceptors(EsBooleanSyncInterceptor)
  @ApiResponse({ status: 201, type: IApplicationTemplate, description: 'Create an application' })
  async createApplication(
    @Param('tenantId') tenantId: string,
    @Param('projectName') projectName: string,
    @Body() createApplicationDto: ICreateApplicationDto,
    @AuthToken() authToken: string
  ): Promise<IApplicationTemplate> {
    return this.applicationsService.createApplication(tenantId, projectName, authToken, createApplicationDto)
  }

  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.Delete
  })
  @Delete(':name')
  @EsBooleanSync({
    esIndex: ESIndex.APPLICATION,
    esBooleanQueryItems: [
      {
        queryKey: 'project',
        dataIndex: 'projectName',
        position: 'params'
      },
      {
        queryKey: 'app',
        dataIndex: 'name',
        position: 'params'
      }
    ],
    operation: 'delete'
  })
  @UseInterceptors(EsBooleanSyncInterceptor)
  @ApiResponse({ status: 200, type: null, description: 'Delete an application' })
  async deleteApplication(
    @Param('tenantId') tenantId: string,
    @Param('projectName') projectName: string,
    @Param('name') name: string
  ) {
    return this.applicationsService.deleteApplication(Number(tenantId), projectName, name)
  }

  @Get(':appName/deploysFilterInfo')
  @ApiResponse({
    status: 200,
    type: ApplicationDeploysFilterInfo,
    description: 'Get deployment list filter of an application'
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  getDeploysFilterInfo(
    @Param() params: ApplicationParamsDto,
    @AuthToken() authToken: string
  ): Promise<ApplicationDeploysFilterInfo> {
    return this.applicationsService.getApplicationDeploysInfo(params, authToken)
  }

  @Get(':appName/deploys')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  // @Pagination({
  //   key: 'deploys',
  //   countKey: 'totalCount',
  //   defaultOrder: 'name'
  // })
  // @UseInterceptors(PaginateInterceptor)
  @ApiTags('Open APIs')
  @ApiOperation({ description: 'Get application deploy list.' })
  @ApiResponse({ status: 200, type: ApplicationDeploysResponseDto, description: 'List application deploys detail' })
  getApplicationDeploys(
    @Param() params: ApplicationParamsDto,
    @Query() query: ApplicationDeploysQueryDto,
    @RbacUser() rbacUser: IRbacUser,
    @AuthToken() authToken: string
  ) {
    const { appName } = params
    if (this.openApiService.checkIsOam(appName)) {
      return this.openApiService.getDeploys(params, query, authToken)
    } else {
      return this.applicationsService.getApplicationDeploys(params, query, authToken)
    }
  }

  @Get(':appName/events')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: GetApplicationEventsResponseDto, description: 'List application deploy' })
  async getApplicationEvents(
    @Param() params: ApplicationParamsDto,
    @Query() query: ListQueryDto,
    @AuthToken() authToken: string
  ) {
    const { projectName, appName } = params
    const { offset, limit, orderBy, filterBy } = query

    const clusterList = await this.applicationsService.getClustersByApp(params, authToken)
    const queryObject = parseFiltersMap(filterBy)
    const { creationTimestamp = [], name = [], namespace = [], kind = [], all = [] } = queryObject

    const startTime = creationTimestamp[0] || ''
    const endTime = creationTimestamp[1] || ''
    const queryItems = {
      cluster: [...clusterList],
      name,
      namespace,
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
      appName
    })

    const events: IEvent[] = esEvents.map((esEvent: any) => {
      const { name, namespace, message, reason, kind, createtime, podip: tempPod, hostip: tempHost } = esEvent
      return { name, namespace, message, reason, kind, creationTimestamp: createtime, podip: tempHost, hostip: tempPod }
    })

    return { totalCount, events, kindList }
  }

  @Get(':appName/configHistory')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: IApplicationConfigHistoryListDto, description: 'List application config history' })
  async getApplicationConfigHistory(
    @Param() params: ApplicationConfigParamsDto,
    @Query() query: ApplicationConfigHistoryQueryDto,
    @AuthToken() authToken: string
  ) {
    const { tenantId, projectName, appName } = params
    const { env, cluster, searchBy } = query
    await this.authService.getTenantById(tenantId, authToken)

    return await this.applicationsService.getApplicationConfigHistoryList({
      tenantId,
      projectName,
      appName,
      env,
      cluster,
      searchBy
    })
  }

  @Get(':appName/configRelease')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: IConfigReleaseResponseDto, description: 'List application config history' })
  async getApplicationReleaseConfig(
    @Param() params: ApplicationConfigParamsDto,
    @Query() query: ApplicationConfigReleaseQueryDto,
    @AuthToken() authToken: string
  ) {
    const { tenantId, projectName, appName } = params
    const { env, cluster } = query
    await this.authService.getTenantById(tenantId, authToken)

    return await this.applicationsService.getApplicationReleaseConfig({
      tenantId,
      projectName,
      appName,
      env,
      cluster
    })
  }

  @Get(':appName/configLatest')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: IConfigReleaseResponseDto, description: 'get application latest config' })
  async getApplicationLatestConfig(
    @Param() params: ApplicationConfigParamsDto,
    @Query() query: ApplicationConfigReleaseQueryDto,
    @AuthToken() authToken: string
  ) {
    const { tenantId, projectName, appName } = params
    const { env, cluster } = query
    await this.authService.getTenantById(tenantId, authToken)

    return await this.applicationsService.getApplicationLatestConfig({
      tenantId,
      projectName,
      appName,
      env,
      cluster
    })
  }

  @Post(':appName/config')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION_DEPLOY_CONFIG,
    action: RESOURCE_ACTION.Edit
  })
  @ApiResponse({ status: 200, type: INewApplicationConfigDto, description: 'get application latest config' })
  async createApplicationConfig(
    @Param() params: ApplicationConfigParamsDto,
    @Body() body: ICreateApplicationConfigBodyDto,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const { tenantId, projectName, appName } = params
    await this.applicationsService.checkApplicationConfig(tenantId, projectName, appName, body, authToken)
    // huadong TODO alias tenant = group
    return await this.applicationsService.createApplicationConfig(
      tenantId,
      projectName,
      appName,
      body,
      authUser,
      authToken
    )
  }

  @Get(':appName/terminalCommandLogs')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @ApiResponse({ status: 200, type: ApplicationTerminalLogsResponseDto, description: 'get application terminal logs' })
  async getApplicationTerminalCommandLogs(
    @Param() params: ApplicationTerminalConfigParamsDto,
    @Query() query: ApplicationTerminalLogsQueryDto,
    @AuthUser() authUser: IAuthUser
  ) {
    return await this.applicationsService.getApplicationTerminalData(
      params,
      query,
      authUser.roles,
      authUser.Email,
      ESIndex.TERMINAL_LOG
    )
  }

  @Get(':appName/terminalCommandReplays')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ApplicationTerminalReplaysResponseDto,
    description: 'get application terminal replays'
  })
  async getApplicationTerminalCommandReplays(
    @Param() params: ApplicationTerminalConfigParamsDto,
    @Query() query: ApplicationTerminalLogsQueryDto,
    @AuthUser() authUser: IAuthUser
  ) {
    return await this.applicationsService.getApplicationTerminalData(
      params,
      query,
      authUser.roles,
      authUser.Email,
      ESIndex.TERMINAL_REPLAY
    )
  }

  @Get(':appName/terminalCommandReplay/:sessionId')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Replay,
    description: 'get application terminal replay detail'
  })
  async getApplicationTerminalCommandReplayDetail(
    @Param() params: ApplicationReplayDetailParamsDto,
    @Query() query: ApplicationTerminalReplayDetailQueryDto,
    @AuthUser() authUser: IAuthUser
  ) {
    return await this.applicationsService.getApplicationTerminalReplayDetail(
      params,
      query,
      authUser.roles,
      authUser.Email
    )
  }

  @Get(':appName/terminalCommandReplay/:sessionId/fileData')
  @Header(HTTP_CONSTANTS.HTTP2_HEADER_CONTENT_TYPE, 'application/x-asciicast')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @ApiResponse({
    status: HttpStatus.OK,
    type: WriteStream,
    description: 'get application terminal replay file data'
  })
  async getApplicationTerminalCommandReplayFileData(
    @Param() params: ApplicationReplayDetailParamsDto,
    @Query('createdTime') createdTime: string,
    @AuthUser() authUser: IAuthUser,
    @Res() response: Response
  ) {
    const terminalReplayFileData = await this.applicationsService.getApplicationTerminalReplayFileData(
      params,
      createdTime,
      authUser.roles,
      authUser.Email
    )

    terminalReplayFileData.pipe(response)
  }
}
