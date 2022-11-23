import { ListQuery } from '@/common/dtos/list.dto'
import { GetTenantMetricsResponse, Usage } from '@/common/dtos/metrics/metric.dto'
import { OpenApiClusterDetailListItem, OpenApiClusterTenantListItem } from '@/common/dtos/openApi/cluster.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class ListClustersQuery extends ListQuery {}

export class GetClusterParams {
  @IsNotEmpty()
  @IsString()
  clusterId: string
}

export class ListClustersWithDetailQuery extends ListQuery {}

export class ListClusterTenantsParams {
  @IsNotEmpty()
  @IsString()
  clusterId: string
}

export class ClusterTenantListItem extends OpenApiClusterTenantListItem {
  quotas: GetTenantMetricsResponse[]
}

export class ListClusterTenantsResponse {
  total: number
  clusterName: string
  items: ClusterTenantListItem[]
}

export class ClusterDetailListItem extends OpenApiClusterDetailListItem {
  cpu: Usage
  memory: Usage
}

export class ListClusterDetailsResponse {
  total: number
  items: ClusterDetailListItem[]
}

export class UpdateClusterParams {
  @IsNotEmpty()
  @IsString()
  clusterId: string
}
