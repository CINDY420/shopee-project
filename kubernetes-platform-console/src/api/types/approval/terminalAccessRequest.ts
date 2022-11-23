export interface ITenant {
  id: number
  name: string
  detail: string
  createAt: string
  updateAt: string
}

export interface ITerminalAccessRequest {
  id: string
  tenant: ITenant
  approver: string
  createdAt: string
  applicant: string
  purpose: string
  status: string
  updatedAt: string
  project?: string
  type?: string
  permissionGroup?: string
}

export interface ITerminalAccessRequestList {
  tickets: ITerminalAccessRequest[]
  totalCount: number
  pendingCount: number
  finishedCount: number
}

export interface ITerminalRequestDetail {
  type: string
  applicantName: string
  applicantId: number
  tenantName: string
  tenantId: number
  permissionGroupName: string
  permissionGroupId: number
  appliedTime: string
  status: string
  project: string
  purpose: string
  approvedTime: string
  cancelledTime: string
  approver: string
}

export interface ITerminalAccessRequestConfig {
  access: string
  action: string
}
