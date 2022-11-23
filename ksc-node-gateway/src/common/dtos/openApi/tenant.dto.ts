import { OpenApiListQuery } from '@/common/dtos/openApi/list.dto'
import { PayloadEnvQuota, ResponseEnvQuota } from '@/common/dtos/quota.dto'

class OpenApiTenantListItem {
  tenantId: string
  displayName: string
  productlineId: number
  productlineName: string
  description: string
  envQuotas: ResponseEnvQuota[]
  tenantCmdbName: string
  tenantCmdbId: string
  oversoldRatio: string
  fuseEnvs: string[]
  status: string
}

class OpenApiCMDBTenantListItem {
  tenantId: string
  tenantName: string
}

export class OpenApiListTenantsResponse {
  total: number

  items: OpenApiTenantListItem[]
}

export class OpenApiListCMDBTenantsResponse {
  total: number

  items: OpenApiCMDBTenantListItem[]
}

export class OpenApiListTenantsQuery extends OpenApiListQuery {}

export interface ICreateTenantPayload {
  tenantCmdbName: string
  tenantCmdbId: string
  description: string
  envQuotas: PayloadEnvQuota[]
  oversoldRatio: number
}

export class GetTenantResponse extends OpenApiTenantListItem {
  envQuotas: ResponseEnvQuota[]
}

export interface IOpenApiUpdateTenantPayload {
  tenantCmdbName?: string
  productlineName?: string
  description?: string
  oversoldRatio?: number
  envQuotas: PayloadEnvQuota[]
}

export interface IOpenApiUpdateTenantPayloadWrapper {
  payload: IOpenApiUpdateTenantPayload
}

export class UpdateTenantResponse {
  tenantId: string

  displayName: string

  envQuotas: ResponseEnvQuota[]
}

class ProductLine {
  productlineId: number
  displayName: string
  description: string
}

export class ListAllProductLinesResponse {
  total: number
  items: ProductLine[]
}

class IOpenApiTenantFuseItem {
  tenantId: string
  displayName: string
  fuseEnvs: string[]
  status: string
}

export class IOpenApiBatchUpdateTenantFuseResponse {
  results: IOpenApiTenantFuseItem
}

export class IOpenApiBatchUpdateTenantFusePayload {
  tenantIds: string[]
  fuseEnvs: string[]
}

export class IOpenApiBatchUpdateTenantFusePayloadWrapper {
  payload: IOpenApiBatchUpdateTenantFusePayload
}
