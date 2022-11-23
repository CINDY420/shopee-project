export enum JOB_STATUS {
  ALL = 'All',
  PENDING = 'Pending',
  RUNNING = 'Running',
  COMPLETED = 'Completed',
  SUCCEEDED = 'Succeeded',
  FAILED = 'Failed',
  KILLED = 'Killed',
  UNKNOWN = 'Unknown',
  UPDATING = 'Updating',
  UPDATED = 'UPDATED',
  QUEUING = 'Queuing',
}

interface IColors {
  color: string
  backgroundcolor: string
  bordercolor: string
}

interface IStatusColorsMap {
  [key: string]: IColors
}

export const STATUS_COLORS_MAP: IStatusColorsMap = {
  [JOB_STATUS.PENDING]: {
    color: '#722ED1',
    backgroundcolor: '#F9F0FF',
    bordercolor: '#D3ADF7',
  },
  [JOB_STATUS.QUEUING]: {
    color: '#262626',
    backgroundcolor: '#FAFAFA',
    bordercolor: '#D9D9D9',
  },
  [JOB_STATUS.RUNNING]: {
    color: '#1890FF',
    backgroundcolor: '#E6F7FF',
    bordercolor: '#91D5FF',
  },
  [JOB_STATUS.COMPLETED]: {
    color: '#52C41A',
    backgroundcolor: '#F6FFED',
    bordercolor: '#B7EB8F',
  },
  [JOB_STATUS.SUCCEEDED]: {
    color: '#52C41A',
    backgroundcolor: '#F6FFED',
    bordercolor: '#B7EB8F',
  },
  [JOB_STATUS.FAILED]: {
    color: '#EB2F96',
    backgroundcolor: '#FFF0F6',
    bordercolor: '#FFADD2',
  },
  [JOB_STATUS.KILLED]: {
    color: '#FAAD14',
    backgroundcolor: '#FFFBE6',
    bordercolor: '#FFE58F',
  },
  [JOB_STATUS.UNKNOWN]: {
    color: '#FAAD14',
    backgroundcolor: '#FFFBE6',
    bordercolor: '#FFE58F',
  },
  [JOB_STATUS.UPDATING]: {
    color: '#1890FF',
    backgroundcolor: '#E6F7FF',
    bordercolor: '#91D5FF',
  },
  [JOB_STATUS.UPDATED]: {
    color: '#52C41A',
    backgroundcolor: '#F6FFED',
    bordercolor: '#B7EB8F',
  },
}
