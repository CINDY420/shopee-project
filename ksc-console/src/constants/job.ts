export enum BATCH_ACTIONS {
  BATCH_DELETE_JOB = 'Batch Delete Selected',
  BATCH_KILL_JOB = 'Batch Kill Selected',
  BATCH_ENABLE_JOB = 'Batch Enable Selected',
  DELETE_ALL = 'Delete All Jobs',
}

export enum COLUMN_ACTIONS {
  DELETE = 'Delete',
  KILL = 'Kill',
  RUN = 'run',
  SCALE = 'Scale',
  REASON = 'Reason',
}

export enum JOB_TYPE {
  MPI = 'mpi',
  TENSORFLOW = 'tensorflow',
  PYTORCH = 'pytorch',
  DAG = 'dag',
  STREAMING = 'streaming',
  WEB_JOB = 'web-job',
}

export const JOB_TYPES = [
  {
    value: 'mpi',
    name: 'MPI',
  },
]

export const BASIC_INFORMATION = [
  { displayName: 'Job Name', formNamePath: 'jobName' },
  { displayName: 'Type', formNamePath: 'jobType' },
  { displayName: 'Env', formNamePath: 'env' },
  { displayName: 'Priority', formNamePath: 'priority' },
  { displayName: 'Running Timeout', formNamePath: 'runningOvertime' },
  { displayName: 'Pending Timeout', formNamePath: 'pendingOvertime' },
  { displayName: 'Share Dir', formNamePath: 'shareDir' },
  { displayName: 'Notification', formNamePath: 'supportNotify' },
  { displayName: 'Parameters', formNamePath: 'parameters' },
]
