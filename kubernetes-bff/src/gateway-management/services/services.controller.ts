import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  Query,
  Body,
  Put,
  Delete,
  BadRequestException,
  NotFoundException,
  Req
} from '@nestjs/common'
import { ServicesService } from './services.service'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'

import {
  GetServiceListParamsDto,
  IServiceList,
  GetServiceDetailParamsDto,
  IServiceDetail,
  ListQueryDto
} from './dto/list-services.dto'
import { ICreateServicePlayLoad } from './dto/creat-service.dto'
import { UpdateServiceParamsDto, IUpdateServicePlayLoad } from './dto/update-service.dto'
import { DeleteServiceQueryDto } from './dto/delete-service.dto'

import { Pagination } from 'common/decorators/methods'
import { PaginateInterceptor } from 'common/interceptors/paginate.interceptor'
import { parseFiltersMap } from 'common/helpers/filter'
import { ApiTags } from '@nestjs/swagger'
import { parseServiceName } from 'common/helpers/service'
import { generateProjectNamespace } from 'common/helpers/project'
import { AuthService } from 'common/modules/auth/auth.service'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'common/constants/rbac'
import { TenantResourceGuard, TENANT_LOCATION } from 'common/decorators/parameters/TenantResourceGuard'

@ApiTags('Services')
@Controller()
export class ServicesController {
  constructor(
    private servicesService: ServicesService,
    private authService: AuthService,
    private projectsService: ProjectsService
  ) {}

  @Get('/tenants/:tenantId/projects/:project/services')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.SERVICE,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.SERVICE)
  @Pagination({
    key: 'svcs',
    countKey: 'totalCount',
    defaultOrder: 'name'
  })
  @UseInterceptors(PaginateInterceptor)
  async getServiceList(
    @Param() params: GetServiceListParamsDto,
    @Query() query: ListQueryDto,
    @AuthToken() authToken: string
  ): Promise<IServiceList> {
    const { tenantId, project } = params
    const { filterBy } = query

    // filter cluster to reduce requests
    const queryMap = parseFiltersMap(filterBy)

    const queryClusterNameList = Object.keys(queryMap).includes('clusterName') ? queryMap.clusterName : []
    await this.authService.getTenantById(tenantId, authToken)
    return await this.servicesService.getServiceList(tenantId, project, queryClusterNameList)
  }

  @Post('/tenants/:tenantId/projects/:project/services')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.SERVICE,
    action: RESOURCE_ACTION.Create
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.SERVICE)
  async createService(
    @Param() params: GetServiceListParamsDto,
    @Body() payload: ICreateServicePlayLoad,
    @AuthToken() authToken: string
  ) {
    const { tenantId, project } = params
    const { type, externalName, ports, selector } = payload

    this.servicesService.validateServiceType(type, externalName, ports, selector)
    await this.authService.getTenantById(tenantId, authToken)
    return await this.servicesService.createServices(tenantId, project, payload)
  }

  @Put('/tenants/:tenantId/projects/:project/services/:svc')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.SERVICE)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.SERVICE,
    action: RESOURCE_ACTION.Edit
  })
  async updateService(
    @Param() params: UpdateServiceParamsDto,
    @Body() payload: IUpdateServicePlayLoad,
    @AuthToken() authToken: string
  ) {
    const { tenantId, project, svc } = params
    const { prefix, env: envList, cid: cidList, cluster, type, externalName, ports, selector, clusterIp } = payload

    this.servicesService.validateServiceType(type, externalName, ports, selector)

    // only one service should be updated once
    const serviceInfo = {
      serviceName: svc,
      prefix,
      env: envList && envList.length && envList[0],
      cid: cidList && cidList.length && cidList[0],
      clusterName: cluster,
      serviceType: type,
      externalName,
      ports,
      selectorList: selector,
      clusterIp: clusterIp
    }
    await this.authService.getTenantById(tenantId, authToken)
    return await this.servicesService.updateService(tenantId, project, serviceInfo)
  }

  @Delete('/tenants/:tenantId/projects/:project/services/:svc')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.SERVICE)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.SERVICE,
    action: RESOURCE_ACTION.Delete
  })
  async deleteService(
    @Param() params: UpdateServiceParamsDto,
    @Query() query: DeleteServiceQueryDto,
    @AuthToken() authToken: string
  ) {
    const { tenantId, project: projectName, svc: serviceName } = params
    const { cluster: clusterName } = query
    await this.authService.getTenantById(tenantId, authToken)
    return await this.servicesService.deleteService(tenantId, projectName, serviceName, clusterName)
  }

  @Get('/tenants/:tenantId/projects/:projectName/services/:serviceName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.SERVICE)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.SERVICE,
    action: RESOURCE_ACTION.View
  })
  async getServiceDetail(
    @Param() params: GetServiceDetailParamsDto,
    @Query('cluster') clusterName: string,
    @AuthToken() authToken: string
  ): Promise<IServiceDetail> {
    const { tenantId, projectName, serviceName } = params
    if (!clusterName) {
      throw new BadRequestException('Request cluster should not be empty!')
    }
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    const projectDetail = await this.projectsService.getEsProject(projectName, tenantId)
    if (!projectDetail) {
      throw new NotFoundException(`Request tenant '${tenantName}' project '${projectName}' doesn't exit`)
    }

    const { prefix, env, cid } = parseServiceName(serviceName)
    const clusterInfo = await this.servicesService.getClusterInfoByName(clusterName)
    const { config } = clusterInfo
    const namespace = generateProjectNamespace(projectName, env, cid)
    const agentServiceDetail = await this.servicesService.getServiceDetail(config, clusterName, namespace, serviceName)
    const {
      spec: { type }
    } = agentServiceDetail
    const { clusterIp, ports, selector, externalName } = this.servicesService.parseAgentServiceInfo(agentServiceDetail)

    const transformedServiceDetail: IServiceDetail = {
      prefix,
      env: [env],
      cid: [cid],
      cluster: clusterName,
      clusterIp,
      ports,
      selector,
      externalName,
      type
    }
    return transformedServiceDetail
  }
}
