import { OpenApiListQuery } from '@/common/dtos/openApi/list.dto'

class PodListItem {
  jobId: string
  jobName: string
  taskName: string
  clusterId: string
  namespace: string
  podName: string
  podPhase: string
  reason: string
  nodeIp: string
  createdAt: number // utc timestamp
}

export class ListPodsResponse {
  total: number

  items: PodListItem[]
}

export class OpenApiListPodsQuery extends OpenApiListQuery {}

class PodContainerListItem {
  containerName: string
  podName: string
  taskName: string
  namespace: string
  image: string
  reason: string
}
export class ListPodContainersResponse {
  items: PodContainerListItem[]
}

export class GetPodTerminalSessionId {
  sessionId: string
}
