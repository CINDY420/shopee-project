export interface IProject {
  tenantName: string
  tenantId: number
  name: string
}

export interface ISearchProjects {
  groupName: string
  projects: IProject[]
  totalCount: number
}

export interface IApplication {
  tenantName: string
  tenantId: number
  projectName: string
  name: string
}

export interface ISearchApplications {
  applications: IApplication[]
  groupName: string
  projectName: string
  totalCount: number
}

interface IIngresses {
  clusterIdSet: string[]
  groupName: string
  name: string
  projectName: string
}

export interface ISearchIngresses {
  groupName: string
  ingresses: IIngresses[]
  projectName: string
  totalCount: number
}

interface IServices {
  clusterIdSet: string[]
  groupName: string
  name: string
  projectName: string
}

export interface ISearchServices {
  groupName: string
  projectName: string
  services: IServices[]
  totalCount: number
}

export interface ITenantProjects {
  totalCount: number
  tenantName: string
  tenantId: number
  projects: IProject[]
}

export interface IProjectApplications {
  totalCount: number
  tenantName: string
  tenantId: number
  applications: IApplication[]
}

export interface IProjects {
  name: string
  tenantId: number
  tenantName: string
}

export interface IProjectResources {
  projects: IProjects[]
  tenantId: number
  tenantName: string
  titalCount: number
}
