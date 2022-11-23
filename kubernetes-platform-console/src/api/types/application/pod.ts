import { IVolume } from 'api/types/application/application'

interface IUsagePoint {
  x: string
  y: number
}

export interface IUsage {
  capacity: number
  applied: number
  used: number
  status: string
  graph: IUsagePoint[]
}

export interface IPod {
  appName: string
  clusterId: string
  clusterName: string
  containers: string[]
  cpu: IUsage
  creationTimestamp: string
  filesystem: IUsage
  tenantId: number
  labels: string[]
  memory: IUsage
  memRss: IUsage
  name: string
  nodeIP: string
  nodeName: string
  projectName: string
  status: string
  volumes?: IVolume[]
  podIP: string
  podPort: string
  tag: string
  cid: string
  environment: string
  phase: string
  traceId?: string
  namespace: string
}
export interface IPodList {
  appName: string
  clusterId: string
  groupName: string
  pods: IPod[]
  projectName: string
  statusList: string[]
  tagList: string[]
  totalCount: number
  cids: string[]
  clusters: string[]
  environments: string[]
  phaseList: string[]
}

// TODO update
export interface IProfile {
  id: string
}
