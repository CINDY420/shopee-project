export interface IApplication {
  clusterId: string
  tenantId: number
  name: string
  projectName: string
}

export interface IProject {
  name: string
  clusters: string
  tenantId: number
  applications: IApplication[]
}

export interface ITenant {
  id: number
  name: string
  projects: IProject[]
}

export interface ITree {
  tenants: ITenant[]
}
