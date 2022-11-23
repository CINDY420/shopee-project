import { ClusterInfoDto } from '../dto/common/cluster.dto'
export interface ICluster {
  // ca: string
  cids: Array<string>
  config: string
  createTime: string
  updateTime: string
  envs: Array<string>
  groups: Array<string>
  name: string
  tenants: Array<string>
}

export interface IResourceQuotas {
  resourceQuotas: {
    [zone in string]: {
      name: string
      cpuTotal: number
      memoryTotal: number
    }
  }
}

export interface IClusterResource {
  cluster: string
  data: IResourceQuotas
}

export type IClusterInfoDetail = Pick<
  ClusterInfoDto,
  'name' | 'creationTimestamp' | 'status' | 'alarms' | 'nodeSummary' | 'podSummary' | 'metrics'
>

export interface IEvent {
  name: string
  namespace: string
  message: string
  reason: string
  kind: string
  creationTimestamp: string
  podip: string
  hostip: string
}
