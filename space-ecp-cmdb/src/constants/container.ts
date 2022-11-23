import { AlertProps } from 'infrad'
interface INotice {
  type: AlertProps['type']
  description: string
}

export const STATUS = {
  RUNNING_HEALTHY: 'Running_Healthy',
  RUNNING_UNKNOWN: 'Running_Unknown',
  UNHEALTHY: 'Unhealthy',
  ABNORMAL: 'Abnormal',
  DEPLOYING: 'Deploying',
  STOPPED: 'Stopped',
  PAUSED: 'Paused',
  GAVEUP: 'Gaveup',
  CREATED: 'Created',
  FAILING: 'Failing',
  STOPPING: 'Stopping',
  UNKNOWN: 'Unknown',
}

export const STATUS_DISPLAY_NAME = {
  [STATUS.RUNNING_HEALTHY]: 'Running | Healthy',
  [STATUS.RUNNING_UNKNOWN]: 'Running | Unknown',
  [STATUS.UNHEALTHY]: 'Running | Unhealthy',
  [STATUS.ABNORMAL]: 'Abnormal',
  [STATUS.DEPLOYING]: 'Deploying',
  [STATUS.STOPPED]: 'Stopped',
  [STATUS.PAUSED]: 'Paused',
  [STATUS.GAVEUP]: 'Gaveup',
  [STATUS.CREATED]: 'Created',
  [STATUS.FAILING]: 'Failing',
  [STATUS.STOPPING]: 'Stopping',
  [STATUS.UNKNOWN]: 'Unknown',
}

// Sort by priority from high to low
export const STATUS_PRIORITY_MAP = [
  STATUS.STOPPED,
  STATUS.STOPPING,
  STATUS.DEPLOYING,
  STATUS.FAILING,
  STATUS.CREATED,
  STATUS.GAVEUP,
  STATUS.PAUSED,
  STATUS.UNKNOWN,
  STATUS.ABNORMAL,
  STATUS.UNHEALTHY,
  STATUS.RUNNING_UNKNOWN,
  STATUS.RUNNING_HEALTHY,
]

export const STATUS_TAG_COLOR = {
  [STATUS.RUNNING_HEALTHY]: 'green',
  [STATUS.RUNNING_UNKNOWN]: 'green',
  [STATUS.UNHEALTHY]: 'red',
  [STATUS.ABNORMAL]: 'red',
  [STATUS.DEPLOYING]: 'blue',
  [STATUS.STOPPED]: 'volcano',
  [STATUS.PAUSED]: 'gold',
  [STATUS.GAVEUP]: 'magenta',
  [STATUS.CREATED]: 'cyan',
  [STATUS.FAILING]: 'red',
  [STATUS.STOPPING]: 'orange',
  [STATUS.UNKNOWN]: 'default',
}

export enum SduActionTypes {
  RESTART = 'Restart',
  SUSPEND = 'Suspend',
  STOP = 'Stop',
}

export const SDU_ACTION_NOTICE: Record<string, INotice> = {
  [SduActionTypes.RESTART]: {
    type: 'info',
    description: 'Restart will not affect deploy config. The instance count will not be changed.',
  },
  [SduActionTypes.SUSPEND]: {
    type: 'info',
    description:
      'Suspend service by scaling down to 0. Deploy Config will be updated at the same time.',
  },
  [SduActionTypes.STOP]: {
    type: 'warning',
    description:
      'Stop the SDUs of Bromo by killing all tasks of all running deployments of that service.\n Stop the SDUs of ECP by scaling down all deployments of that service to 0 and delete all deployments.\n Deploy Config will be updated at the same time.',
  },
}
