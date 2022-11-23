import * as moment from 'moment'

export const dateFormat = 'yyyy-MM-DD HH:mm:ss'
const utcTimeFormat = 'yyyy-MM-DDTHH:mm:ss.SSSZ'
const dayFormat = 'YYYY-MM-DD'

export interface ITimeRange {
  from: string
  to: string
}

export const getTimeRangeParams = (startTime: string, endTime: string, defaultRange: number): ITimeRange => {
  let from: string
  let to: string

  if (!startTime && !endTime) {
    to = moment().format(dateFormat)
    from = moment().subtract(defaultRange, 'd').format(dateFormat)
  } else if (!startTime) {
    to = moment(endTime).format(dateFormat)
    from = moment(endTime).subtract(defaultRange, 'd').format(dateFormat)
  } else if (!endTime) {
    to = moment().format(dateFormat)
    from = moment(startTime).format(dateFormat)
  } else {
    to = moment(endTime).format(dateFormat)
    from = moment(startTime).format(dateFormat)
  }

  if (from > to) {
    throw Error('Request time is Invalid')
  }

  return {
    from,
    to
  }
}

export const getDayRangeList = (from: string, to: string) => {
  const list = []
  let beginDay = moment(from).format(dayFormat)
  const endDay = moment(to).format(dayFormat)

  const beginTime = moment(from).format(utcTimeFormat)
  const endTime = moment(to).format(utcTimeFormat)

  if (beginDay === endDay) {
    list.push({
      day: beginDay,
      start: beginTime,
      end: endTime
    })
  } else if (moment(beginDay).add(1, 'd').format(dayFormat) === endDay) {
    list.push(
      {
        day: beginDay,
        start: beginTime
      },
      {
        day: endDay,
        end: endTime
      }
    )
  } else {
    list.push({
      day: beginDay,
      start: beginTime
    })

    beginDay = moment(beginDay).add(1, 'd').format(dayFormat)
    while (beginDay <= endDay) {
      list.push({ day: beginDay })
      beginDay = moment(beginDay).add(1, 'd').format(dayFormat)
    }
  }
  return list
}
