import { AUTH_STATUS } from 'constants/accessRequest'

export interface IApplyRequestPayload {
  tenantId: number
  permissionGroupId: number
  email: string
}

export interface IApproverList {
  userId: number
  name: string
  email: string
}

export interface ITickets {
  tenantName: string
  tenantId: number
  permissionGroupName: string
  permissionGroupId: number
  ticketId: string
  approverList: IApproverList[]
}

export interface IApplyRequestResponse {
  ticketId: string
  tickets: ITickets[]
  approverList: IApproverList[]
}

export interface IGetAccessRequestState {
  isRoleRequestPending: boolean
}

export interface IUser {
  name: string
  email: string
  userId: number
}
export interface IGetInitialRequestState {
  status: AUTH_STATUS
  ticketId: string
  approver: string
  users: IUser[]
}

export interface IAddRolePayload {
  group: string
  role: string
}
export interface IAddRoleResponse {
  requestId: string
  manager: string
}

export interface IGetAccessDetailRequestId {
  requestId: string
}
export interface IGetAccessDetail {
  group: string
  name: string
  email: string
  createtime: string
  status: string
  type: string
  role: string
  realGroup: string
  requires: string
  approver: string
  reason: string
  updatetime: string
}

export interface IRole {
  tenantId: number
  tenantName: string
  roleId: number
  roleName: string
  roleScope: number
}

export interface IRoleBind {
  roles: IRole[]
}

export interface IOptionRole {
  id: number
  name: string
  roleScope: number
}

export interface ITenantRole {
  tenantId: number
  tenantName: string
  roles: IOptionRole[]
}

export interface ITenantsRoles {
  tenantsRoles: ITenantRole[]
  totalCount: number
}

export interface IPlatformRoles {
  roles: IOptionRole[]
  totalCount: number
}
