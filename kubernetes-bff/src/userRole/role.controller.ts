import { Controller, Post, Body, Get, Param, Headers, Query, NotFoundException } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { RoleService } from './role.service'
import { AuthService } from 'common/modules/auth/auth.service'
import { ListQueryDto } from 'common/dtos/list.dto'

import {
  RoleApplyTenantUserBodyDto,
  IApplyResponse,
  IsRoleRequestPendingResponseDto,
  RoleApplyPlatformAdminBodyDto,
  ILatestNewUserTicket,
  IRoleBinding,
  ITenantRoles,
  IPlatformRoles,
  IChangeRoleApplyRequestBodyDto,
  IChangeRoleApplyResponse
} from './dto/role.dto'
import { GlobalResourceGuard } from 'common/decorators/parameters/GlobalResourceGuard'
import { RESOURCE_TYPE, RESOURCE_ACTION, PLATFORM_TENANT_ID } from 'common/constants/rbac'

import { AuthToken } from 'common/decorators/parameters/AuthToken'
@ApiTags('UserRole')
@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService, private readonly authService: AuthService) {}

  @Post('newUserApply/tenantUser')
  @ApiResponse({ type: IApplyResponse, description: 'Return ticketId and manager approver list' })
  newUserApplyForTenantUser(
    @Body() info: RoleApplyTenantUserBodyDto,
    @Headers('Host') host: string,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    return this.roleService.newUserApplyForTenantUser(info, host, authToken, authUser)
  }

  @Post('newUserApply/platformUser')
  @ApiResponse({ type: IApplyResponse, description: 'Return ticketId and manager approver list' })
  newUserApplyForPlatformUser(
    @Body() info: RoleApplyPlatformAdminBodyDto,
    @Headers('Host') host: string,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    return this.roleService.newUserApplyForPlatformUser(info, host, authToken, authUser)
  }

  // @Post('addRole')
  // @ApiResponse({ type: AccessApplyResponseDto, description: 'Return apply link and manager email' })
  // addRole(@Body() info: RoleApplyRequestBodyDto, @AuthUser() authUser: IAuthUser, @Headers('Host') host: string) {
  //   return this.roleService.addRole(info, authUser, host)
  // }

  @Post('oldUserApply/changeRole')
  @ApiResponse({ type: IChangeRoleApplyResponse, description: 'apply for role change' })
  changeRole(
    @Body() info: IChangeRoleApplyRequestBodyDto,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string,
    @Headers('Host') host: string
  ) {
    return this.roleService.changeRole(info, authUser, host, authToken)
  }

  @Get('isRoleRequestPending')
  @ApiResponse({ type: IsRoleRequestPendingResponseDto, description: 'return if role apply is pending' })
  isRoleRequestPending(@AuthUser() authUser: IAuthUser) {
    return this.roleService.isRoleRequestPending(authUser)
  }

  @Get('latestNewUserTicketStatus/:userId')
  @ApiResponse({ type: ILatestNewUserTicket, description: 'Return latest new user apply ticket' })
  getLatestNewUserTicketStatus(@Param('userId') userId: number, @AuthToken() authToken: string) {
    return this.roleService.latestNewUserTicketStatus(userId, authToken)
  }

  @Get('getUserRoleBinding/:userId')
  @ApiResponse({ type: IRoleBinding, description: 'Return user roles' })
  getRbacUserInfo(@Param('userId') userId: number, @AuthToken() authToken: string) {
    try {
      return this.authService.getUserRoles(userId, authToken)
    } catch {
      return { roles: [] }
    }
  }

  @Get('tenants/:tenantId/roles')
  @ApiResponse({ type: ITenantRoles, description: 'Return tenant roles' })
  async getTenantPermissionGroups(@Param('tenantId') tenantId: number, @AuthToken() authToken: string) {
    const permissionsGroups = await this.authService.getTenantRoles(tenantId, authToken)
    return { roles: permissionsGroups.roles, totalCount: permissionsGroups.totalSize }
  }

  @Get('tenantsRoles')
  @ApiResponse({ type: ITenantRoles, description: 'Return all tenants roles' })
  async getTenantsRoles(@AuthToken() authToken: string) {
    const allTenants = await this.authService.getAllTenants(authToken)
    const { tenants, totalSize } = allTenants
    if (!totalSize) {
      throw new NotFoundException('No tenants available!')
    }
    // All tenants have same roles
    const firstTenant = tenants[0]
    const tenantRoles = await this.authService.getTenantRoles(firstTenant.id, authToken)
    const { roles = [] } = tenantRoles || {}
    const tenantsRoles = tenants.map(({ id, name }) => {
      return { tenantId: id, tenantName: name, roles }
    })
    return { tenantsRoles, totalCount: totalSize }
  }

  @Get('globalRoles')
  @ApiResponse({ type: IPlatformRoles, description: 'Return platform roles' })
  async getPlatformRoles(@AuthToken() authToken: string) {
    const permissionsGroups = await this.authService.getTenantRoles(PLATFORM_TENANT_ID, authToken)
    const { roles, totalSize } = permissionsGroups
    return { roles, totalCount: totalSize }
  }

  @Get('global/users')
  @GlobalResourceGuard({
    resource: RESOURCE_TYPE.GLOBAL_USER,
    action: RESOURCE_ACTION.View
  })
  // @UseInterceptors(PaginateInterceptor)
  @ApiResponse({ status: 200, description: 'Get tenant user list' })
  getGlobalUserList(@Query() query: ListQueryDto, @AuthToken() authToken: string) {
    return this.authService.getTenantUserList(PLATFORM_TENANT_ID, query, authToken)
  }

  @Get('global/bots')
  @GlobalResourceGuard({
    resource: RESOURCE_TYPE.GLOBAL_BOT,
    action: RESOURCE_ACTION.View
  })
  // @UseInterceptors(PaginateInterceptor)
  @ApiResponse({ status: 200, description: 'Get tenant user list' })
  getGlobalBotList(@Query() query: ListQueryDto, @AuthToken() authToken: string) {
    return this.authService.getTenantBotList(PLATFORM_TENANT_ID, query, authToken)
  }
}
