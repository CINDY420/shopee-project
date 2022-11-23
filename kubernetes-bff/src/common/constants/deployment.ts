export const PHASE_CANARY = 'CANARY'
export const PHASE_RELEASE = 'RELEASE'
export const PHASE_DEPRECATED = 'DEPRECATED'
export const PHASE_FEATURE_TEST = 'FEATURE-TEST'
export const PHASE_PFB = 'PFB'

export const GREEN = 'GREEN'
export const BLUE = 'BLUE'

export const INIT = 'Init:'
export const SIGNAL = 'Signal:'
export const EXIT_CODE = 'ExitCode:'

export enum REASON {
  POD_INITIALIZING = 'PodInitializing',
  COMPLETED = 'Completed',
  RUNNING = 'Running',
  UNKNOWN = 'Unknown',
  NODE_LOST = 'NodeLost',
  TERMINATING = 'Terminating',
  FAILED_SCHEDULING = 'FailedScheduling',
  SCHEDULED = 'Scheduled'
}

export enum POD_STATUS {
  ERROR = 'Error',
  CRASH_LOOP_BACK_OFF = 'CrashLoopBackOff',
  RUNNING = 'Running',
  CONTAINERS_NOT_READY = 'ContainersNotReady'
}

export enum POD_TYPE {
  ERROR = 'Error',
  CRASH_LOOP_BACK_OFF = 'CrashLoopBackOff',
  UNHEALTHY = 'RunningUnhealthy',
  OTHER = 'Other',
  HEALTHY = 'Healthy'
}

export enum POD_CONDITIONS {
  CONTAINERS_READY = 'ContainersReady',
  READY = 'Ready'
}

export enum PHASE {
  RELEASE = 'RELEASE',
  CANARY = 'CANARY',
  FTE = 'FTE',
  DEPRECATED = 'DEPRECATED'
}

export const PLATFORM_LABEL = 'kube-platform.shopee.io'
export const DESIRED_REPLICASANNOTATION = PLATFORM_LABEL + '/desired-replicas'
export const DESIRED_CANARY_REPLICASANNOTATION = PLATFORM_LABEL + '/desired-canary-replicas'
export const ROLLOUT_RESTART = PLATFORM_LABEL + '/rollout-restart'
export const ROLLOUT_RESTART_CANARY = PLATFORM_LABEL + '/rollout-restart-canary'

export enum DEPLOYMENT_EVENT_TYPE {
  FAILED_SCHEDULING = 'FailedScheduling',
  PROBE_FAILED = 'Probe Failed'
}

export enum DEPLOYMENT_OAM_TYPE {
  DEPLOYMENT = 'deployment',
  STATEFUL_SET = 'statefulset',
  CLONE_SET = 'cloneset'
}

export const ANNOTATIONS_TRACE_ID_KEY = 'shopee.io/trace-id'
export const ANNOTATIONS_CREATED_TIMESTAMP = 'lifecycle.apps.kruise.io/timestamp'
export const ANNOTATIONS_ZONE = 'online.colocation.ecp.shopee.io/zone'
