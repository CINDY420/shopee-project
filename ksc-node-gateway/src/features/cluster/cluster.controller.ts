import { Controller, Get, HttpStatus, Query, Param, Patch, Body, Post } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import {
  ListClustersResponse,
  GetClusterResponse,
  OpenApiListClusterTenantsQuery,
  IOpenApiUpdateClusterPayload,
} from '@/common/dtos/openApi/cluster.dto'
import {
  ListClustersQuery,
  GetClusterParams,
  ListClustersWithDetailQuery,
  ListClusterTenantsParams,
  UpdateClusterParams,
} from '@/features/cluster/dto/cluster.dto'
import { transformFrontendListQueryToOpenApiListQuery } from '@/common/utils/query'
import { ClusterService } from '@/features/cluster/cluster.service'

@ApiTags('Cluster')
@Controller('clusters')
export class ClusterController {
  constructor(private readonly openApiService: OpenApiService, private readonly clusterService: ClusterService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: ListClustersResponse, description: 'List clusters' })
  listClusters(@Query() listClustersQuery: ListClustersQuery) {
    const openApiListClustersQuery = transformFrontendListQueryToOpenApiListQuery(listClustersQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListClustersQuery
    return this.openApiService.listClusters({ offset, limit, filterBy, sortBy, keyword })
  }

  @Get('cluster/:clusterId')
  @ApiResponse({ status: HttpStatus.OK, type: GetClusterResponse, description: 'Get cluster' })
  getCluster(@Param() getClusterParams: GetClusterParams) {
    const { clusterId } = getClusterParams
    return this.openApiService.getCluster(clusterId)
  }

  @Get('details')
  @ApiResponse({ description: 'List cluster detail' })
  listClustersWithDetail(@Query() listClustersWithDetailQuery: ListClustersWithDetailQuery) {
    const openApiListQuery = transformFrontendListQueryToOpenApiListQuery(listClustersWithDetailQuery)
    return this.clusterService.listClustersWithDetail(openApiListQuery)
  }

  @Get('overview')
  @ApiResponse({ description: 'Get cluster overview' })
  getClusterOverview() {
    return this.openApiService.getClusterOverview()
  }

  @Get('cluster/:clusterId/tenants')
  @ApiResponse({ description: 'List cluster detail' })
  listClusterTenants(
    @Param() listClusterTenantsParams: ListClusterTenantsParams,
    @Query() listClusterTenantsQuery: OpenApiListClusterTenantsQuery,
  ) {
    const { clusterId } = listClusterTenantsParams
    const openApiListQuery = transformFrontendListQueryToOpenApiListQuery(listClusterTenantsQuery)
    const { offset, limit, keyword } = openApiListQuery
    return this.clusterService.listClusterTenants(clusterId, { offset, limit, keyword })
  }

  @Post()
  @ApiResponse({ description: 'Add cluster' })
  AddCluster(@Body() updateClusterPayload: IOpenApiUpdateClusterPayload) {
    return this.openApiService.addCluster(updateClusterPayload)
  }

  @Patch(':clusterId')
  @ApiResponse({ description: 'Update cluster' })
  UpdateCluster(
    @Param() updateClusterParams: UpdateClusterParams,
    @Body() updateClusterPayload: IOpenApiUpdateClusterPayload,
  ) {
    const { clusterId } = updateClusterParams
    return this.openApiService.updateCluster(clusterId, updateClusterPayload)
  }
}
