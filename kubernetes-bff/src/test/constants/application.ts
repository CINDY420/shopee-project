export const createApplicationPayload = {
  // appName
  strategyType: { type: 'RollingUpdate', value: { maxSurge: '25%', maxUnavailable: '0' } },
  healthCheck: {
    readinessProbe: {
      type: 'HTTP',
      typeValue: 'autotest',
      initialDelaySeconds: 15,
      periodSeconds: 5,
      successThreshold: 1,
      timeoutSeconds: 5
    },
    livenessProbe: {}
  },
  pipeline: ''
}
