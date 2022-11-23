import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IGroupsControllerGetDetailParams {
  tenantId: number
}

type GroupsControllerGetDetailFn = (params: IGroupsControllerGetDetailParams) => Promise<types.IIGroupDetail>

export const groupsControllerGetDetail: GroupsControllerGetDetailFn = async ({ tenantId }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}`,
    method: 'GET'
  })

  return body
}

export interface IGroupsControllerUpdateTenantParams {
  tenantId: number
  payload: types.IIUpdateTenantBodyDto
}

type GroupsControllerUpdateTenantFn = (params: IGroupsControllerUpdateTenantParams) => Promise<types.IITenant>

export const groupsControllerUpdateTenant: GroupsControllerUpdateTenantFn = async ({ tenantId, payload }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}`,
    method: 'PATCH',
    payload
  })

  return body
}

export interface IGroupsControllerDeleteTenantParams {
  tenantId: number
}

type GroupsControllerDeleteTenantFn = (params: IGroupsControllerDeleteTenantParams) => Promise<types.IITenant>

export const groupsControllerDeleteTenant: GroupsControllerDeleteTenantFn = async ({ tenantId }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}`,
    method: 'DELETE'
  })

  return body
}

export interface IGroupsControllerGetGroupMetricsParams {
  tenantId: number
  env: string
  cluster: string
}

type GroupsControllerGetGroupMetricsFn = (params: IGroupsControllerGetGroupMetricsParams) => Promise<types.IIMetricsDto>

export const groupsControllerGetGroupMetrics: GroupsControllerGetGroupMetricsFn = async ({
  tenantId,
  env,
  cluster
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/metrics`,
    method: 'GET',
    params: { env, cluster }
  })

  return body
}

export interface IGroupsControllerGetProjectEnvQuotasParams {
  tenantId: number
  environments: string[]
  cids: string[]
}

type GroupsControllerGetProjectEnvQuotasFn = (
  params: IGroupsControllerGetProjectEnvQuotasParams
) => Promise<types.IIProjectQuotasDto>

export const groupsControllerGetProjectEnvQuotas: GroupsControllerGetProjectEnvQuotasFn = async ({
  tenantId,
  environments,
  cids
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projectEnvQuotas`,
    method: 'GET',
    params: { environments, cids }
  })

  return body
}

export interface IGroupsControllerGetTenantListParams {
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type GroupsControllerGetTenantListFn = (params: IGroupsControllerGetTenantListParams) => Promise<types.IITenantList>

export const groupsControllerGetTenantList: GroupsControllerGetTenantListFn = async ({
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: 'v3/tenants',
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface IGroupsControllerCreateTenantParams {
  payload: types.IICreateTenantBodyDto
}

type GroupsControllerCreateTenantFn = (params: IGroupsControllerCreateTenantParams) => Promise<types.IITenant>

export const groupsControllerCreateTenant: GroupsControllerCreateTenantFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v3/tenants',
    method: 'POST',
    payload
  })

  return body
}

export interface IGroupsControllerGetTenantUserListParams {
  tenantId: number
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type GroupsControllerGetTenantUserListFn = (params: IGroupsControllerGetTenantUserListParams) => Promise<any>

export const groupsControllerGetTenantUserList: GroupsControllerGetTenantUserListFn = async ({
  tenantId,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/users`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface IGroupsControllerAddTenantUsersParams {
  tenantId: number
  payload: types.IIAddTenantUsersBodyDto
}

type GroupsControllerAddTenantUsersFn = (params: IGroupsControllerAddTenantUsersParams) => Promise<any>

export const groupsControllerAddTenantUsers: GroupsControllerAddTenantUsersFn = async ({ tenantId, payload }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/users`,
    method: 'POST',
    payload
  })

  return body
}

export interface IGroupsControllerEditTenantUserParams {
  tenantId: number
  userId: number
  payload: types.IIUpdateTenantUserBodyDto
}

type GroupsControllerEditTenantUserFn = (params: IGroupsControllerEditTenantUserParams) => Promise<any>

export const groupsControllerEditTenantUser: GroupsControllerEditTenantUserFn = async ({
  tenantId,
  userId,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/users/${userId}`,
    method: 'PATCH',
    payload
  })

  return body
}

export interface IGroupsControllerDeleteTenantUserParams {
  tenantId: number
  userId: string
}

type GroupsControllerDeleteTenantUserFn = (params: IGroupsControllerDeleteTenantUserParams) => Promise<any>

export const groupsControllerDeleteTenantUser: GroupsControllerDeleteTenantUserFn = async ({ tenantId, userId }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/users/${userId}`,
    method: 'DELETE'
  })

  return body
}

export interface IGroupsControllerGetTenantBotListParams {
  tenantId: number
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type GroupsControllerGetTenantBotListFn = (params: IGroupsControllerGetTenantBotListParams) => Promise<any>

export const groupsControllerGetTenantBotList: GroupsControllerGetTenantBotListFn = async ({
  tenantId,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/bots`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface IGroupsControllerAddTenantBotParams {
  tenantId: number
  payload: types.IIAddTenantBotBodyDto
}

type GroupsControllerAddTenantBotFn = (params: IGroupsControllerAddTenantBotParams) => Promise<any>

export const groupsControllerAddTenantBot: GroupsControllerAddTenantBotFn = async ({ tenantId, payload }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/bots`,
    method: 'POST',
    payload
  })

  return body
}

export interface IGroupsControllerEditTenantBotParams {
  tenantId: number
  botId: number
  payload: types.IIUpdateTenantBotBodyDto
}

type GroupsControllerEditTenantBotFn = (params: IGroupsControllerEditTenantBotParams) => Promise<any>

export const groupsControllerEditTenantBot: GroupsControllerEditTenantBotFn = async ({ tenantId, botId, payload }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/bots/${botId}`,
    method: 'PATCH',
    payload
  })

  return body
}

export interface IGroupsControllerDeleteTenantBotParams {
  tenantId: number
  botId: number
}

type GroupsControllerDeleteTenantBotFn = (params: IGroupsControllerDeleteTenantBotParams) => Promise<any>

export const groupsControllerDeleteTenantBot: GroupsControllerDeleteTenantBotFn = async ({ tenantId, botId }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/bots/${botId}`,
    method: 'DELETE'
  })

  return body
}

export interface IGroupsControllerGenerateBotAccessTokenParams {
  tenantId: number
  botId: number
  payload: types.IIGenerateBotAccessTokenBodyDto
}

type GroupsControllerGenerateBotAccessTokenFn = (params: IGroupsControllerGenerateBotAccessTokenParams) => Promise<any>

export const groupsControllerGenerateBotAccessToken: GroupsControllerGenerateBotAccessTokenFn = async ({
  tenantId,
  botId,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/bots/${botId}/access_token`,
    method: 'POST',
    payload
  })

  return body
}

export interface IGroupsControllerListTerminalApproversParams {
  tenantId: string
}

type GroupsControllerListTerminalApproversFn = (params: IGroupsControllerListTerminalApproversParams) => Promise<any>

export const groupsControllerListTerminalApprovers: GroupsControllerListTerminalApproversFn = async ({ tenantId }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/terminal/approvers`,
    method: 'GET'
  })

  return body
}
