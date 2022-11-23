import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ListNodesQuery, ListNodesResponse, ListNodesParams } from '@/modules/node/dto/node.dto'
import { NodeService } from '@/modules/node/node.service'

@ApiTags('Node')
@Controller()
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get('clusters/:clusterId/nodes')
  listNodes(
    @Param() params: ListNodesParams,
    @Query() query: ListNodesQuery,
  ): Promise<ListNodesResponse> {
    return this.nodeService.listNodes(params.clusterId, query)
  }
}
