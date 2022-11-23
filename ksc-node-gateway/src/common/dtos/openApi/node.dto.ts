import { NODE_ACTIONS } from '@/common/constants/node'
import { OpenApiListQuery } from '@/common/dtos/openApi/list.dto'

class NodeLabel {
  key: string
  value: string
}

class NodeTaint extends NodeLabel {
  effect: string
}

class NodeListItem {
  nodeId: string
  name: string
  status: string
  nodeIp: string
  roles: Array<string>
  labels: Array<NodeLabel>
  taints: Array<NodeTaint>
}

export class ListNodesResponse {
  total: number
  items: NodeListItem[]
}

export class OpenApiListNodesQuery extends OpenApiListQuery {}

export class GetNodeOverviewResponse {
  total: string
  ready: string
  notready: string
}

export class UpdateNodePayload {
  labels?: Array<NodeLabel>
  taints?: Array<NodeTaint>
  action?: NODE_ACTIONS
}

export class UpdateNodeBody {
  payload: UpdateNodePayload
}

export class UpdateNodeResponse extends NodeListItem {}
