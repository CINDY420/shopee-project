export const NODE_STATUS = {
  READY: 'Ready',
  NOT_READY: 'Not Ready',
  UNKNOWN: 'Unknown',
  SCHEDULINGDISABLED: 'SchedulingDisabled'
}

export const USAGE_COLORS = {
  Free: '#ddd',
  Reserved: '#F6D564',
  Applied: '#6FC9CA',
  Used: '#3D90F7',
  Unused: '#888'
}

// hardcode for back-end shit
export const UNKNOWN_CLUSTER = 'unknown'

export enum ClusterConfigNames {
  environments = 'Environment',
  cids = 'CID',
  tenants = 'Tenant'
}

export const CLUSTER_STATUS = {
  healthy: 'Healthy',
  unhealthy: 'Unhealthy',
  unknown: 'Unknown'
}
