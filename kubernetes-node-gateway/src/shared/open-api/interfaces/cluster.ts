export enum STATUS_TYPE {
  ENABLE = 1,
  DISABLE = 0,
}

export interface IOpenApiGetGlobalHpaParams {
  cluster: string
}

export interface IOpenApiGetGlobalHpaResponse {
  status: STATUS_TYPE
}

export interface IOpenApiUpdateGlobalHpaParams {
  cluster: string
}

export interface IOpenApiUpdateGlobalHpaBody {
  status: STATUS_TYPE
}
