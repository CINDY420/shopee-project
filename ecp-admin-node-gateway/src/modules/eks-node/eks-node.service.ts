import { Injectable } from '@nestjs/common'
import { EksApisService } from '@/shared/eks-apis/eks-apis.service'
import {
  EksListNodesParams,
  EksListNodesQuery,
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
  EksSetNodesLabelsParams,
  EksSetNodesLabelsBody,
  EksSetNodesTiantsBody,
  EksSetNodesTiantsParams,
} from '@/modules/eks-node/dto/eks-node.dto'
import { listQuery } from '@infra/utils'
import { NODE_LIST_ROLE_FILTER_PREFIX } from '@/constants/eksNode'
import { formatDataFromByteToGib } from '@/helpers/utils/format'

const { FilterByParser, FilterByOperator, offsetLimitToPagination } = listQuery

@Injectable()
export class EksNodeService {
  constructor(private readonly eksApisService: EksApisService) {}

  private buildNodeListFilters = (
    filterBy: string | undefined,
  ): { labelSelector: string | undefined; fieldSelector: string | undefined } => {
    if (filterBy === undefined) {
      return {
        labelSelector: undefined,
        fieldSelector: undefined,
      }
    }

    const filterByParser = new FilterByParser(filterBy)

    const equalKeyPathValuesMap = filterByParser.parseByOperator(FilterByOperator.EQUAL)

    const { roles, ...restFilter } = equalKeyPathValuesMap || {}

    const fieldSelector = Object.entries(restFilter)
      .map(([key, values]) => `${key}${FilterByOperator.EQUAL}${values.join(',')}`)
      .join(';')

    const labelSelector = roles?.map((role) => `${NODE_LIST_ROLE_FILTER_PREFIX}${role}=`).join(',')
    return { labelSelector, fieldSelector }
  }

  async listNodes(params: EksListNodesParams, query: EksListNodesQuery) {
    const { offset, limit, filterBy, searchBy, labelSelector } = query
    const { clusterId } = params

    const { labelSelector: listLabelSelector, fieldSelector } = this.buildNodeListFilters(filterBy)

    const { currentPage, pageSize } = offsetLimitToPagination({
      offset: Number(offset),
      limit: Number(limit),
    })

    const {
      nodes = [],
      roles = [],
      total = 0,
      all_scheduling_status: allSchedulingStatus = [],
    } = await this.eksApisService.getApis().listNodes(
      { id: clusterId },
      {
        pageNo: currentPage,
        pageSize,
        labelSelector: [labelSelector, listLabelSelector].filter(Boolean).join(';'),
        fieldSelector,
        fuzzySearch: searchBy,
      },
    )

    const nodeItems =
      nodes?.map((node) => {
        const {
          name = '',
          private_ip: privateIp = '',
          status = '',
          roles = [],
          labels = [],
          taints = [],
          cpu = {},
          gpu = {},
          memory = {},
          disk = {},
          pod_summary: podSummary = {},
          node_group: nodeGroup = 0,
          node_group_name: nodeGroupName = '',
          scheduling_status: schedulingStatus = '',
        } = node
        const { capacity = 0, allocated = 0, allocatable = 0 } = memory
        const formatMemoryMetric = {
          capacity: formatDataFromByteToGib(capacity),
          allocated: formatDataFromByteToGib(allocated),
          allocatable: formatDataFromByteToGib(allocatable),
        }
        const condition =
          node?.condition?.map((item) => {
            const {
              message = '',
              meta = '',
              reason = '',
              severity = '',
              status = '',
              update_time: updateTime = '',
            } = item
            return {
              message,
              meta,
              reason,
              severity,
              status,
              updateTime,
            }
          }) || []
        return {
          nodeName: name,
          privateIp,
          status,
          roles,
          labels,
          taints,
          cpu,
          gpu,
          memory: formatMemoryMetric,
          disk,
          podSummary,
          nodeGroup,
          nodeGroupName,
          schedulingStatus,
          condition,
        }
      }) || []
    return {
      items: nodeItems,
      total,
      rolesList: roles,
      allSchedulingStatus,
    }
  }

  async cordonNodes(params: EksCordonNodesParams, body: EksCordonNodesBody) {
    const { clusterId } = params
    const { nodeNames } = body
    return this.eksApisService.getApis().cordon({ id: clusterId }, { nodes_names: nodeNames })
  }

  async unCordonNodes(params: EksUnCordonNodesParams, body: EksUnCordonNodesBody) {
    const { clusterId } = params
    const { nodeNames } = body
    return this.eksApisService.getApis().uncordon({ id: clusterId }, { nodes_names: nodeNames })
  }

  async drainNodes(params: EksDrainNodesParams, body: EksDrainNodesBody) {
    const { clusterId } = params
    const { nodeNames } = body
    return this.eksApisService.getApis().drain({ id: clusterId }, { nodes_names: nodeNames })
  }

  async addNodes(params: EksAddNodesParams, body: EksAddNodesBody) {
    const { clusterId } = params
    const { hostIPs, nodeGroupId } = body
    return this.eksApisService
      .getApis()
      .scaleUpNodeGroup({ id: clusterId }, { host_ips: hostIPs, node_group_id: nodeGroupId })
  }

  async deleteNodes(params: EksDeleteNodesParams, body: EksDeleteNodesBody) {
    const { clusterId } = params
    const { hostIPs, nodeGroupId } = body
    return this.eksApisService
      .getApis()
      .scaleDownNodeGroup({ id: clusterId }, { host_ips: hostIPs, node_group_id: nodeGroupId })
  }

  async getNodeGroupList(params: EksGetNodeGroupListParams) {
    const { clusterId } = params
    const { data = [] } = await this.eksApisService.getApis().listNodeGroup({ id: clusterId })
    const nodeGroups = data.map((nodeGroup) => {
      const { id = 0, uuid = '' } = nodeGroup
      return {
        nodeGroupId: id,
        nodeGroupName: uuid,
      }
    })
    return { nodeGroups }
  }

  async setNodeLabels(params: EksSetNodesLabelsParams, body: EksSetNodesLabelsBody) {
    const { clusterId } = params
    const { nodes, labels } = body

    await this.eksApisService
      .getApis()
      .postLabels({ id: clusterId }, { nodes_name: nodes, node_labels: labels })

    return
  }

  async setNodeTiants(params: EksSetNodesTiantsParams, body: EksSetNodesTiantsBody) {
    const { clusterId } = params
    const { nodes, taints } = body

    await this.eksApisService.getApis().postTaints({ id: clusterId }, { nodes_name: nodes, taints })

    return
  }
}
