/* eslint-disable */

export class ILabel {
  key: string
  value: string
}
export class IClusterBrief {
  displayName: string
  region: string
  az: string
  env: string
  clusterId: number
  insecure: boolean
  status: string
  numOfRunningMembers: number
  numOfAllMembers: number
  monitoringPanelUrl: string
  labels: ILabel[]
}

export class IClusterEnvAzs {
  azList: string[]
  envList: string[]
}
export class IClusterListEnvAzsResponse {
  data: IClusterEnvAzs
}

export class IClusterListClusterResponse {
  data: IClusterBrief[]
}

export class IClusterDetailResponse {
  data: IClusterDetail
}


export class IClusterDetail {
  region: string
  az: string
  env: string
  clusterId: number
  insecure: boolean
  status: string
  numOfRunningMembers: number
  numOfAllMembers: number
  monitoringPanelUrl: string
  memberList: IMember[]
  total: number
}

export class IMember {
  role: string
  status: string
  quotaSize: string
  peerPort: number
  clientPort: number
  ip: string
  conditions: ICondition[]
}

export class ICondition {
  type: string
  status: string
  lastTransitionTime: string
  reason: string
  message: string
}

