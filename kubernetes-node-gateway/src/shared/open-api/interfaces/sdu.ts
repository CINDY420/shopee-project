export interface IOpenApiListAllSdusParams {
  tenantId: string
  projectName: string
  appName: string
}

export enum AZ_TYPE {
  KUBERNETES = 'kubernetes',
  BROMO = 'bromo',
}
export enum DEPLOYMENT_HEALTHY {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
}

interface IOpenApiAZ {
  name: string
  type: AZ_TYPE
  env: string
  // Only one cluster item in the clusters array in fact, any other doubts should ask openapi BE
  clusters: string[]
}

export interface IOpenApiContainer {
  image: string
  name: string
  tag: string
  phase: string
}

// openapi responds az item rather than sdu item in fact
export interface IOpenApiSdu {
  name: string
  type: AZ_TYPE
  az: IOpenApiAZ
  componentType: string
  componentTypeDisplay: string
  phase: string
  // deployment required pod count. az and cluster are one-to-one in fact
  instance: number
  tag: string
  updateTime: string
  env: string
  cid: string
  healthy: DEPLOYMENT_HEALTHY
  status: string
  unhealthyCount: number
  releaseCount: number
  canaryCount: number
  clusterId: string
  clusterName: string
  scalable: boolean
  rollbackable: boolean
  fullreleaseable: boolean
  restartable: boolean
  containers: IOpenApiContainer[]
  appInstanceName: string
  monitoringClusterName: string
}

export interface IOpenApiListAllSdusResponse {
  sdus: IOpenApiSdu[]
  componentTypes: string[]
}
