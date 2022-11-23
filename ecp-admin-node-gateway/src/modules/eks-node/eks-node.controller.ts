import { Controller, Get, Query, Param, Post, Body, Delete } from '@nestjs/common'
import { EksNodeService } from '@/modules/eks-node/eks-node.service'
import {
  EksListNodesParams,
  EksListNodesQuery,
  EksListNodesResponse,
  EksCordonNodesParams,
  EksCordonNodesBody,
  EksUnCordonNodesParams,
  EksUnCordonNodesBody,
  EksDrainNodesParams,
  EksDrainNodesBody,
  EksAddNodesParams,
  EksAddNodesBody,
  EksDeleteNodesParams,
  EksDeleteNodesBody,
  EksGetNodeGroupListParams,
  EksGetNodeGroupListResponse,
  EksSetNodesLabelsParams,
  EksSetNodesLabelsBody,
  EksSetNodesTiantsBody,
  EksSetNodesTiantsParams,
} from '@/modules/eks-node/dto/eks-node.dto'
import { ApiTags } from '@nestjs/swagger'
@ApiTags('EksNode')
@Controller('eks/clusters/:clusterId/nodes')
export class EksNodeController {
  constructor(private readonly eksNodeService: EksNodeService) {}

  @Get()
  listNodes(
    @Param() params: EksListNodesParams,
    @Query() query: EksListNodesQuery,
  ): Promise<EksListNodesResponse> {
    return this.eksNodeService.listNodes(params, query)
  }

  @Post('cordon')
  cordonNodes(@Param() params: EksCordonNodesParams, @Body() body: EksCordonNodesBody) {
    return this.eksNodeService.cordonNodes(params, body)
  }
  @Post('unCordon')
  unCordonNodes(@Param() params: EksUnCordonNodesParams, @Body() body: EksUnCordonNodesBody) {
    return this.eksNodeService.unCordonNodes(params, body)
  }
  @Post('drain')
  drainNodes(@Param() params: EksDrainNodesParams, @Body() body: EksDrainNodesBody) {
    return this.eksNodeService.drainNodes(params, body)
  }

  @Post('add')
  addNodes(@Param() params: EksAddNodesParams, @Body() body: EksAddNodesBody) {
    return this.eksNodeService.addNodes(params, body)
  }

  @Delete('delete')
  deleteNodes(@Param() params: EksDeleteNodesParams, @Body() body: EksDeleteNodesBody) {
    return this.eksNodeService.deleteNodes(params, body)
  }

  @Get('nodeGroups')
  getNodeGroupList(
    @Param() params: EksGetNodeGroupListParams,
  ): Promise<EksGetNodeGroupListResponse> {
    return this.eksNodeService.getNodeGroupList(params)
  }

  @Post('labels')
  setNodeLabels(
    @Param() params: EksSetNodesLabelsParams,
    @Body() body: EksSetNodesLabelsBody,
  ): Promise<void> {
    return this.eksNodeService.setNodeLabels(params, body)
  }

  @Post('tiants')
  setNodeTiants(
    @Param() params: EksSetNodesTiantsParams,
    @Body() body: EksSetNodesTiantsBody,
  ): Promise<void> {
    return this.eksNodeService.setNodeTiants(params, body)
  }
}
