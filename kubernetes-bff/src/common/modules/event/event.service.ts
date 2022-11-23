import { Injectable, HttpStatus, HttpException, InternalServerErrorException } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ESService } from 'common/modules/es/es.service'

import { getTimeRangeParams, getDayRangeList, ITimeRange } from 'common/helpers/event'

import { ES_EVENT_DURATION_DAY, IPRegExp } from 'common/constants/event'
import { IEsBooleanQuery } from 'common/interfaces'
import { ESIndex, ES_DEFAULT_COUNT, ES_DEFAULT_OFFSET } from 'common/constants/es'

import { esRegexpSearchBuilder } from 'common/helpers/esQueryParamBuilder'
import { Logger } from 'common/helpers/logger'

interface IEsEventQuery {
  cluster?: string[]
  project?: string[]
  application?: string[]
  name?: string[]
  namespace?: string[]
  kind?: string[]
  reason?: string[]
  message?: string[]
  createtime?: string[]
  hostip?: string[]
  podip?: string[]
}

interface IGetEvents {
  startTime: string
  endTime: string
  query: IEsEventQuery
  searchAll?: string[]
  offset?: number
  limit?: number
  isCreateTimeDesc?: boolean
  projectName?: string
  appName?: string
  podName?: string
}

interface IGetFirstEvent {
  startTime: string
  endTime: string
  query: IEsEventQuery
  searchAll?: string[]
  isCreateTimeDesc?: boolean
  projectName?: string
  appName?: string
  podName?: string
}

interface IGenerateBooleanQuery {
  searchAll: string
  searchAllKeys: string[]
  projectName: string
  appName: string
  podName: string
  kind: string[]
  cluster: string[]
  name: string
  namespace: string
  reason?: string[]
}

export class IESEvent {
  @ApiProperty()
  cluster: string

  @ApiProperty()
  project: string

  @ApiProperty()
  application: string

  @ApiProperty()
  name: string

  @ApiProperty()
  namespace: string

  @ApiProperty()
  kind: string

  @ApiProperty()
  reason: string

  @ApiProperty()
  message: string

  @ApiProperty()
  createtime: string

  @ApiProperty()
  detail?: string

  @ApiProperty()
  hostip: string

  @ApiProperty()
  podip: string
}

export class IEvent {
  @ApiProperty()
  name: string

  @ApiProperty()
  namespace: string

  @ApiProperty()
  kind: string

  @ApiProperty()
  reason: string

  @ApiProperty()
  message: string

  @ApiPropertyOptional()
  hostip: string

  @ApiPropertyOptional()
  podip: string

  @ApiProperty()
  creationTimestamp: string
}

