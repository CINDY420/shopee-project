import { DEPLOYMENT_EVENT_TYPE } from 'constants/deployment'

export interface IDeploy {
  abnormalPodCount: number
  appliedCPU: number
  appliedMemory: number
  buildId: string
  cid: string
  clusterId: string
  clusterName: string
  deployName: string
  deployTime: string
  env: string
  imageName: string
  name: string
  phase: string
  pipelineName: string
  podCount: number
  rollbackable: true
  runningPodCount: number
  scalable: true
  status: string
  tag: string
  updateTime: string
}

export interface IDeploys {
  appName: string
  cids: string[]
  clusters: string[]
  environments: any
  groupName: string
  phaseList: string[]
  deploys: IDeploy[]
  projectName: string
  statusList: string[]
  totalCount: number
}

export type ITag = Record<'tagname' | 'timestamp', string>

export interface ITags {
  name: string
  tags: ITag[]
}

export interface IDeployFilterInfo {
  cids: string[]
  azs: string[]
  envs: string[]
  name: string
}

export interface IDeployBaseInfoParam {
  groupName: string
  tenantId: number
  projectName: string
  appName: string
  deployName: string
}

export interface IDeployClusterInfo {
  clusterId: string
  phase: string[]
  tag: Array<{
    name: string
    rollback: boolean
  }>
  scalable: boolean
  updateTime: string
}

export interface IDeployBaseInfo extends IDeployBaseInfoParam {
  env: string
  cid: string
  clusterInfo: {
    [key: string]: IDeployClusterInfo
  }
  name: string
}

export interface IDeployInfoParam {
  groupName: string
  projectName: string
  appName: string
  deployName: string
  clusterName: string
  clusterId: string
}

export interface IDeployInfo {
  deployName: string
  clusterName: string
  normalPod: number
  abnormalPod: { [key: string]: number }
  desiredPod: number
}

export interface IAbnormalEventParams {
  tenantId: number
  projectName: string
  appName: string
  deployName: string
  clusterId: string
  phase: string
  types?: string
}

export interface IESEvent {
  cluster: string
  project: string
  application: string
  name: string
  namespace: string
  kind: string
  reason: string
  message: string
  createtime: string
  detail?: string
  hostip: string
  podip: string
}

export interface IDeploymentLatestAbnormalEvent {
  type: DEPLOYMENT_EVENT_TYPE
  event: IESEvent
  totalCount: number
}

export interface IDeploymentLatestAbnormalEvents {
  events: IDeploymentLatestAbnormalEvent[]
  totalCount: number
}

export interface IProfileCronJob {
  enable: false
  env: string
  port: number
  sampleTime: number
  object: string
  cluster: string
  scheduler: string
  memoryLimit: number
  cpuLimit: number
  deployName: string
}

export interface IDeployClusterInfoList {
  appName?: string
  cid?: string
  clusterInfo?: {}
  clusterName?: string
  deployName?: string
  env?: string
  tenantId?: number
  name?: string
  projectName?: string
}
