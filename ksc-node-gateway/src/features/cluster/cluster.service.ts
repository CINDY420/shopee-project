import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import {
  OpenApiClusterTenantListItem,
  OpenApiListClusterDetailsQuery,
  OpenApiListClusterTenantsQuery,
} from '@/common/dtos/openApi/cluster.dto'
import {
  ClusterTenantListItem,
  ListClusterDetailsResponse,
  ListClusterTenantsResponse,
} from '@/features/cluster/dto/cluster.dto'
import { MetricsService } from '@/common/modules/metrics/metrics.service'
import {
  GetClusterMetricsResponse,
  GetTenantMetricsQuery,
  GetTenantMetricsResponse,
  Usage,
} from '@/common/dtos/metrics/metric.dto'

@Injectable()
export class ClusterService {
  constructor(private readonly openApiService: OpenApiService, private readonly metricsService: MetricsService) {}

  public async getTenantMetrics(
    tenantName: string,
    openApiGetTenantMetricsQuery: GetTenantMetricsQuery,
  ): Promise<GetTenantMetricsResponse> {
    return await this.metricsService.getTenantMetrics(tenantName, openApiGetTenantMetricsQuery)
  }

  public async listClusterTenants(
    clusterId: string,
    listClusterTenantsQuery: OpenApiListClusterTenantsQuery,
  ): Promise<ListClusterTenantsResponse> {
    const {
      total,
      clusterName,
      items = [],
    } = await this.openApiService.listClusterTenants(clusterId, listClusterTenantsQuery)

    const tenantsList: ClusterTenantListItem[] = await Promise.all(
      items.map(async (tenantData: OpenApiClusterTenantListItem) => {
        const { envs, displayName: tenantName } = tenantData
        const quotas = await Promise.all(
          (envs ?? []).map((env) => this.getTenantMetrics(tenantName, { env, clusterName, clusterId })),
        )
        return { ...tenantData, quotas }
      }),
    )
    return { total, clusterName, items: tenantsList }
  }

  public async listClustersWithDetail(
    openApiListQuery: OpenApiListClusterDetailsQuery,
  ): Promise<ListClusterDetailsResponse> {
    const usage: Usage = {
      quota: '',
      usage: '',
      assigned: '',
      total: '',
    }
    const { total, items = [] } = await this.openApiService.listClustersWithDetail(openApiListQuery)
    const newList = await Promise.all(
      items.map(async (item) => {
        const { clusterId } = item
        let metrics: GetClusterMetricsResponse = {
          cpu: usage,
          memory: usage,
        }
        try {
          metrics = await this.metricsService.getClusterMetrics(clusterId)
        } catch (error) {
          console.log(error)
        }

        return {
          ...item,
          ...metrics,
        }
      }),
    )
    return { total, items: newList }
  }
}
