import { formatUnixTime } from 'helpers/format'

export enum TIME_UNITS {
  MINUTES = 'Minutes',
  HOURS = 'Hours',
  DAYS = 'Days',
}

export const TIME_UNIT_LISTS = [TIME_UNITS.MINUTES, TIME_UNITS.HOURS, TIME_UNITS.DAYS]

export const JOB_TYPES = [
  {
    value: 'mpi',
    name: 'MPI',
  },
  {
    value: 'dag',
    name: 'Dag',
  },
  {
    value: 'streaming',
    name: 'Streaming',
  },
  {
    value: 'tensorflow',
    name: 'Tensorflow',
  },
  {
    value: 'pytorch',
    name: 'Pytorch',
  },
]
export const INSTANCE_TIMEOUT_POLICY = [
  {
    value: 'wait',
    name: 'Wait for previous instance complete',
  },
  {
    value: 'kill',
    name: 'Kill previous instance',
  },
  {
    value: 'ignore',
    name: 'Continue normal operation',
  },
]

export const BASIC_INFORMATION = [
  { displayName: 'Job Name', formNamePath: 'periodicJobName' },
  { displayName: 'Status', formNamePath: 'enable' },
  { displayName: 'Priority', formNamePath: ['jobTemplate', 'priority'] },
  { displayName: 'Cron', formNamePath: 'period' },
  { displayName: 'Running Timeout', formNamePath: 'runningOvertime' },
  { displayName: 'Pending Timeout', formNamePath: 'pendingOvertime' },
  { displayName: 'Notification', formNamePath: 'supportNotify' },
  { displayName: 'Instance Timeout', formNamePath: 'instanceTimeoutPolicy' },
  { displayName: 'Parameters', formNamePath: ['jobTemplate', 'parameters'] },
]
export const WORKSFLOW = [
  { displayName: 'Type', formNamePath: ['jobTemplate', 'jobType'] },
  { displayName: 'Share Dir', formNamePath: ['jobTemplate', 'shareDir'] },
]
export const INSTANCE_BASIC_INFORMATION_BASICS = [
  { name: 'Job Name', key: 'periodicJobName' },
  { name: 'Job ID', key: 'periodicJobId' },
  { name: 'Status', key: 'enable' },
  { name: 'Priority', key: 'priority' },
  { name: 'Cron', key: 'period' },
  { name: 'Notification', key: 'supportNotify' },
  {
    name: 'Instance Timeout',
    key: 'instanceTimeoutPolicy',
    format: (value: string) => INSTANCE_TIMEOUT_POLICY.find((item) => item.value === value)?.name,
  },
  { name: 'Create Time', key: 'createAt', format: (value: number) => formatUnixTime(value) },
  { name: 'Created By', key: 'creator' },
]
export const INSTANCE_BASIC_INFORMATION_WORKFLOW = [
  { name: 'Type', key: 'jobType' },
  { name: 'Share Dir', key: 'shareDir' },
]
export const INSTANCE_BASIC_INFORMATION_TASK = [
  { name: 'Task Name', key: 'taskName' },
  { name: 'Replica', key: 'replicas' },
  { name: 'Pod Retry Limit', key: 'retryLimit' },
  { name: 'Container', key: 'container' },
]
