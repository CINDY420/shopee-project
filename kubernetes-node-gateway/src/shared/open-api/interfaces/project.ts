interface IOpenApiProject {
  name: string
  tenant: string
  cids: string[]
  envs: string[]
  clusters: string[]
}

export type IOpenApiListAllProjectsResponse = IOpenApiProject[]

interface IQuota {
  cpuTotal: number
  memoryTotal: number
  name: string
}

export interface IOpenApiCreateProjectBody {
  project: string
  envs: string[]
  cids: string[]
  orchestrators: string[]
  quotas?: IQuota[]
}
export interface IOpenApiMoveProjectBody {
  targetTenant: string
}
