import moment from 'moment'

export const REFRESH_RATE = 5000
export const EDIT_REFRESH_RATE = 15000

export const DEFAULT_EVENT_DATE = moment(Date.now())
export const DEFAULT_EVENT_DATE_RANGE = [
  DEFAULT_EVENT_DATE.format('YYYY-MM-DD'),
  DEFAULT_EVENT_DATE.format('YYYY-MM-DD')
]

export const TODAY_ZERO_TIME = moment(new Date(new Date(new Date().getTime()).setHours(0, 0, 0, 0)).getTime())
export const DEFAULT_OPERATION_LOGS_RANGE = [
  TODAY_ZERO_TIME.format('YYYY-MM-DD HH:mm:ss'),
  DEFAULT_EVENT_DATE.format('YYYY-MM-DD HH:mm:ss')
]
