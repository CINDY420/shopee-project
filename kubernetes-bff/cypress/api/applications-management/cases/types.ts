const cpuType = {
  used: 'number',
  applied: 'number',
  Ready: 'boolean'
}

export const expectedPodType = {
  name: 'string',
  nodeName: 'string',
  namespace: 'string',
  cid: 'string',
  environment: 'string',
  nodeIP: 'string',
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
  projectName: 'string',
  appName: 'string',
  groupName: 'string',
  phase: 'string',
  clusterId: 'string'
}
