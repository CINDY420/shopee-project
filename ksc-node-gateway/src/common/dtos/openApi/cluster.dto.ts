import { OpenApiListQuery } from '@/common/dtos/openApi/list.dto'

class ClusterListItem {
  clusterId: string

  displayName: string

  description: string
}

export class ListClustersResponse {
  total: number

  items: ClusterListItem[]
}

export class GetClusterResponse {
  clusterId: string
  displayName: string
  kubeconfig: string
  description: string
  envs: string[]
}

export class OpenApiListClustersQuery extends OpenApiListQuery {}

export class OpenApiListClusterDetailsQuery extends OpenApiListQuery {}

export class OpenApiClusterDetailListItem {
  clusterId: string
  displayName: string
  status: string
  description: string
  schedulePodPerSecond: number
  prometheusUrl: string
}

export class ListClusterDetailsResponse {
  total: number
  items: OpenApiClusterDetailListItem[]
}

export class GetClusterOverviewResponse {
  total: string
  health: string
  unhealth: string
}

export class OpenApiListClusterTenantsQuery extends OpenApiListQuery {}

export class OpenApiClusterTenantListItem {
  tenantId: string
  displayName: string
  productlineId: string
  productlineName: string
  envs: string[]
  description: string
  tenantCmdbName: string
  tenantCmdbId: string
}

export class OpenApiListClusterTenantsResponse {
  total: number
  clusterName: string
  items: OpenApiClusterTenantListItem[]
}

export class UpdateClusterResponse {
  clusterId: string
  displayName: string
  description: string
  kubeconfig: string
  schedulePodPerSecond: number
  prometheusUrl: string
  envs: string[]
}

export class IOpenApiAddClusterPayload {
  displayName?: string
  description?: string
  kubeconfig?: string
}

export class IOpenApiAddClusterPayloadWrapper {
  payload: IOpenApiAddClusterPayload
}

export class IOpenApiUpdateClusterPayload {
  displayName?: string
  description?: string
  kubeconfig?: string
  schedulePodPerSecond?: number
  prometheusUrl?: string
}

export class IOpenApiUpdateClusterPayloadWrapper {
  payload: IOpenApiUpdateClusterPayload
}
