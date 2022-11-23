import moment from 'moment-timezone'

// Refer to https://momentjs.com/docs/#/displaying/
const DEFAULT_MOMENT_FORMAT = 'YYYY/MM/DD HH:mm:ss'

export const timestampToLocalTime = (
  timestamp: number | string,
  displayFormat = DEFAULT_MOMENT_FORMAT,
): string => moment(timestamp).format(displayFormat)
