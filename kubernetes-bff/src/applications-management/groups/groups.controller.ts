import { Body, Controller, Get, Param, Query, Post, Patch, Delete, ForbiddenException } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { GroupsService } from './groups.service'
import {
  IGroupDetail,
  IMetricsDto,
  ITenantList,
  ITenantDetailParams,
  ITenant,
  ICreateTenantBodyDto,
  IUpdateTenantBodyDto,
  IAddTenantBotBodyDto,
  IAddTenantUsersBodyDto,
  IUpdateTenantUserBodyDto,
  IUpdateTenantUserParamsDto,
  IDeleteTenantUserParamsDto,
  IUpdateTenantBotBodyDto,
  IUpdateTenantBotParamsDto,
  IDeleteTenantBotParamsDto,
  IGenerateBotAccessTokenBodyDto,
  IGenerateBotAccessTokenParamsDto
} from './dto/group.dto'
import { IProjectQuotasDto } from 'applications-management/projects/dto/project.quotas.dto'
import { ListQueryDto } from 'common/dtos/list.dto'
import { AuthService } from 'common/modules/auth/auth.service'
import { ProjectsService } from '../projects/projects.service'

import { IListQuery } from 'common/interfaces/authService.interface'

import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'common/constants/rbac'
import { TenantResourceGuard, TENANT_LOCATION } from 'common/decorators/parameters/TenantResourceGuard'
import { GlobalResourceGuard } from 'common/decorators/parameters/GlobalResourceGuard'

