import { RESOURCE_TYPE, RESOURCE_ACTION, PERMISSION_SCOPE } from 'common/constants/rbac'
import { ApiProperty } from '@nestjs/swagger'

export interface ITenant {
  id: number
  name: string
  detail: string
  createAt: string
  updateAt: string
}

export interface ITenants {
  tenants: ITenant[]
  totalSize: number
}

export interface IBatchGetTenants {
  tenants: ITenant[]
}

export interface IAccessToken {
  accessToken: string
}

export interface IAuthConfig {
  protocol: string
  host: string
  port?: number
}

export interface ICerts {
  certs: Record<string, string>
}

export interface IJWTHeader {
  kid: string
}

export enum TOKEN_SCOPE {
  USER = 'user',
  BOT = 'bot'
}

export interface IJWTPayLoad {
  env?: string
  ID: number
  Scope: TOKEN_SCOPE
  Email: string
  exp: number
}

export interface IRoleBinding {
  tenantId: number
  tenantName: string
  roleId: number
  roleName: string
  roleScope: number
}

export interface IUserRoles {
  roles: IRoleBinding[]
  totalSize: number
}

export interface IPermission {
  id: number
  resource: RESOURCE_TYPE
  action: RESOURCE_ACTION
  permissionScope: PERMISSION_SCOPE
  label?: string
}

export interface IPermissions {
  permissions: IPermission[]
  totalSize: number
}

export interface IRoleBind {
  id: number
  name: string
}

export interface ITenantRoles {
  roles: IRoleBind[]
  totalSize: number
}
export interface IUser {
  id: number
  email: string
  name: string
}

export interface IBatchGetUsers {
  users: IUser[]
}

export interface IUsers {
  users: IUser[]
  totalSize: number
}

export interface IBot {
  botId: string
  name: string
}

export interface IBots {
  bots: IBot[]
  totalSize: number
}

export class IApprover {
  @ApiProperty()
  userId: number

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string
}

export interface IApproverList {
  users: IApprover[]
  totalSize: number
}

export interface IAddRolePayload {
  roleId: number
}

export interface IListQuery {
  offset?: number
  limit?: number
  filterBy?: string
  orderBy?: string
}

export interface IBotInfo {
  id: number
  name: string
  tenantId: number
  detail: string
}
