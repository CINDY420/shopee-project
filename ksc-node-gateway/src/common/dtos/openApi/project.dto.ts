import { OpenApiListQuery } from '@/common/dtos/openApi/list.dto'
import { ResponseEnvQuota, PayloadEnvQuota } from '@/common/dtos/quota.dto'

export class OpenApiProjectUSS {
  appId: string
  appSecret: string
  metaUrl: string
  name: string
}

class OpenApiProjectListItem {
  tenantId: string

  projectId: string

  displayName: string

  uss: OpenApiProjectUSS
}

export class OpenApiListProjectsResponse {
  total: number

  items: OpenApiProjectListItem[]
}

export class OpenApiListProjectsQuery extends OpenApiListQuery {}

export class GetProjectResponse extends OpenApiProjectListItem {
  envQuotas: ResponseEnvQuota[]
  logStore: string
}

// for open api client
export interface IUpdateProjectPayload {
  displayName: string
  envQuotas: PayloadEnvQuota[]
  uss?: OpenApiProjectUSS
  logStore?: string
}

export interface IOpenApiUpdateProjectPayloadWrapper {
  payload: IUpdateProjectPayload // openapi 需要
}

export class UpdateProjectResponse {
  tenantId: string

  projectId: string

  displayName: string
}

export interface ICreateProjectBody {
  displayName: string
  envQuotas: PayloadEnvQuota[]
  uss: OpenApiProjectUSS
  logStore?: string
}
