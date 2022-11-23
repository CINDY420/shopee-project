import { PERMISSION_GROUP } from 'constants/rbacActions'

export interface ITenantDetail {
  name: string
  id: number
  envs: string[]
  cids: string[]
  clusters: string[]
  envClusterMap: {
    [envName: string]: string[]
  }
}

export interface IGroupProjectStatus {
  name: string
  status: string
}

export interface IGroupProjectsStatus {
  groups: IGroupProjectStatus[]
}

export interface IUserConfig {
  userId: number
  name: string
  email: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface IUser {
  user: IUserConfig
  roleId: number
  roleName: string
}

export interface IBotConfig {
  id: number
  name: string
  password: string
  tenantId: number
  creator: number
  detail: string
  createdAt: string
  updatedAt: string
}

export interface IBot {
  bot: IBotConfig
  roleId: number
  roleName: string
}
export interface IRole {
  id: number
  name: PERMISSION_GROUP
  roleScope: number
  createdAt: string
  updatedAt: string
}

export interface ITenantRole {
  id: number
  name: PERMISSION_GROUP
}

export interface ITenantUserList {
  totalSize: number
  tenantUsers: IUser[]
}

export interface ITenantBotList {
  totalSize: number
  tenantBots: IBot[]
}

export interface IPermissionGroupList {
  totalCount: number
  roles: IRole[]
}

export interface ITenant {
  id: number
  name: string
}

export interface ITenantList {
  tenantList: ITenant[]
  totalCount: number
}

export interface ISessionKey {
  sessionKey: string
}

export interface IOption {
  value: number
  label: JSX.Element
  text: string
  isLeaf: boolean
  children?: any[]
  disabled?: boolean
}
