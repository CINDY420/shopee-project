export enum AUTOSCALING_METRIC_TYPE {
  AVERAGE_CPU = 'averageCpu',
  AVERAGE_MEM = 'averageMemory',
  INSTANT_CPU = 'instantCpu',
  INSTANT_MEM = 'instantMemory',
}

export enum METRIC_TYPE {
  CPU = 'cpu',
  MEMORY = 'memory',
}

export enum HPA_TRIGGER_LOGIC {
  OR = 'or',
  AND = 'and',
}

export enum TRIGGER_RULE_TYPE {
  AUTOSCALING = 'autoscaling',
  CRON = 'cron',
  UTILIZATION = 'utilization',
}

export enum HPA_STATUS {
  ENABLE = 1,
  DISABLE = 0,
}

export enum HPA_CRON_RULE_REPEAT_TYPE {
  ONCE = 'Once',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
}

export enum HPA_CRON_RULE_WEEK_DAY {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

export enum HPA_SCALE_POLICY_TYPE {
  PERCENT = 'Percent',
  PODS = 'Pods',
}

export enum HPA_SELECT_POLICY_TYPE {
  MAX = 'Max',
  MIN = 'Min',
}
