import { Controller, Get, Query, Param, Patch, Body } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { transformFrontendListQueryToOpenApiListQuery } from '@/common/utils/query'
import { ListNodesQuery, NodeParams, UpdateNodeParams } from '@/features/node/dto/node.dto'
import { UpdateNodePayload } from '@/common/dtos/openApi/node.dto'

@ApiTags('Node')
@Controller()
export class NodeController {
  constructor(private readonly openApiService: OpenApiService) {}

  @Get('cluster/:clusterId/nodes')
  @ApiResponse({ description: 'List nodes' })
  listNodes(@Param() nodeParams: NodeParams, @Query() listNodesQuery: ListNodesQuery) {
    const { clusterId } = nodeParams
    const openApiListNodesQuery = transformFrontendListQueryToOpenApiListQuery(listNodesQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListNodesQuery
    return this.openApiService.listNodes(clusterId, { offset, limit, filterBy, sortBy, keyword })
  }

  @Get('cluster/:clusterId/node/overview')
  @ApiResponse({ description: 'Get node overview' })
  getNodeOverview(@Param() nodeParams: NodeParams) {
    const { clusterId } = nodeParams
    return this.openApiService.getNodeOverview(clusterId)
  }

  @Patch('cluster/:clusterId/node/:nodeId')
  @ApiResponse({ description: 'Update node' })
  updateNode(@Param() updateNodeParams: UpdateNodeParams, @Body() updateNodePayload: UpdateNodePayload) {
    const { nodeId, clusterId } = updateNodeParams
    return this.openApiService.updateNode(clusterId, nodeId, updateNodePayload)
  }
}
