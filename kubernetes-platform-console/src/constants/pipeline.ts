export const PIPELINE_ACTIONS = {
  EDIT: 'Edit',
  RUN_PIPELINE: 'Run Pipeline',
  REBUILD: 'Rebuild',
  ABORT: 'Abort',
  MOVE: 'Move',
  MIGRATE: 'Migrate',
  BATCH_MIGRATE: 'BatchMigrate'
}

export const PIPELINE_STATUS = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  unstable: 'UNSTABLE',
  notBuilt: 'NOT_BUILT',
  running: 'RUNNING',
  aborted: 'ABORTED',
  pending: 'PENDING',
  pausedPendingInput: 'PAUSED_PENDING_INPUT'
}

export const PIPELINE_STATUS_TYPE = {
  success: 'Success',
  failure: 'Failed',
  running: 'Running',
  aborted: 'Aborted',
  pending: 'Pending'
}

export const PIPELINE_STATUS_NAME = {
  [PIPELINE_STATUS.success]: [PIPELINE_STATUS_TYPE.success],
  [PIPELINE_STATUS.failure]: [PIPELINE_STATUS_TYPE.failure],
  [PIPELINE_STATUS.unstable]: [PIPELINE_STATUS_TYPE.failure],
  [PIPELINE_STATUS.notBuilt]: [PIPELINE_STATUS_TYPE.failure],
  [PIPELINE_STATUS.running]: [PIPELINE_STATUS_TYPE.running],
  [PIPELINE_STATUS.pausedPendingInput]: [PIPELINE_STATUS_TYPE.running],
  [PIPELINE_STATUS.aborted]: [PIPELINE_STATUS_TYPE.aborted],
  [PIPELINE_STATUS.pending]: [PIPELINE_STATUS_TYPE.pending]
}

export const PIPELINE_STATUS_COLOR = {
  [PIPELINE_STATUS.success]: '#55CC77',
  [PIPELINE_STATUS.failure]: '#FF4742',
  [PIPELINE_STATUS.notBuilt]: '#FF4742',
  [PIPELINE_STATUS.unstable]: '#FF4742',
  [PIPELINE_STATUS.running]: '#2673DD',
  [PIPELINE_STATUS.pausedPendingInput]: '#FFBF00',
  [PIPELINE_STATUS.aborted]: '#FF4742',
  [PIPELINE_STATUS.pending]: '#999999'
}

export const PIPELINE_STEP_STATUS = {
  success: 'SUCCESS',
  failed: 'FAILED',
  aborted: 'ABORTED',
  notExecuted: 'NOT_EXECUTED',
  inProcess: 'IN_PROGRESS',
  pausedPendingInput: 'PAUSED_PENDING_INPUT',
  pending: 'PENDING'
}

export const PIPELINE_STEP_ICON_COLOR = {
  [PIPELINE_STEP_STATUS.success]: '#55CC77',
  [PIPELINE_STEP_STATUS.failed]: '#FF4742',
  [PIPELINE_STEP_STATUS.aborted]: '#FF4742',
  [PIPELINE_STEP_STATUS.inProcess]: '#2673DD',
  [PIPELINE_STEP_STATUS.notExecuted]: '#B7B7B7',
  [PIPELINE_STEP_STATUS.pausedPendingInput]: '#2673DD',
  [PIPELINE_STEP_STATUS.pending]: '#B7B7B7'
}

export const PIPELINE_STEP_COLOR = {
  [PIPELINE_STEP_STATUS.notExecuted]: '#999999',
  [PIPELINE_STEP_STATUS.pending]: '#B7B7B7'
}

export const PIPELINE_STEP_BACKGROUND = {
  [PIPELINE_STEP_STATUS.success]: '#EBF9EF',
  [PIPELINE_STEP_STATUS.failed]: '#FFF2E8',
  [PIPELINE_STEP_STATUS.aborted]: '#FFF2E8',
  [PIPELINE_STEP_STATUS.inProcess]: '#F6F9FE',
  [PIPELINE_STEP_STATUS.pausedPendingInput]: '#F6F9FE'
}

export const FREEZE_PIPELINES_STATUS = {
  FREEZING: 'Freezing',
  APPROACHING: 'Approaching',
  COMPLETED: 'Completed',
  STOPPED: 'Stopped'
}

export const ENV = {
  LIVE: 'live',
  LIVEISH: 'liveish',
  TEST: 'test',
  STAGING: 'staging',
  DEV: 'dev',
  STABLE: 'stable',
  QA: 'qa'
}

export const DEFAULT_PLATFORM_CLUSTER = {
  TEST: 'kube-general-sg2-test',
  LIVE: 'kube-general-ctl-live'
}

export enum MIGRATION_TASK_STATUS {
  success = 'succeeded',
  pending = 'pending',
  running = 'running',
  failed = 'failed'
}
export const K8S_TEMPLATE = 'k8s-deploy-shared-library'
export const NON_K8S_TEMPLATE = 'deploy-shared-library'
export const CUSTOM_TEMPLATE = 'custom'
export const PIPELINE_TEMPLATE = [K8S_TEMPLATE, NON_K8S_TEMPLATE]
export const DISABLED_MIGRATE_ENGINE = 'jenkins-sg-live'
