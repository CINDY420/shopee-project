import { Az } from '@/features/deployment/entities/deployment.entity'

/**
 * 定位deployment的要素
 */
export interface IDeploymentInfo {
  tenantId: number | string
  projectName: string
  appName: string
  deploymentName: string
  clusterName: string
  cid: string
  env: string
  phase: string
}

export interface IDeploymentContainer {
  image: string
  name: string
  tag: string
}

export interface IDeploymentDetail {
  name: string
  podCount: number
  abnormalPodCount: number
  runningPodCount: number
  releaseCount: number
  canaryCount: number
  clusterId: string
  clusterName: string
  phase: string
  status: string
  updateTime: Date
  scalable: boolean
  rollbackable: boolean
  fullreleaseable: boolean
  restartable: boolean
  containers: IDeploymentContainer[]
  appInstanceName: string
  monitoringClusterName: string
  componentType: string
  componentTypeDisplay: string
  az: Az
  zoneName: string
}

export interface IOpenApiResponse<TData = unknown> {
  code: number
  message: string
  data: TData
}

export interface IDeployConfig {
  enable: boolean
  data: string
  comment: string
  createAt: string
  createTime: string
  version: string
}
