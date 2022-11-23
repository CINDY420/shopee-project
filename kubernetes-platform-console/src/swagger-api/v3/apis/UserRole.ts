import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IRoleControllerNewUserApplyForTenantUserParams {
  payload: types.IRoleApplyTenantUserBodyDto
}

type RoleControllerNewUserApplyForTenantUserFn = (
  params: IRoleControllerNewUserApplyForTenantUserParams
) => Promise<any>

export const roleControllerNewUserApplyForTenantUser: RoleControllerNewUserApplyForTenantUserFn = async ({
  payload
}) => {
  const body = await fetch({
    resource: 'v3/newUserApply/tenantUser',
    method: 'POST',
    payload
  })

  return body
}

export interface IRoleControllerNewUserApplyForPlatformUserParams {
  payload: types.IRoleApplyPlatformAdminBodyDto
}

type RoleControllerNewUserApplyForPlatformUserFn = (
  params: IRoleControllerNewUserApplyForPlatformUserParams
) => Promise<any>

export const roleControllerNewUserApplyForPlatformUser: RoleControllerNewUserApplyForPlatformUserFn = async ({
  payload
}) => {
  const body = await fetch({
    resource: 'v3/newUserApply/platformUser',
    method: 'POST',
    payload
  })

  return body
}

export interface IRoleControllerChangeRoleParams {
  payload: types.IIChangeRoleApplyRequestBodyDto
}

type RoleControllerChangeRoleFn = (params: IRoleControllerChangeRoleParams) => Promise<any>

export const roleControllerChangeRole: RoleControllerChangeRoleFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v3/oldUserApply/changeRole',
    method: 'POST',
    payload
  })

  return body
}

type RoleControllerIsRoleRequestPendingFn = () => Promise<any>

export const roleControllerIsRoleRequestPending: RoleControllerIsRoleRequestPendingFn = async () => {
  const body = await fetch({
    resource: 'v3/isRoleRequestPending',
    method: 'GET'
  })

  return body
}

export interface IRoleControllerGetLatestNewUserTicketStatusParams {
  userId: number
}

type RoleControllerGetLatestNewUserTicketStatusFn = (
  params: IRoleControllerGetLatestNewUserTicketStatusParams
) => Promise<any>

export const roleControllerGetLatestNewUserTicketStatus: RoleControllerGetLatestNewUserTicketStatusFn = async ({
  userId
}) => {
  const body = await fetch({
    resource: `v3/latestNewUserTicketStatus/${userId}`,
    method: 'GET'
  })

  return body
}

export interface IRoleControllerGetRbacUserInfoParams {
  userId: number
}

type RoleControllerGetRbacUserInfoFn = (params: IRoleControllerGetRbacUserInfoParams) => Promise<any>

export const roleControllerGetRbacUserInfo: RoleControllerGetRbacUserInfoFn = async ({ userId }) => {
  const body = await fetch({
    resource: `v3/getUserRoleBinding/${userId}`,
    method: 'GET'
  })

  return body
}

export interface IRoleControllerGetTenantPermissionGroupsParams {
  tenantId: number
}

type RoleControllerGetTenantPermissionGroupsFn = (
  params: IRoleControllerGetTenantPermissionGroupsParams
) => Promise<any>

export const roleControllerGetTenantPermissionGroups: RoleControllerGetTenantPermissionGroupsFn = async ({
  tenantId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/roles`,
    method: 'GET'
  })

  return body
}

type RoleControllerGetTenantsRolesFn = () => Promise<any>

export const roleControllerGetTenantsRoles: RoleControllerGetTenantsRolesFn = async () => {
  const body = await fetch({
    resource: 'v3/tenantsRoles',
    method: 'GET'
  })

  return body
}

type RoleControllerGetPlatformRolesFn = () => Promise<any>

export const roleControllerGetPlatformRoles: RoleControllerGetPlatformRolesFn = async () => {
  const body = await fetch({
    resource: 'v3/globalRoles',
    method: 'GET'
  })

  return body
}

export interface IRoleControllerGetGlobalUserListParams {
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type RoleControllerGetGlobalUserListFn = (params: IRoleControllerGetGlobalUserListParams) => Promise<any>

export const roleControllerGetGlobalUserList: RoleControllerGetGlobalUserListFn = async ({
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: 'v3/global/users',
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface IRoleControllerGetGlobalBotListParams {
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type RoleControllerGetGlobalBotListFn = (params: IRoleControllerGetGlobalBotListParams) => Promise<any>

export const roleControllerGetGlobalBotList: RoleControllerGetGlobalBotListFn = async ({
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: 'v3/global/bots',
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}
