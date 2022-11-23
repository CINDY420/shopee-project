const expectedMetricType = {
  used: 'number',
  capacity: 'number'
}

export const expectedNodeType = {
  name: 'string',
  IP: 'string',
  roles: 'array',
  status: 'string',
  cpuMetrics: expectedMetricType,
  memMetrics: expectedMetricType,
  podMetrics: expectedMetricType,
  taints: 'array',
  labels: 'object',
  statusExtra: 'array',
  cluster: 'string'
}

const cpuType = {
  used: 'number',
  applied: 'number'
}

export const expectedNodePodType = {
  name: 'string',
  nodeName: 'string',
  namespace: 'string',
  nodeIp: 'string',
  podIP: 'string',
  status: 'string',
  creationTimestamp: 'string',
  containers: [
    {
      image: 'string',
      name: 'string',
      tag: 'string'
    }
  ],
  cpu: cpuType,
  memory: cpuType,
  restart: 'object',
  clusterName: 'string'
}
