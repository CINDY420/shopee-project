import { ListQuery } from '@/helpers/query/list-query.dto'
import { IsString } from 'class-validator'

class NodeTaint {
  key: string
  value: string
  effect: string
}

class NodeDetailPodSummary {
  capacity: number
  count: number
}
class NodeDetailMetricsSpec {
  total: number
  used: number
}
class NodeDetailMetrics {
  cpu: NodeDetailMetricsSpec
  memory: NodeDetailMetricsSpec
  disk: NodeDetailMetricsSpec
  gpu: NodeDetailMetricsSpec
}

class NodeLabel {
  key: string
  value: string
}
class NodeDetail {
  name: string
  privateIP: string
  status: string
  roles: string[]
  labels: NodeLabel[]
  taints: NodeTaint[]
  podSummary: NodeDetailPodSummary
  metrics: NodeDetailMetrics
}

class NodeStatusFilterOptions {
  option: string
  totalCount: number
}

class NodeFilterOptions {
  status: NodeStatusFilterOptions[]
  roles: string[]
}

export class ListNodesResponse {
  items: NodeDetail[]
  filterOptions: NodeFilterOptions
  totalCount: number
}
export class ListNodesQuery extends ListQuery {}

export class ListNodesParams {
  @IsString()
  clusterId: string
}
