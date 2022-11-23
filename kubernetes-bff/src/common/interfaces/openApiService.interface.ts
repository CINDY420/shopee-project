export interface IOpenApiConfig {
  protocol: string
  host: string
  port?: number
}

export interface IOpenApiBaseResponse {
  code: number
  message: string
}

export interface IListNamespaceOamPayLoad {
  project: string
  application: string
  cid: string
  clusterName: string
  env: string
  namespace: string
  feature?: string
}

export interface IOamContainer {
  name: string
  image: string
  limits: {
    cpu: string
    memory: string
  }
}

export interface IOamWorkloadStatus {
  replicas: number
  readyReplicas: number
  unavailableReplicas: number
  availableReplicas: number
  updatedReplicas: number
  currentReplicas: number
  containers: IOamContainer[]
}

export interface IOamCanaryWorkloadStatus {
  replicas: number
  readyReplicas: number
  unavailableReplicas: number
  availableReplicas: number
  updatedReplicas: number
  currentReplicas: number
  containers: IOamContainer[]
}

export interface IOamRuntimeStatus {
  status: string
  phase: string[]
  updateTime: string
  workloadStatus: IOamWorkloadStatus
  canaryWorkloadStatus: IOamCanaryWorkloadStatus
}

export interface IOamStatus {
  conditions: [
    {
      type: string
      status: string
      lastTransitionTime: string
      reason: string
      message: string
    }
  ]
  errors: string[]
  runtimeStatus: IOamRuntimeStatus
  status: string
  isSynced: true
}

export interface IOam {
  name: string
  namespace: string
  labels: Record<string, string>
  spec: {
    components: [
      {
        name: string
        type: string
      }
    ]
    environments: {
      tenant: string
      group: string
      project: string
      application: string
      cluster: string
      env: string
      cid: string
      feature: string
    }
  }
  status: IOamStatus
}

export interface IListNamespaceOamResponse extends IOpenApiBaseResponse {
  items: IOam[]
}
