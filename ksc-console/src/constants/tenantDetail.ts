// compatibility tenant cmdb name
export const TENANT_MAP = {
  rcmdplt: 'shopeevideo-shopeevideo-intelligence',
}

export const TENANT_QUOTA_MAPS = [
  {
    key: 'usage',
    quotaName: 'Used',
    unit: 'Cores',
    backgroundcolor: '#2673DD',
  },
  {
    key: 'assigned',
    quotaName: 'Assigned',
    unit: 'Cores',
    backgroundcolor: '#CFE9FF',
  },
  {
    key: 'quota',
    quotaName: 'Quota',
    unit: 'Cores',
    backgroundcolor: '#F6F6F6',
  },
]

export interface IUsageTypeProps {
  type: string
  title: string
  unit: string
  colors: Record<string, string>
}

export const USAGE_TYPES: IUsageTypeProps[] = [
  {
    type: 'cpu',
    title: 'CPU Usage',
    unit: 'Cores',
    colors: {
      usage: '#2673DD',
      assigned: '#A6D4FF',
      quota: '#F0F9FF',
    },
  },
  {
    type: 'memory',
    title: 'Memory Usage',
    unit: 'GiB',
    colors: {
      usage: '#FA541C',
      assigned: '#FFBB96',
      quota: '#FFF2E8',
    },
  },
]
