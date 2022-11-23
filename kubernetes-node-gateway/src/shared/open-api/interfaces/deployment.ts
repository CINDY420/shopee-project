import { DEPLOYMENT_HEALTHY } from '@/shared/open-api/interfaces/sdu'
export interface IOpenApiListAllTasksParams {
  tenantId: string
  projectName: string
  appName: string
  sduName: string
}

interface IUsage {
  used: number
  applied: number
  ready: boolean
  alarm: string
  total: number
}
export interface IOpenApiTask {
  id: string
  address: string
  host: string
  containerId: string
  deploymentId: string
  status: string
  health: string
  cpu: IUsage
  memory: IUsage
  createTime: string
}

export type IOpenApiListAllTasksResponse = IOpenApiTask[]

export interface IOpenApiListAllDeploymentHistoryParams {
  tenantId: string
  projectName: string
  appName: string
  sduName: string
}

export interface IOpenApiDeploymentHistory {
  deploymentId: string
  phase: string
  tag: string
  healthyInstances: number
  unhealthyInstances: number
  instances: number
  cpu: number
  disk: number
  memory: number
  status: string
  updateTime: string
  healthy: DEPLOYMENT_HEALTHY
  pendingReason: string
}

export type IOpenApiListAllDeploymentHistoryResponse = IOpenApiDeploymentHistory[]
