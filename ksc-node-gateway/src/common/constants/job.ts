export enum JOB_STATUS {
  PENDING = 'Pending',
  RUNNING = 'Running',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  KILLED = 'Killed',
  QUEUING = 'Queuing',
}

export enum JOB_TYPE {
  MPI = 'mpi',
  TENSORFLOW = 'tensorflow',
  PYTORCH = 'pytorch',
  DAG = 'dag',
  STREAMING = 'streaming',
  WEB_JOB = 'web-job',
}
