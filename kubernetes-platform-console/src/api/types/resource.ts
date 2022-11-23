export interface IQuota {
  used: number
  assigned: number
  total: number
  limit: number
}

export interface IResourceQuota {
  cpu: IQuota
  memory: IQuota
  name: string
  filesys?: IQuota
}

export interface IResourceQuotas {
  name: string
  resourceQuotas: IResourceQuota[]
}

export interface IClusterResourceQuota {
  groups: IResourceQuotas[]
}

export interface IGroupResourceQuota {
  projects: IResourceQuotas[]
}

export interface IProjectResourceQuota {
  clusters: IResourceQuotas[]
}

export interface IQuotaSummary {
  cpuTotal: number
  memoryTotal: number
  name: string
}
