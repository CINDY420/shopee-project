import moment from 'moment-timezone'
const isNotExist = (data: any) => data === undefined

/**
 * format float number
 *
 * @param floatingNum float number
 * @param digits reserved decimal point count, defaults to 2
 * @example
 *   params:
 *     floatingNum: 0.0048376
 *     digits: 3
 *   result: 0.005
 */
export const formatFloat = (floatingNum: any, digits?: number) => {
  return isNotExist(floatingNum) ? '--' : parseFloat(parseFloat(floatingNum).toFixed(digits || 2))
}

/**
 * format byte data to Gib data
 * @param byteNum byte data
 * @param digits reserved decimal point count, defaults to 2
 */
export const formatDataFromByteToGib = (byteNum: number, digits?: number) => {
  if (isNotExist(byteNum)) {
    return '--'
  }
  const gib = byteNum / (1024 * 1024 * 1024)
  return formatFloat(gib, digits)
}

/**
 * format milliCore data to core data
 * @param byteNum milliCore data
 * @param digits reserved decimal point count, defaults to 2
 */
export const formatMilliCoreToCore = (milliCore: number, digits?: number) => {
  if (isNotExist(milliCore)) {
    return '--'
  }
  const core = milliCore / 1000
  return formatFloat(core, digits)
}

const supplementWithZero = (num: number, length: number) => {
  const numberStr = String(num)
  return numberStr.length < length ? '0'.repeat(length - numberStr.length) + num : num
}

/**
 * Format the timestamp as  ${year}-${month}-${date} ${hours}:${minutes}:${seconds}
 *
 * @param {number} t timestamp
 * @returns {string} ${year}-${month}-${date} ${hours}:${minutes}:${seconds}
 */
export const formatTime = (t: any) => {
  if (!t) {
    return '--'
  }

  const time = new Date(t)
  const year = time.getFullYear()
  const month = supplementWithZero(time.getMonth() + 1, 2)
  const date = supplementWithZero(time.getDate(), 2)
  const hours = supplementWithZero(time.getHours(), 2)
  const minutes = supplementWithZero(time.getMinutes(), 2)
  const seconds = supplementWithZero(time.getSeconds(), 2)
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}

/**
 * Format the timestamp as  ${hours}:${minutes}
 *
 * @param {number} t timestamp
 * @returns {string} ${hours}:${minutes}
 */
export const formatHourTime = (t: any) => {
  const time = new Date(t)

  const hours = supplementWithZero(time.getHours(), 2)
  const minutes = supplementWithZero(time.getMinutes(), 2)
  return `${hours}:${minutes}`
}

/**
 * Format decimal data to percent data
 *
 * @param decimalNumber float number
 * @param digits reserved decimal point count, defaults to 2
 */
export const formatDataFromDecimalToPercent = (decimalNumber: number, digits?: number) => {
  if (isNotExist(decimalNumber)) {
    return '--'
  }

  return parseFloat((decimalNumber * 100).toFixed(digits || 2))
}

export const trim = str => {
  if (typeof str === 'string') {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }
  return str
}

const utcTimeFormat = 'yyyy-MM-DDTHH:mm:ss.SSSZ'
export const localTimeToUTC = (timeString: string) => {
  const localTimezone = moment.tz.guess()
  const utcTime = moment
    .tz(timeString, localTimezone)
    .utc()
    .format(utcTimeFormat)
  return utcTime
}
