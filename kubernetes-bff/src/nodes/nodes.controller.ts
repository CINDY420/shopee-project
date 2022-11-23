import { Controller, Get, Param, Put, Body, UseInterceptors, Query } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { NodesService } from './nodes.service'
import { PaginateInterceptor } from 'common/interceptors/paginate.interceptor'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { Pagination } from 'common/decorators/methods'

import {
  NODE_ACTION_TYPE,
  NodeActionBasePayload,
  NodeLabelPayload,
  NodeTaintPayload,
  NodeListResponse,
  NodeActionResponse,
  INodePodListResponse
} from './dto/node.dto'
import { INode } from './entities/node.entity'
import { ListQueryDto } from 'applications-management/projects/dto/create-project.dto'

import { GlobalResourceGuard } from 'common/decorators/parameters/GlobalResourceGuard'
import { ACCESS_CONTROL_VERBS, GLOBAL_RESOURCES } from 'common/constants/rbac'

@ApiTags('Nodes')
@Controller('clusters/:clusterName/nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get()
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.VIEW
  // })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.NODE)
  @ApiResponse({ status: 200, type: NodeListResponse, description: 'Get node list' })
  @Pagination({
    key: 'nodes',
    countKey: 'totalCount',
    defaultOrder: 'name'
  })
  @UseInterceptors(PaginateInterceptor)
  listNodes(@Param('clusterName') clusterName: string, @Query() query: ListQueryDto) {
    return this.nodesService.listNodes(clusterName)
  }

  @Get(':nodeName')
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.VIEW
  // })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.NODE)
  @ApiResponse({ status: 200, type: INode, description: 'Get node detail' })
  getNodeByName(@Param('clusterName') clusterName: string, @Param('nodeName') nodeName: string) {
    return this.nodesService.getDetail(clusterName, nodeName)
  }

  @Put('action/cordon')
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.EDIT
  // })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.NODE)
  @ApiResponse({ status: 200, type: NodeActionResponse, description: 'Handle cordon action to nodes' })
  cordonNode(@Param('clusterName') clusterName: string, @Body() payload: NodeActionBasePayload) {
    return this.nodesService.doNodeActions(clusterName, payload, NODE_ACTION_TYPE.CORDON)
  }

  @Put('action/uncordon')
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.EDIT
  // })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.NODE)
  @ApiResponse({ status: 200, type: NodeActionResponse, description: 'Handle uncordon action to nodes' })
  unCordonNode(@Param('clusterName') clusterName: string, @Body() payload: NodeActionBasePayload) {
    return this.nodesService.doNodeActions(clusterName, payload, NODE_ACTION_TYPE.UNCORDON)
  }

  @Put('action/drain')
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.EDIT
  // })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.NODE)
  @ApiResponse({ status: 200, type: NodeActionResponse, description: 'Handle drain action to nodes' })
  drainNode(@Param('clusterName') clusterName: string, @Body() payload: NodeActionBasePayload) {
    return this.nodesService.doNodeActions(clusterName, payload, NODE_ACTION_TYPE.DRAIN)
  }

  @Put('action/label')
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.EDIT
  // })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.NODE)
  @ApiResponse({ status: 200, type: NodeActionResponse, description: 'Handle label action to nodes' })
  labelNode(@Param('clusterName') clusterName: string, @Body() payload: NodeLabelPayload) {
    return this.nodesService.doNodeActions(clusterName, payload, NODE_ACTION_TYPE.LABEL)
  }

  @Put('action/taint')
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.EDIT
  // })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.NODE)
  @ApiResponse({ status: 200, type: NodeActionResponse, description: 'Handle taint action to nodes' })
  taintNode(@Param('clusterName') clusterName: string, @Body() payload: NodeTaintPayload) {
    return this.nodesService.doNodeActions(clusterName, payload, NODE_ACTION_TYPE.TAINT)
  }

  @Get(':nodeName/pods')
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.VIEW
  // })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  @ApiResponse({ status: 200, type: INodePodListResponse, description: 'Get node pods' })
  @Pagination({
    key: 'pods',
    countKey: 'totalCount',
    defaultOrder: ''
  })
  @UseInterceptors(PaginateInterceptor)
  getNodePodList(
    @Param('clusterName') clusterName: string,
    @Param('nodeName') nodeName: string,
    @Query() query: ListQueryDto
  ) {
    return this.nodesService.getNodePodList(clusterName, nodeName)
  }
}
