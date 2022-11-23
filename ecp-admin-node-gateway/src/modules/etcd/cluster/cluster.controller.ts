import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  ListEtcdClustersResponse,
  GetEtcdClusterDetailResponse,
  ListEtcdClustersQuery,
  GetEtcdClusterDetailParams,
  GetEtcdClusterDetailQuery,
  ListEtcdEnvAzsResponse,
} from '@/modules/etcd/cluster/dto/cluster.dto'
import { Pagination } from '@/decorators/pagination'
import { PaginateInterceptor } from '@/interceptors/pagination.inteceptor'
import { EtcdClusterService } from '@/modules/etcd/cluster/cluster.service'

@ApiTags('EtcdCluster')
@Controller('etcd/clusters')
export class EtcdClusterController {
  constructor(private readonly clusterService: EtcdClusterService) {}

  @Get('envAzs')
  listEnvAz(): Promise<ListEtcdEnvAzsResponse> {
    return this.clusterService.listEnvAzs()
  }

  @Pagination({
    key: 'items',
    countKey: 'total',
    defaultOrder: 'clusterId',
    filterable: true,
    searchable: true,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get()
  listClusters(@Query() query: ListEtcdClustersQuery): Promise<ListEtcdClustersResponse> {
    return this.clusterService.listClusters(query)
  }

  @Pagination({
    key: 'memberList',
    countKey: 'total',
    defaultOrder: 'ip',
    filterable: true,
    searchable: false,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get(':clusterId')
  getClusterDetail(
    @Param() params: GetEtcdClusterDetailParams,
    @Query() query: GetEtcdClusterDetailQuery,
  ): Promise<GetEtcdClusterDetailResponse> {
    return this.clusterService.getClusterDetail(params, query)
  }
}
