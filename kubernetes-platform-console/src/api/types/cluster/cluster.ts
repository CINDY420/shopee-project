interface IHealthySummary {
  count: number
  unhealthyCount: number
}

interface IMetrics {
  capacity: number
  reserved: number
  assigned: number
  free: number
  used: number
}

export interface IAlarm {
  type: string
  resourceName: string
  detail: { [key: string]: string }
}

export interface ICluster {
  creationTimestamp: string
  id: string
  name: string
  config: {
    name: string
    kubeconfig: string
  }
  nodeSummary: IHealthySummary
  podSummary: IHealthySummary
  status: string
  alarms: IAlarm[]
  metrics: {
    cpu: IMetrics
    memory: IMetrics
  }
}

export interface IClusterList {
  clusters: ICluster[]
  totalCount: number
}

export interface IClusterConfig {
  name: string
  kubeconfig: string
}

export interface IClusterFlavor {
  cpu: number
  memory: number
}

export interface IClusterFlavors {
  flavors: IClusterFlavor[]
}

export interface IClusterFlavorsItem {
  flavors: IClusterFlavor[]
  clusters: string[]
}
