export enum DEPLOYMENT_ACTIONS {
  SCALE = 'Scale',
  ROLLBACK = 'Rollback',
  FULL_RELEASE = 'Full Release',
  ROLLOUT_RESTART = 'Rollout Restart',
  CANCEL_CANARY = 'Cancel Canary',
  SCHEDULE_PROFILING = 'Schedule Profiling',
  DELETE = 'Delete'
}

export const BATCH_SCALE_FORM = 'BATCH_SCALE_FORM'

export enum STRATEGY_TYPE {
  RollingUpdate = 'RollingUpdate',
  ReCreate = 'Recreate',
  InPlaceIfPossible = 'InPlaceIfPossible'
}

export const PHASE_CANARY = 'RELEASE/CANARY'
export const CANARY_PHASE = 'CANARY/RELEASE'
export const PHASE_RELEASE = 'RELEASE'
export const RELEASE_OR_CANARY_PHASES = [PHASE_CANARY, CANARY_PHASE, PHASE_RELEASE]

export enum EVENT_QUERY_KEYS {
  NAMESPACE = 'namespace',
  REASON = 'reason',
  SEARCH_ALL = 'searchAll'
}

export enum DEPLOYMENT_EVENT_TYPE {
  FAILED_SCHEDULING = 'FailedScheduling',
  PROBE_FAILED = 'Probe Failed'
}

export const searchAllMap = {
  [DEPLOYMENT_EVENT_TYPE.FAILED_SCHEDULING]: 'FailedScheduling',
  [DEPLOYMENT_EVENT_TYPE.PROBE_FAILED]: 'probe failed'
}

export enum FLAVOR_OPTION {
  DEFAULT_CONFIGURATION = 'default-configuration',
  CUSTOM_SETTING = 'custom-setting'
}

export enum PROFILE_OBJECT {
  CPU = 'CPU',
  TRACE = 'Trace'
}

export const TABS = {
  OVERVIEW: 'Overview',
  BASIC_INFO: 'Basic Info',
  PROFILING_HISTORY: 'Profiling History'
}

export const LEAP_TABS = {
  TASK: 'Task',
  DEPLOYMENT_HISTORY: 'Deployment History'
}

export const SDU_TYPE = {
  ECP: 'Ecp',
  LEAP: 'Leap'
}

export const STATUS_TYPES = {
  RUNNING: 'running'
}

export const HEALTHY_TYPES = {
  HEALTHY: 'healthy',
  UNHEALTHY: 'unhealthy'
}

export const STATUS_HEALTHY_COLORS_MAP = {
  [HEALTHY_TYPES.HEALTHY]: '#52C41A',
  [HEALTHY_TYPES.UNHEALTHY]: '#FF4D4F'
}

export const QUOTA_UNIT = {
  CPU: 'Cores',
  MEMORY: 'GiB',
  DISK: 'M'
}

export enum DEPLOYMENT_STATUS {
  RUNNING = 'running',
  NORMAL = 'normal',
  ABNORMAL = 'abnormal'
}
export const AZ_TYPE_QUERY_KEY = 'azType'
export const AZ_QUERY_KEY = 'az'
export const COMPONENT_QUERY_KEY = 'componentType'
export enum AZ_TYPE {
  KUBERNETES = 'kubernetes',
  BROMO = 'bromo'
}

export const AZ_TYPE_MAP_COMPONENT_TYPE = {
  [AZ_TYPE.KUBERNETES]: SDU_TYPE.ECP,
  [AZ_TYPE.BROMO]: SDU_TYPE.LEAP
}

// Leap has no clusterId, make it be a dummy
export const LEAP_CLUSTER_ID = 'dummy'
