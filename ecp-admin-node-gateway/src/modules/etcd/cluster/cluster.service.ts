import { Injectable } from '@nestjs/common'
import {
  ListEtcdClustersQuery,
  ListEtcdClustersResponse,
  GetEtcdClusterDetailResponse,
  GetEtcdClusterDetailQuery,
  GetEtcdClusterDetailParams,
  IEtcdStatusCount,
  ListEtcdEnvAzsResponse,
} from '@/modules/etcd/cluster/dto/cluster.dto'
import { EtcdApisService } from '@/shared/etcd-apis/etcd-apis.service'

@Injectable()
export class EtcdClusterService {
  constructor(private readonly etcdApisService: EtcdApisService) {}

  async listEnvAzs(): Promise<ListEtcdEnvAzsResponse> {
    const { data } = await this.etcdApisService.getApis().listEnvAzs()
    const { azList, envList } = data
    return {
      azList,
      envList,
    }
  }

  async listClusters(query: ListEtcdClustersQuery): Promise<ListEtcdClustersResponse> {
    const { labels } = query
    const { data } = await this.etcdApisService.getApis().listCluster(query)

    const labelFilters = labels?.split(',')
    const newData = labelFilters
      ? data.filter((each) => {
          const { labels } = each
          return labels.some((label) => labelFilters?.includes(`${label.key}=${label.value}`))
        })
      : data
    return {
      items: newData,
      total: data.length,
    }
  }

  async getClusterDetail(
    param: GetEtcdClusterDetailParams,
    query: GetEtcdClusterDetailQuery,
  ): Promise<GetEtcdClusterDetailResponse> {
    const { clusterId } = param
    const { data } = await this.etcdApisService.getApis().getCluster({ clusterId }, query)

    const { memberList, ...rest } = data

    const statusCount = memberList.reduce(
      (acc, curr) => {
        acc[curr.status as keyof IEtcdStatusCount] =
          (acc[curr.status as keyof IEtcdStatusCount] || 0) + 1
        acc.All += 1
        return acc
      },
      {
        All: 0,
        Pending: 0,
        Processing: 0,
        Running: 0,
        Failed: 0,
        Unknown: 0,
      },
    )
    return {
      memberList,
      statusCount,
      ...rest,
    }
  }
}
