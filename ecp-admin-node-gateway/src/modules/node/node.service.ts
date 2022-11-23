import { Injectable } from '@nestjs/common'
import { EcpApisService } from '@/shared/ecp-apis/ecp-apis.service'
import { ListNodesQuery, ListNodesResponse } from '@/modules/node/dto/node.dto'
import { convertEcpApiQueryPagination, convertEcpApiFilterBy } from '@/helpers/query/ecp-apis'

@Injectable()
export class NodeService {
  constructor(private readonly ecpApisService: EcpApisService) {}

  async listNodes(clusterId: string, query: ListNodesQuery): Promise<ListNodesResponse> {
    const { offset, limit, filterBy, orderBy, searchBy } = query
    const ecpApiPagination = convertEcpApiQueryPagination(offset, limit)
    const equalFilters = ListNodesQuery.parseEqualFilters(filterBy)
    const { status = [], roles = [] } = equalFilters
    const ecpApiFilterBy = convertEcpApiFilterBy({
      status,
      role: roles,
    })
    const nodesResponse = await this.ecpApisService
      .getFetch()
      ['GET/ecpapi/v2/clusters/{uuid}/nodes']({
        uuid: clusterId,
        ...ecpApiPagination,
        filterBy: ecpApiFilterBy,
        orderBy,
        searchBy,
      })
    const { total = 0, nodes = [], summary = {}, roles: roleEnums = [] } = nodesResponse
    const parsedNodes: ListNodesResponse['items'] = nodes.map((nodeDetail) => {
      const {
        name = '',
        privateIp = '',
        status = '',
        roles = [],
        taints = [],
        labels = [],
        podSummary = { capacity: 0, count: 0 },
        metrics,
      } = nodeDetail
      const { cpu, gpu, disk, memory } = metrics || {}
      return {
        name,
        privateIP: privateIp,
        status,
        roles,
        labels: labels.map(({ key = '', value = '' }) => ({ key, value })),
        taints: taints.map(({ key = '', value = '', effect = '' }) => ({ key, value, effect })),
        podSummary: {
          capacity: podSummary.capacity ?? 0,
          count: podSummary.count ?? 0,
        },
        metrics: {
          cpu: {
            total: cpu?.allocatable || 0,
            used: cpu?.used || 0,
          },
          memory: {
            total: memory?.allocatable || 0,
            used: memory?.used || 0,
          },
          disk: {
            total: disk?.allocatable || 0,
            used: disk?.used || 0,
          },
          gpu: {
            total: gpu?.allocatable || 0,
            used: gpu?.used || 0,
          },
        },
      }
    })
    return {
      totalCount: total,
      items: parsedNodes,
      filterOptions: {
        status: Object.entries(summary).map(([status, totalCount]) => ({
          option: status,
          totalCount,
        })),
        roles: roleEnums,
      },
    }
  }
}
