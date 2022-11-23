import { Controller, Get, Query, Param, Delete, Body, Post } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { AccountService } from '@/features/account/account.service'
import {
  ListGlobalUsersResponse,
  ListAllRolesResponse,
  DeleteUserRoleBody,
  CreateUsersBody,
} from '@/common/dtos/openApi/account.dto'
import {
  ListGlobalUsersQuery,
  GetUserDetailResponse,
  GetUserDetailParams,
  ListTenantUsersQuery,
  ListTenantUsersParams,
  ListProjectUsersParams,
  ListProjectUsersQuery,
  DeleteUserRoleParams,
} from '@/features/account/dto/account.dto'
import { transformFrontendListQueryToOpenApiListQuery } from '@/common/utils/query'
import { TENANT_ADMIN_ID, TENANT_MEMBER_ID } from '@/common/constants/roles'

@ApiTags('Account')
@Controller()
export class AccountController {
  constructor(private readonly openApiService: OpenApiService, private readonly accountService: AccountService) {}

  @Get('globalUsers')
  @ApiResponse({ description: 'List global users' })
  listGlobalUsers(@Query() listGlobalUsersQuery: ListGlobalUsersQuery): Promise<ListGlobalUsersResponse> {
    const openApiListGlobalUsersQuery = transformFrontendListQueryToOpenApiListQuery(listGlobalUsersQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListGlobalUsersQuery
    return this.openApiService.listGlobalUsers({ offset, limit, filterBy, sortBy, keyword })
  }

  @Get('user/:userId')
  @ApiResponse({ description: 'Get user detail with permissions' })
  getUserDetail(@Param() getUserDetailParams: GetUserDetailParams): Promise<GetUserDetailResponse> {
    const { userId } = getUserDetailParams
    return this.accountService.getUserDetail(userId)
  }

  @Get('roles')
  listAllRoles(): Promise<ListAllRolesResponse> {
    return this.openApiService.listAllRoles()
  }

  @Get('tenants/:tenantId/user')
  @ApiResponse({ description: 'List tenants users' })
  listTenantUsers(
    @Query() listTenantUsersQuery: ListTenantUsersQuery,
    @Param() listTenantUsersParams: ListTenantUsersParams,
  ): Promise<ListGlobalUsersResponse> {
    const { tenantId } = listTenantUsersParams
    const openApiListTenantUsersQuery = transformFrontendListQueryToOpenApiListQuery(listTenantUsersQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListTenantUsersQuery
    const defaultFilter = `roleId==${TENANT_ADMIN_ID},${TENANT_MEMBER_ID}`
    const mergedFilterBy = filterBy || defaultFilter
    return this.openApiService.listTenantUsers(tenantId, { offset, limit, filterBy: mergedFilterBy, sortBy, keyword })
  }

  @Get('tenants/:tenantId/projects/:projectId/user')
  @ApiResponse({ description: 'List project users' })
  listProjectUsers(
    @Query() listProjectUsersQuery: ListProjectUsersQuery,
    @Param() listProjectUsersParams: ListProjectUsersParams,
  ): Promise<ListGlobalUsersResponse> {
    const { tenantId, projectId } = listProjectUsersParams
    const openApiListProjectUsersQuery = transformFrontendListQueryToOpenApiListQuery(listProjectUsersQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListProjectUsersQuery
    return this.openApiService.listProjectUsers(tenantId, projectId, { offset, limit, filterBy, sortBy, keyword })
  }

  @Delete('users/:userId/roles')
  deleteUserRole(@Param() deleteUserRoleParams: DeleteUserRoleParams, @Body() deleteUserRoleBody: DeleteUserRoleBody) {
    return this.openApiService.deleteUserRole(deleteUserRoleParams.userId, deleteUserRoleBody)
  }

  @Post('users')
  @ApiResponse({ description: 'batch add users' })
  createUsers(@Body() createUsersBody: CreateUsersBody) {
    return this.openApiService.createUsers(createUsersBody)
  }
}
