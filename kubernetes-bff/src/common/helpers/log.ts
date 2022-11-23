import * as moment from 'moment'
import { esRegexpSearchBuilder } from 'common/helpers/esQueryParamBuilder'
import { OPERATION_SOURCE } from 'common/constants/auditResourceType'
import { IEsBooleanQuery } from 'common/interfaces/config.interface'

const dateFormat = 'yyyy-MM-DD HH:mm:ss'
const utcTimeFormat = 'yyyy-MM-DDTHH:mm:ss.SSSZ'
const dayFormat = 'YYYY-MM-DD'

export const getIndexOffsetRequestList = ({ esCountList, limit = 10, offset = 0, isDescOrder }) => {
  // sort esCountList
  esCountList.sort((a, b) => {
    if (isDescOrder) {
      return a.day > b.day ? -1 : 1
    }
    return a.day < b.day ? -1 : 1
  })

  let begin = Number(offset)
  const end = Number(offset) + Number(limit)
  const requestList = []

  let preEnd = 0
  for (const item of esCountList) {
    if (item.total === 0) {
      continue
    }

    const indexBegin = preEnd
    const indexEnd = preEnd + item.total
    preEnd = indexEnd

    if (end <= indexEnd) {
      requestList.push({
        ...item,
        offset: begin - indexBegin,
        limit: end - begin
      })
      break
    } else if (begin >= indexEnd) {
      continue
    } else {
      requestList.push({
        ...item,
        offset: begin - indexBegin,
        limit: end < indexEnd ? end - begin : indexEnd - begin
      })

      begin = indexEnd
    }
  }
  return requestList
}

export const getESTimeSortParams = (isDescOrder: boolean): string[] => {
  const order = isDescOrder ? 'desc' : 'asc'
  return [`@timestamp:${order}`]
}

export const getTimeRangeParams = (startTime: string, endTime: string, defaultRange: number) => {
  let from
  let to

  if (!startTime && !endTime) {
    to = moment().format(utcTimeFormat)
    from = moment().subtract(defaultRange, 'd').format(utcTimeFormat)
  } else if (!startTime) {
    to = moment(endTime).utc().format(utcTimeFormat)
    from = moment(endTime).utc().subtract(defaultRange, 'd').format(utcTimeFormat)
  } else if (!endTime) {
    to = moment().format(utcTimeFormat)
    from = moment(startTime).utc().format(utcTimeFormat)
  } else {
    to = moment(endTime).utc().format(utcTimeFormat)
    from = moment(startTime).utc().format(utcTimeFormat)
  }

  if (from > to) {
    throw Error('Request time is Invalid')
  }

  return {
    from,
    to
  }
}

export const getESQueryParams = ({
  all,
  operator,
  group,
  tenant,
  objectType,
  method,
  source,
  start,
  end
}: {
  all: string[]
  operator: string[]
  tenant: string[]
  group: string[]
  objectType: string[]
  method: string[]
  source: string[]
  start?: string
  end?: string
}) => {
  const queryParams: IEsBooleanQuery = { must: [], should: [], mustNot: [] }
  operator.length &&
    queryParams.must.push(
      operator.map((item) => ({
        regexp: {
          name: esRegexpSearchBuilder(item)
        }
      }))
    )
  group.length &&
    queryParams.must.push({
      terms: {
        group
      }
    })
  tenant.length &&
    queryParams.must.push({
      terms: {
        tenant
      }
    })
  objectType.length &&
    queryParams.must.push({
      terms: {
        object: objectType
      }
    })
  method.length &&
    queryParams.must.push({
      match: {
        requestMethod: method.join('|')
      }
    })

  if (source.length) {
    if (source.includes(OPERATION_SOURCE.BFF)) {
      // Reverse "search" search condition, because the operation logs before v1.10 are all 'Bff' which have no 'source' key
      const sourceOptionList = Object.values(OPERATION_SOURCE)
      const excludedSourceOptions = sourceOptionList.filter((allSourcesItem) => !source.includes(allSourcesItem))
      queryParams.mustNot.push({
        terms: {
          source: excludedSourceOptions
        }
      })
    } else {
      queryParams.must.push({
        terms: {
          source
        }
      })
    }
  }

  if (all.length) {
    const searchAllRegExp = esRegexpSearchBuilder(all[0])
    queryParams.should = [
      'email',
      'name',
      'tenant',
      'requestPath',
      'object',
      'source',
      'requestMethod',
      'requestQuery',
      'requestHeader',
      'requestBody',
      'responseCode'
    ].map((key) => ({
      regexp: {
        [key]: searchAllRegExp
      }
    }))
    queryParams.minimumShouldMatch = 1
  }

  if (start || end) {
    queryParams.filter = {
      range: {
        '@timestamp': {
          gte: start,
          lte: end
        }
      }
    }
  }

  return queryParams
}

export const getDayRangeList = (from: string, to: string) => {
  const list = []
  let beginDay = moment(from).format(dayFormat)
  let endDay = moment(to).format(dayFormat)

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

    beginDay = moment(beginDay).add(1, 'd').format(dayFormat)
    endDay = moment(endDay).subtract(1, 'd').format(dayFormat)
    while (beginDay <= endDay) {
      list.push({ day: beginDay })
      beginDay = moment(beginDay).add(1, 'd').format(dayFormat)
    }
  }
  return list
}