interface IEvents {
  eventList: IESEvent[]
  totalCount: number
}

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name)

  constructor(private esService: ESService) {}

  async getEvents({
    startTime,
    endTime,
    query,
    searchAll = [],
    offset,
    limit,
    isCreateTimeDesc,
    projectName,
    appName,
    podName
  }: IGetEvents) {
    const rangeDayIndexList = this.generateEventIndexList(startTime, endTime)
    // Reorder the index by time desc
    rangeDayIndexList.reverse()

    const { name = [], namespace = [], kind = [], cluster = [], reason = [] } = query

    const booleanQuery = this.generateBooleanQuery({
      searchAll: searchAll.length ? searchAll[0] : undefined,
      searchAllKeys: ['name', 'namespace', 'message', 'reason', 'kind'],
      projectName,
      appName,
      podName,
      kind,
      cluster,
      name: name.length ? name[0] : undefined,
      namespace: namespace.length ? namespace[0] : undefined,
      reason
    })

    // Get event list
    const { eventList, totalCount } = await this.searchEventForOrderedDateIndexList(
      rangeDayIndexList as ESIndex[],
      booleanQuery,
      limit,
      offset,
      isCreateTimeDesc
    )

    const kindList = await this.getKindListForIndexList(rangeDayIndexList)

    return { totalCount, eventList, kindList }
  }

  async getFirstEvent({
    startTime,
    endTime,
    query,
    searchAll = [],
    isCreateTimeDesc,
    projectName,
    appName,
    podName
  }: IGetFirstEvent): Promise<IESEvent> {
    const rangeDayIndexList = this.generateEventIndexList(startTime, endTime)
    // Reorder the index by time desc
    rangeDayIndexList.reverse()
    const { name = [], namespace = [], kind = [], cluster = [], reason = [] } = query

    const booleanQuery = this.generateBooleanQuery({
      searchAll: searchAll.length ? searchAll[0] : undefined,
      searchAllKeys: ['name', 'namespace', 'message', 'reason', 'kind'],
      projectName,
      appName,
      podName,
      kind,
      cluster,
      name: name.length ? name[0] : undefined,
      namespace: namespace.length ? namespace[0] : undefined,
      reason
    })
    const sort = []
    if (isCreateTimeDesc === true) {
      sort.push('updatetime:desc')
    }

    if (isCreateTimeDesc === false) {
      sort.push('updatetime:asc')
    }
    for (let i = 0; i < rangeDayIndexList.length; i++) {
      const currentDayIndex = rangeDayIndexList[i]
      try {
        const event = await this.esService.booleanQueryFirst<IESEvent>(
          currentDayIndex as ESIndex,
          booleanQuery,
          undefined,
          sort
        )
        if (event) {
          return event
        }
      } catch (err) {
        throw new InternalServerErrorException(`Search ES index ${currentDayIndex} err: ${err}`)
      }
    }
    return null
  }

  private generateEventIndexList(startTime: string, endTime: string): string[] {
    let timeParams: ITimeRange
    try {
      timeParams = getTimeRangeParams(startTime, endTime, ES_EVENT_DURATION_DAY)
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    }
    const { from, to } = timeParams

    const dayRangeList = getDayRangeList(from, to)
    const dayIndexList = dayRangeList.map(({ day }) => `${ESIndex.EVENT}-${day}`)
    return dayIndexList
  }

  generateBooleanQuery({
    searchAll,
    searchAllKeys,
    projectName,
    appName,
    podName,
    kind,
    cluster,
    name,
    namespace,
    reason
  }: IGenerateBooleanQuery): IEsBooleanQuery {
    const booleanQuery: IEsBooleanQuery = {
      should: [],
      must: []
    }

    // 全局搜索
    // should regexp
    if (searchAll) {
      const isIP = IPRegExp.test(searchAll)
      const searchAllItems = searchAll.split(' ')
      const validItems = searchAllItems.filter((item) => item.length > 0)
      const isText = validItems.length > 1
      if (isIP) {
        const searchAllRegExp = esRegexpSearchBuilder(searchAll)
        booleanQuery.should = ['message', 'hostip', 'podip'].map((key) => ({
          regexp: {
            [key]: searchAllRegExp
          }
        }))
      } else if (isText) {
        booleanQuery.should.push({
          match_phrase: {
            message: {
              query: searchAll
            }
          }
        })
      } else {
        const searchAllRegExp = esRegexpSearchBuilder(searchAll)
        booleanQuery.should = searchAllKeys.map((key) => ({
          regexp: {
            [key]: searchAllRegExp
          }
        }))
      }
      booleanQuery.minimumShouldMatch = 1
    }

    // 精准搜索
    // must term
    if (projectName) {
      booleanQuery.must.push({
        term: { project: projectName }
      })
    }
    if (appName) {
      booleanQuery.must.push({
        term: { application: appName }
      })
    }
    if (cluster.length) {
      booleanQuery.must.push({
        terms: { cluster }
      })
    }
    if (kind.length) {
      booleanQuery.must.push({
        terms: { kind }
      })
    }

    if (reason.length) {
      booleanQuery.must.push({
        terms: { reason }
      })
    }

    // 正则匹配匹配
    // must regexp
    if (podName) {
      booleanQuery.must.push({
        regexp: { name: esRegexpSearchBuilder(podName) }
      })
    } else if (name) {
      booleanQuery.must.push({
        regexp: {
          name: esRegexpSearchBuilder(name)
        }
      })
    }
    if (namespace) {
      booleanQuery.must.push({
        regexp: {
          namespace: esRegexpSearchBuilder(namespace)
        }
      })
    }

    return booleanQuery
  }

  /**
   * paginated data in orderedDateIndexList
   * @param orderedDateIndexList from now to before
   * @desc if true, search data created from now to before
   */
  async searchEventForOrderedDateIndexList(
    orderedDateIndexList: ESIndex[],
    query: IEsBooleanQuery,
    size: number = ES_DEFAULT_COUNT,
    from: number = ES_DEFAULT_OFFSET,
    isCreateTimeDesc?: boolean
  ): Promise<IEvents> {
    if (isCreateTimeDesc === false) {
      orderedDateIndexList.reverse()
    }

    // Get the events
    const sort = []
    if (isCreateTimeDesc === true) {
      sort.push('createtime:desc')
    }

    if (isCreateTimeDesc === false) {
      sort.push('createtime:asc')
    }
    const { eventList, totalCount } = await this.getEventsForOrderedDateIndexList(
      orderedDateIndexList,
      query,
      size,
      from,
      sort
    )

    return { eventList, totalCount }
  }

  private async getKindListForIndexList(indexList): Promise<string[]> {
    const kindList = []
    await Promise.all(
      indexList.map(async (index) => {
        try {
          const { buckets } = await this.esService.aggregate(index, 'kind')

          buckets.forEach((element) => {
            const { key } = element
            if (!kindList.includes(key)) {
              kindList.push(key)
            }
          })
        } catch (err) {
          // Ignore 404 error
          if (!err.statusCode || (err.statusCode && err.statusCode !== 404)) {
            this.logger.error(`Get index ${index} kind error: ${err}`)
          }
        }
      })
    )

    kindList.sort()

    return kindList
  }

  private async getEventsForOrderedDateIndexList(orderedDateIndexList, query, size, from, sort): Promise<IEvents> {
    let eventList: IESEvent[] = []
    let totalCount = 0
    let isDataEnough = true
    for (let i = 0; i < orderedDateIndexList.length; i++) {
      const restSize = size - eventList.length
      const currentDateIndex = orderedDateIndexList[i]
      try {
        const total = await this.esService.count(currentDateIndex, query)
        totalCount += total
        if (isDataEnough) {
          const { documents } = await this.esService.booleanQueryAll<IESEvent>(
            currentDateIndex,
            query,
            restSize,
            from,
            sort
          )
          if (total <= from) {
            from -= total
          } else {
            eventList = eventList.concat(documents)
            if (documents.length === restSize) {
              isDataEnough = false
              // break
            } else if (documents.length < restSize) {
              from = 0
            } else {
              this.logger.error(`The data.length ${eventList.length} is bigger than size ${size}`)
              throw new InternalServerErrorException()
            }
          }
        }
      } catch (err) {
        // Ignore 404 error
        if (!err.statusCode || (err.statusCode && err.statusCode !== 404)) {
          this.logger.error(`Get index ${currentDateIndex} event error: ${err}`)
        }
      }
    }

    return { eventList, totalCount }
  }
}
