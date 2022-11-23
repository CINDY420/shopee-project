import { IAlarm } from './cluster'
import { IINodeTaint } from 'swagger-api/v3/models'

interface IUsagePoint {
  x: string
  y: number
}

interface IUsage {
  capacity: number
  used: number
  status: string
  graph: IUsagePoint[]
}

interface ITaint {
  effect: string
  key: string
  value: string
}

export interface INode {
  name: string
  cluster: string
  IP: string
  roles: string[]
  status: string
  cpuMetrics: IUsage
  memMetrics: IUsage
  podMetrics: IUsage
  alarms: IAlarm[]
  taints: ITaint[]
  labels: {
    [key: string]: string
  }
}

export interface INodeList {
  healthyCount: number
  nodes: INode[]
  totalCount: number
  unhealthyCount: number
}

export interface IAction {
  nodes: string[]
  labels?: object
  action?: string
  taint?: IINodeTaint
}

export interface IActionResult {
  fail: string[]
  success: string[]
}
