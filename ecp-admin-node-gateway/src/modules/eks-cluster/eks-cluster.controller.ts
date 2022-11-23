import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EksClusterService } from '@/modules/eks-cluster/eks-cluster.service'
import {
  EksListClustersQuery,
  EksListClustersResponse,
  EksGetClusterDetailParams,
  EksGetClusterDetailResponse,
  EKSCreateClusterBody,
  GetClusterSummaryParams,
  GetClusterSummaryResponse,
  GetAnchorServerQuery,
  GetAnchorServerResponse,
  EKSCreateClusterResponse,
  GetClusterInfoByUuidParams,
  GetClusterInfoByUuidResponse,
} from '@/modules/eks-cluster/dto/eks-cluster.dto'

@ApiTags('EksCluster')
@Controller('eks/clusters')
export class EksClusterController {
  constructor(private readonly eksClusterService: EksClusterService) {}

  @Get()
  listClusters(@Query() query: EksListClustersQuery): Promise<EksListClustersResponse> {
    return this.eksClusterService.listClusters(query)
  }

  @Get('anchorServer')
  getAnchorServer(@Query() query: GetAnchorServerQuery): Promise<GetAnchorServerResponse> {
    return this.eksClusterService.getAnchorServer(query.env, query.az)
  }

  @Get(':clusterId')
  getClusterDetail(
    @Param() params: EksGetClusterDetailParams,
  ): Promise<EksGetClusterDetailResponse> {
    return this.eksClusterService.getClusterDetail(params)
  }

  @Post()
  createEKSCluster(@Body() body: EKSCreateClusterBody): Promise<EKSCreateClusterResponse> {
    return this.eksClusterService.createEKSCluster(body)
  }

  @Get(':clusterId/summary')
  getClusterSummary(@Param() params: GetClusterSummaryParams): Promise<GetClusterSummaryResponse> {
    return this.eksClusterService.getClusterSummary(params)
  }

  @Get(':uuid/info')
  getClusterInfoByUuid(
    @Param() param: GetClusterInfoByUuidParams,
  ): Promise<GetClusterInfoByUuidResponse> {
    return this.eksClusterService.getClusterInfoByUuid(param.uuid)
  }
}
