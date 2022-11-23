export interface IProject {
  clusters: string
  environment: string
  tenantName: string
  tenantId: number
  name: string
  cids: string
  status: string
}

export interface IProjectList {
  projects: IProject[]
  tenantName: string
  tenantId: number
  cids: string[]
  environments: string[]
  totalCount?: number
}

export interface IProjectStatus {
  name: string
  status: string
}

export interface ICreateProjectParam {
  groupName: string
  projectName: string
  clusters: string[]
}

export interface IDeleteProjectParam {
  tenantId: number
  projectName: string
}

export interface IProjectActiveAccess {
  id: string
  tenant: number
  type: string
  permissionGroup: number
  applicant: number
  status: string
  approver: number
  project: string
  purpose: string
  createdAt: string
  updatedAt: string
}

export interface IProjectTerminalAccesses {
  id: string
  tenant: {
    id: number
    name: string
    detail: string
    createAt: string
    updateAt: string
  }
  type: string
  permissionGroup: {}
  applicant: {}
  status: string
  approver: {}
  project: string
  purpose: string
  createdAt: string
  updatedAt: string
}

interface IProjectQuota {
  cpuTotal: number
  memoryTotal: number
  name: string
}

export interface ICreateOrEditProject {
  quotas: IProjectQuota[]
  cids: string[]
  project: string
}
