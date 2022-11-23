export const COMPONENT_TYPE = {
  DEPLOYMENT: 'deployment',
  DEPLOYMENT_ENHANCE1: 'deployment-enhance1',
  DEPLOYMENT_ENHANCE2: 'deployment-enhance2',
  DEPLOYMENT_ENHANCE3: 'deployment-enhance3',
  DEPLOYMENT_CI_COREDUMP: 'deployment-ci-coredump',
  DEPLOYMENT_PV: 'deployment-pv',
  CLONESET: 'cloneset',
  PIPELINE_CLONESET_MLP: 'pipeline-cloneset-mlp',
  STATEFULSET: 'statefulset',
  STATEFULSET_NORMAL: 'statefulset-normal',
  STATEFULSET_ENHANCE: 'statefulset-enhance',
  BROMO: 'bromo',
  BROMO_SG: 'bromo-sg',
  BROMO_ECP_POC: 'bromo-ecp-poc',
  MESOS: 'mesos',
}

export const DEPLOY_ENGINE = {
  OAM: 'OAM',
  BROMO: 'Bromo',
}

// canary phase in OAM is 'CANARY', in Bromo is start with 'CANARY'
export const DEPLOYMENT_CANARY_PHASE = 'CANARY'

export const QUOTA_UNIT = {
  CPU: 'Cores',
  MEMORY: 'GiB',
}

export const NO_LIMIT_RESOURCE_TEXT = 'No-Limit'

export const RUNNING_STATUS_MAP: Record<string, string> = {
  NotSetLivenessProbe: 'Running | Unknown',
  Running: 'Running | Healthy',
}

export const ABNORMAL_STATUS_TEXT_MAP: Record<string, string> = {
  ContainersNotReady: 'Running | Unhealthy',
}

export enum DeploymentActions {
  ROLLBACK = 'Rollback',
  SCALE = 'Scale',
  RESTART = 'Restart',
  FULL_RELEASE = 'Full Release',
  CANCEL_CANARY = 'Cancel Canary',
  SUSPEND = 'Suspend',
  STOP = 'Stop',
}

export const MoreActions = [
  DeploymentActions.FULL_RELEASE,
  DeploymentActions.CANCEL_CANARY,
  DeploymentActions.SUSPEND,
  DeploymentActions.STOP,
]
