/* eslint-disable */

export class IV2BindClusterRequest {
  srcUuid?: string
  leapConfig?: IV2LeapConfig
}

export class IV2BindClusterResponse {}

export class IV2GetClusterBindStatusResponse {
  cluster?: string
  isBind?: boolean
  karmadaResourceCluster?: string
  karmadaHostCluster?: string
  phase?: string
  healthy?: string
}

export class IV2GetQuotaResponse {
  quotas?: IV2QuotaResponse[]
}

export class IV2GetSduQuotaResponse {
  quotas?: IV2SduQuota[]
}

export class IV2HealthCheckResponse {
  app?: string
  message?: string
}

export class IV2LeapConfig {
  qps?: string
  burst?: string
  namespace?: string
  scheduler?: string
  schedulerLease?: string
  watcherResyncSeconds?: string
  watcherQueueLength?: string
  maxTerminatedTasks?: string
  workerInactiveDeferSeconds?: string
  topologySkew?: number
  networkMaxConn?: number
  enableTopologySpread?: boolean
  disableEviction?: boolean
}

export class IV2MaintainClusterResponse {}

export class IV2OperationResponse {
  affectRows?: number
  msg?: string
}

export class IV2QuotaRequest {
  az?: string
  segment?: string
  env?: string
  tenantId?: string
  cpu?: string
  memory?: string
  reason?: string
}

export class IV2QuotaResponse {
  az?: string
  segment?: string
  env?: string
  tenantId?: string
  cpuApplied?: string
  memoryApplied?: string
  cpuQuota?: string
  memoryQuota?: string
}

export class IV2SduQuota {
  sdu?: string
  az?: string
  segment?: string
  cpu?: string
  memory?: string
}

export class IV2SegmentQuotaResponse {
  az?: string
  segment?: string
  env?: string
  cpuApplied?: string
  cpuAssigned?: string
  cpuTotal?: string
  memoryApplied?: string
  memoryAssigned?: string
  memoryTotal?: string
  needCheck?: boolean
}

export class IV2TenantQuotaSwitch {
  az?: string
  segment?: string
  env?: string
  switch?: boolean
}

export class IV2TenantsQuota {
  quotas?: IV2QuotaRequest[]
}
