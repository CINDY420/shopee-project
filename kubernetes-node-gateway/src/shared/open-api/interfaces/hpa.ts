import { IOpenApiHpa, IOpenApiHpaWithId, IOpenApiHpaSpec } from '@/shared/open-api/entities/hpa.entity'
import { ListQuery } from '@/common/models/dtos/list-query.dto'

export interface IOpenApiCreateHpaParams {
  tenantId: string
  projectName: string
  appName: string
}

export interface IOpenApiCreateHpaBody {
  hpa: IOpenApiHpa
}

export type IOpenApiUpdateHpaParams = IOpenApiCreateHpaParams
export interface IOpenApiUpdateHpaBody {
  hpa: IOpenApiHpaWithId
}

export type IOpenApiGetHpaDetailParams = IOpenApiCreateHpaParams
export interface IOpenApiGetHpaDetailQuery {
  sdu: string
  az: string
}

export interface IOpenApiBatchEditHPARulesBody {
  hpas: IOpenApiHpaWithId[]
}

export type IOpenApiBatchEditHPARulesParams = IOpenApiCreateHpaParams
export type IOpenApiListHPARulesParams = IOpenApiCreateHpaParams
export class OpenApiListHPARulesQuery extends ListQuery {}
export interface IOpenApiListHPARulesResponse {
  lists: IOpenApiHpaWithId[]
  total: number
}

export type IOpenApiGetHpaDetailResponse = IOpenApiHpaWithId

export type IOpenApiGetHpaDefaultConfigParams = IOpenApiCreateHpaParams
export type IOpenApiGetHpaDefaultConfigQuery = IOpenApiGetHpaDetailQuery

export type IOpenApiGetHpaDefaultConfigResponse = IOpenApiHpaSpec
