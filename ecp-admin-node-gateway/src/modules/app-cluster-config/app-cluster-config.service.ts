import { Injectable } from '@nestjs/common'
import { EcpApisService } from '@/shared/ecp-apis/ecp-apis.service'
import {
  FullAppClusterConfig,
  ListAppClusterConfigsQuery,
} from '@/modules/app-cluster-config/app-cluster-config.dto'
import { ClusterService } from '@/modules/cluster/cluster.service'
import { SegmentService } from '@/modules/segment/segment.service'

@Injectable()
export class AppClusterConfigService {
  constructor(
    private readonly ecpApisService: EcpApisService,
    private readonly clusterService: ClusterService,
    private readonly segmentService: SegmentService,
  ) {}

  async listAppClusterConfigs(query: ListAppClusterConfigsQuery) {
    const result = await this.ecpApisService.getFetch()['GET/ecpapi/v2/appclusterconfig']({
      cmdbTenantId: query.cmdbTenantId,
      pageNum: Number(query.pageNum),
      pageSize: Number(query.pageSize),
      filterBy: query.filterBy,
    })

    const ecpFetch = this.ecpApisService.getFetch()
    const fullClusterListResponse = await this.clusterService.listClusters({
      offset: '0',
      limit: '99999',
    })
    const fullClusterList = fullClusterListResponse.items
    const fullSegmentListResponse = await this.segmentService.listSegments()
    const fullSegmentList = fullSegmentListResponse.items
    const fullAzs = await ecpFetch['GET/ecpapi/v2/azs']()

    const getClusterName = (id?: string) => {
      if (!id) {
        return undefined
      }
      return fullClusterList.find((cluster) => cluster.clusterId === id)?.displayName ?? id
    }

    const items = await Promise.all(
      (result.items ?? []).map((item) => {
        const { clusterUuid, segmentKey, azKey } = item
        const clusterName = getClusterName(clusterUuid)
        const segment = fullSegmentList.find((segment) => segment.segmentKey === segmentKey)
        const az = fullAzs.items?.find((az) => az.azKey === azKey)

        return {
          ...item,
          clusterName,
          segment,
          az,
        }
      }),
    )
    return {
      total: Number(result.total) ?? 0,
      items: items ?? [],
    }
  }

  private async addAppClusterConfig(config: FullAppClusterConfig) {
    const result = await this.ecpApisService.getFetch()['POST/ecpapi/v2/appclusterconfig'](config)
    return result.id ?? ''
  }

  batchAddAppClusterConfig(configs: FullAppClusterConfig[]) {
    return Promise.all(configs.map((config) => this.addAppClusterConfig(config)))
  }

  async removeAppClusterConfig(id: string) {
    /**
     * Although this pair of async/await seems pointless, it makes the function return Promise<void>
     */
    await this.ecpApisService.getFetch()['DELETE/ecpapi/v2/appclusterconfig/{id}']({ id })
  }

  async batchRemoveAppClusterConfig(ids: string[]) {
    await Promise.all(ids.map((id) => this.removeAppClusterConfig(id)))
  }
}