@ApiTags('Tenants')
@Controller('tenants')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly authService: AuthService,
    private readonly projectsService: ProjectsService
  ) {}

  @Get(':tenantId')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, type: IGroupDetail, description: 'Get group detail' })
  getDetail(@Param() params: ITenantDetailParams, @AuthToken() authToken: string) {
    const { tenantId } = params
    return this.groupsService.getDetail(tenantId, authToken)
  }

  @Get(':tenantId/metrics')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, type: IMetricsDto, description: 'Create group metrics' })
  getGroupMetrics(
    @Param('tenantId') tenantId: number,
    @Query('env') envName: string,
    @Query('cluster') clusterName: string,
    @AuthToken() authToken: string
  ) {
    return this.groupsService.getGroupMetrics(tenantId, envName, clusterName, authToken)
  }

  @Get(':tenantId/projectEnvQuotas')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RESOURCE_QUOTA)
  @ApiResponse({ status: 200, type: IProjectQuotasDto, description: 'Create project quotas by environments and cids' })
  getProjectEnvQuotas(
    @Param('tenantId') tenantId: number,
    @Query('environments') envs: string[],
    @Query('cids') cids: string[],
    @AuthToken() authToken: string
  ) {
    return this.groupsService.getProjectEnvQuotas(tenantId, envs, cids, authToken)
  }

  @Get()
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, type: ITenantList, description: 'Get tenant list' })
  async getTenantList(@AuthToken() authToken: string, @Query() query: ListQueryDto) {
    const allTenants = await this.authService.getTenantList(authToken, query)
    const { tenants, totalSize } = allTenants
    return { tenantList: tenants, totalCount: totalSize }
  }

  @Post()
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, type: ITenant, description: 'Create a new Tenant' })
  @GlobalResourceGuard({
    resource: RESOURCE_TYPE.TENANT,
    action: RESOURCE_ACTION.Add
  })
  async createTenant(
    @Body() createTenantDto: ICreateTenantBodyDto,
    @AuthToken()
    authToken: string
  ) {
    return this.groupsService.createTenant(createTenantDto, authToken)
  }

  @Patch('/:tenantId')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, type: ITenant, description: 'Update Tenant info' })
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT,
    action: RESOURCE_ACTION.Edit
  })
  async updateTenant(
    @Param('tenantId') tenantId: number,
    @Body() updateTenantDto: IUpdateTenantBodyDto,
    @AuthToken()
    authToken: string
  ) {
    return this.authService.updateTenant(tenantId, updateTenantDto, authToken)
  }

  @Delete('/:tenantId')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, type: ITenant, description: 'Delete a Tenant' })
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT,
    action: RESOURCE_ACTION.Delete
  })
  async deleteTenant(
    @Param('tenantId') tenantId: number,
    @AuthToken()
    authToken: string
  ) {
    const projects = await this.projectsService.getList(tenantId, authToken)
    if (projects.totalCount > 0) {
      throw new ForbiddenException('Not allow to delete tenant with projects!')
    }
    return this.authService.deleteTenant(tenantId, authToken)
  }

  @Get(':tenantId/users')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT_USER,
    action: RESOURCE_ACTION.View
  })
  // @UseInterceptors(PaginateInterceptor)
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, description: 'Get tenant user list' })
  getTenantUserList(@Param('tenantId') tenantId: number, @Query() query: ListQueryDto, @AuthToken() authToken: string) {
    return this.authService.getTenantUserList(tenantId, query, authToken)
  }

  @Post(':tenantId/users')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, description: 'Add users to a tenant' })
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT_USER,
    action: RESOURCE_ACTION.Add
  })
  async addTenantUsers(
    @Param('tenantId') tenantId: number,
    @Body() body: IAddTenantUsersBodyDto,
    @AuthToken() authToken: string
  ) {
    return this.authService.addTenantUsers(tenantId, body, authToken)
  }

  @Patch(':tenantId/users/:userId')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, description: 'Update user info' })
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT_USER,
    action: RESOURCE_ACTION.Edit
  })
  async editTenantUser(
    @Param() params: IUpdateTenantUserParamsDto,
    @Body() body: IUpdateTenantUserBodyDto,
    @AuthToken() authToken: string
  ) {
    const { tenantId, userId } = params
    return this.authService.changeTenantUserRole(tenantId, userId, body, authToken)
  }

  @Delete(':tenantId/users/:userId')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT_USER,
    action: RESOURCE_ACTION.Delete
  })
  @ApiResponse({ status: 200, description: 'Remove a user from tenant' })
  async deleteTenantUser(@Param() params: IDeleteTenantUserParamsDto, @AuthToken() authToken: string) {
    const { tenantId, userId } = params
    const result = await this.authService.getUserRoles(Number(userId), authToken)
    if (!result || !result.roles) {
      throw new Error('Failed to delete the user')
    }

    const roles = result.roles

    const binding = roles.find((role) => {
      return role.tenantId === Number(tenantId)
    })
    return this.authService.deleteTenantUser(Number(tenantId), Number(userId), binding.roleId, authToken)
  }

  @Get(':tenantId/bots')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT_BOT,
    action: RESOURCE_ACTION.View
  })
  // @UseInterceptors(PaginateInterceptor)
  @ApiResponse({ status: 200, description: 'Get tenant bot list' })
  async getTenantBotList(
    @Param('tenantId') tenantId: number,
    @Query() query: ListQueryDto,
    @AuthToken() authToken: string
  ) {
    return this.authService.getTenantBotList(tenantId, query, authToken)
  }

  @Post(':tenantId/bots')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT_BOT,
    action: RESOURCE_ACTION.Add
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, description: 'Add a bot to tenant' })
  async addTenantBot(
    @Param('tenantId') tenantId: number,
    @Body() body: IAddTenantBotBodyDto,
    @AuthToken() authToken: string
  ) {
    return this.authService.addTenantBot(tenantId, body, authToken)
  }

  @Patch(':tenantId/bots/:botId')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT_BOT,
    action: RESOURCE_ACTION.Edit
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, description: 'Update bot info' })
  async editTenantBot(
    @Param() params: IUpdateTenantBotParamsDto,
    @Body() body: IUpdateTenantBotBodyDto,
    @AuthToken() authToken: string
  ) {
    const { tenantId, botId } = params
    return this.authService.updateTenantBot(tenantId, botId, body, authToken)
  }

  @Delete(':tenantId/bots/:botId')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT_BOT,
    action: RESOURCE_ACTION.Delete
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, description: 'Delete a bot from tenant' })
  async deleteTenantBot(@Param() params: IDeleteTenantBotParamsDto, @AuthToken() authToken: string) {
    const { tenantId, botId } = params
    return this.authService.deleteTenantBot(tenantId, botId, authToken)
  }

  @Post(':tenantId/bots/:botId/access_token')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT_BOT,
    action: RESOURCE_ACTION.Edit
  })
  @ApiResponse({ status: 200, description: 'Create access token for a bot' })
  async generateBotAccessToken(
    @Param() params: IGenerateBotAccessTokenParamsDto,
    @Body() body: IGenerateBotAccessTokenBodyDto,
    @AuthToken() authToken: string
  ) {
    const { tenantId, botId } = params
    return this.authService.generateBotAccessToken(tenantId, botId, body, authToken)
  }

  @Get(':tenantId/terminal/approvers')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  async listTerminalApprovers(@Param('tenantId') tenantId: string, @AuthToken() authToken: string) {
    const approvers = await this.authService.listTenantTerminalApprovers(Number(tenantId), authToken)
    const { users, totalSize } = approvers
    return { approvers: users, totalCount: totalSize }
  }
}
