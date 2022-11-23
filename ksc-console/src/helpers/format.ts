import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
// dependent on utc plugin
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const UTC_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const formatLocalTimeToUTC = (timestamp: number) => {
  const localTimezone = dayjs.tz.guess()
  const utcTime = dayjs.tz(timestamp, localTimezone).utc().format(UTC_TIME_FORMAT)
  return utcTime
}

export const formatUnixTime = (timestamp: number) => {
  if (!timestamp) return '--'
  return dayjs.unix(timestamp).format(TIME_FORMAT)
}

export const generateUnixTimestamp = (date: Date | null) => dayjs(date || new Date()).unix()

export const upperCaseFirstCharacter = (str: string): string => {
  if (!str) return ''

  return str.replace(/^\S/, (s) => s.toUpperCase())
}

export const lowerCaseString = (str: string): string => {
  if (!str) return ''

  return str.replace(/\S/g, (s) => s.toLocaleLowerCase())
}

export const getNumFromString = (str: string): string => {
  if (!str) return '0'
  return str.replace(/[^\d.]/g, '')
}

export const addUnitOfMemory = (memory: string) =>
  `${memory}`.indexOf('Gi') === -1 ? `${memory}Gi` : memory

export const removeUnitOfMemory = (memory: string) =>
  `${memory}`.indexOf('Gi') === -1 ? memory : memory.replace('Gi', '')
