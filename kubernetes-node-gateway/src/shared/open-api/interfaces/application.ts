export interface IOpenApiGetApplicationParams {
  tenantId: string
  projectName: string
  appName: string
}

export interface IOpenApiGetApplicationResponse {
  name: string
  tenantName: string
  tenantId: string
  projectName: string
  cids: string[]
  envs: string[]
  azs: string[]
}

export interface IOpenApiListAllApplicationsParams {
  tenantId: string
  projectName: string
}

export interface IOpenApiApplication {
  name: string
  projectName: string
  status: string
  tenantName: string
  tenantId: string
  cids: string[]
  environments: string[]
}
export type IOpenApiListAllApplicationResponse = IOpenApiApplication[]
