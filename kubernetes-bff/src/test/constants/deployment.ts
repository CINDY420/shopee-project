export const updateDeployLimitPayload = {
  phases: [{ phase: 'RELEASE', resource: [{ container: 'gxm-demo-test-sg', cpuLimit: 0.6, memLimit: 1 }] }]
}
