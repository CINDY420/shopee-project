import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  AddClusterBody,
  ListClustersResponse,
  GetClusterDetailResponse,
  ListClustersQuery,
  ListClusterMetasQuery,
  ListClusterMetasResponse,
  GetClusterDetailParams,
  EnableKarmadaParams,
  EnableKarmadaBody,
  EnableKarmadaResponse,
  AddToEKSClusterBody,
} from '@/modules/cluster/dto/cluster.dto'
import { ClusterService } from '@/modules/cluster/cluster.service'

@ApiTags('Cluster')
@Controller('clusters')
export class ClusterController {
  constructor(private readonly clusterService: ClusterService) {}

  @Post()
  async addCluster(@Body() body: AddClusterBody): Promise<void> {
    await this.clusterService.addCluster(body)
  }

  @Get()
  listClusters(@Query() query: ListClustersQuery): Promise<ListClustersResponse> {
    return this.clusterService.listClusters(query)
  }

  @Get('metas')
  listClusterMetas(@Query() query: ListClusterMetasQuery): Promise<ListClusterMetasResponse> {
    return this.clusterService.listClusterMetas(query)
  }

  @Get(':clusterId')
  getClusterDetail(@Param() params: GetClusterDetailParams): Promise<GetClusterDetailResponse> {
    return this.clusterService.getClusterDetail(params.clusterId)
  }

  @Post(':clusterId[:]enableKarmada')
  async enableKarmada(
    @Param() params: EnableKarmadaParams,
    @Body() body: EnableKarmadaBody,
  ): Promise<EnableKarmadaResponse> {
    return this.clusterService.enableKarmada(params.clusterId, body)
  }

  @Post('eks')
  addToEKSCluster(@Body() body: AddToEKSClusterBody) {
    return this.clusterService.addToEKSCluster(body)
  }
}
