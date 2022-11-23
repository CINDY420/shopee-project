export enum HPA_CRON_RULE_REPEAT_TYPE {
  WEEKLY = 'Weekly',
  DAILY = 'Daily',
  ONCE = 'Once'
}

export enum HPA_CRON_RULE_WEEK_DAY {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday'
}

export const hpaCronRuleWeekdayDisplayMap = {
  [HPA_CRON_RULE_WEEK_DAY.MONDAY]: 'Mon.',
  [HPA_CRON_RULE_WEEK_DAY.TUESDAY]: 'Tues.',
  [HPA_CRON_RULE_WEEK_DAY.WEDNESDAY]: 'Wed.',
  [HPA_CRON_RULE_WEEK_DAY.THURSDAY]: 'Thur.',
  [HPA_CRON_RULE_WEEK_DAY.FRIDAY]: 'Fri.',
  [HPA_CRON_RULE_WEEK_DAY.SATURDAY]: 'Sat.',
  [HPA_CRON_RULE_WEEK_DAY.SUNDAY]: 'Sun.'
}

export const ONCE_TYPE_TIME_FORM_FORMAT = 'MM-DD HH:mm'
export const ONCE_TYPE_TIME_API_FORMAT = 'YYYY-MM-DD HH:mm'
export const OTHER_TYPES_TIME_FORMAT = 'HH:mm'
