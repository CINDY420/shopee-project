const summaryType = {
  count: 'number',
  unhealthyCount: 'number'
}

const metricType = {
  capacity: 'number',
  reserved: 'number',
  assigned: 'number',
  free: 'number',
  used: 'number',
  assignedUsage: 'number',
  usedUsage: 'number'
}

export const expectedClusterType = {
  id: 'string',
  name: 'string',
  creationTimestamp: 'string',
  config: {
    name: 'string',
    kubeconfig: 'string'
  },
  status: 'string',
  alarms: 'array',
  nodeSummary: summaryType,
  podSummary: summaryType,
  metrics: {
    cpu: metricType,
    memory: metricType
  }
}

const expectedClusterListItemType = {
  ...expectedClusterType,
  envs: 'array',
  cids: 'array',
  groups: 'array'
}

export const expectedClusterListType = {
  clusters: [expectedClusterListItemType],
  totalCount: 'number'
}
