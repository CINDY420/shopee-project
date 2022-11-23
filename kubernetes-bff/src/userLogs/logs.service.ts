import { Injectable, HttpStatus, HttpException } from '@nestjs/common'

import { ESService } from 'common/modules/es/es.service'
import { AuthService } from 'common/modules/auth/auth.service'

import { parseFiltersMap } from 'common/helpers/filter'
import {
  getDayRangeList,
  getESQueryParams,
  getESTimeSortParams,
  getIndexOffsetRequestList,
  getTimeRangeParams
} from 'common/helpers/log'

import { AUDIT_RESOURCE_TYPE, OPERATION_SOURCE } from 'common/constants/auditResourceType'
import { ESIndex } from 'common/constants/es'

import { IListLogsResponse } from './dto/log.dto'
import { Logger } from 'common/helpers/logger'

const METHOD_LIST = ['GET', 'POST', 'PUT', 'DELETE', 'RPC_METHOD']

@Injectable()
export class UserLogsService {
  private readonly logger = new Logger(UserLogsService.name)

  constructor(private eSService: ESService, private authService: AuthService) {}

  async getUserOperationLogs(
    { filterBy, offset = 0, limit = 10, orderBy = 'time' },
    authToken: string
  ): Promise<IListLogsResponse> {
    const {
      group = [],
      tenant = [],
      objectType = [],
      operator = [],
      method = [],
      creationTimestamp = [],
      all = [],
      source = []
    } = parseFiltersMap(filterBy)
    const startTime = creationTimestamp[0] || ''
    const endTime = creationTimestamp[1] || ''
    let timeParams
    try {
      timeParams = getTimeRangeParams(startTime, endTime, 30)
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    }
    const { from, to } = timeParams

    const { total, logs } = await this.getUserLogFromEs({
      from,
      to,
      all,
      operator,
      group,
      tenant,
      objectType,
      method,
      source,
      limit,
      offset,
      orderBy
    })

    const allTenants = await this.authService.getAllTenants(authToken)
    const { tenants: tenantList = [] } = allTenants
    const tenants = tenantList.map((tenantInfo) => tenantInfo.name)

    return {
      logs,
      totalCount: total,
      tenants: ['Global', ...tenants],
      methods: METHOD_LIST,
      objectTypes: Object.values(AUDIT_RESOURCE_TYPE),
      sources: Object.values(OPERATION_SOURCE)
    }
  }

  async getUserLogFromEs({
    all,
    from,
    to,
    operator,
    group,
    tenant,
    objectType,
    method,
    source,
    limit,
    offset,
    orderBy
  }) {
    const dayRangeList = getDayRangeList(from, to)
    const isDescOrder = orderBy.includes('desc')
    let totalCount = 0

    const esCountList = await Promise.all(
      dayRangeList.map(async ({ day, start, end }) => {
        try {
          const total = await this.eSService.count(
            `${ESIndex.USER_LOG}-${day}` as ESIndex,
            getESQueryParams({ all, operator, group, tenant, objectType, method, source, start, end })
          )
          totalCount += total
          return {
            total,
            day,
            start,
            end
          }
        } catch (err) {
          return {
            err,
            total: 0,
            day,
            start,
            end
          }
        }
      })
    )

    const requestList = getIndexOffsetRequestList({ esCountList, limit, offset, isDescOrder })
    const logsList = await Promise.all(
      requestList.map(async ({ day, offset, limit, start, end }) => {
        try {
          const { documents = [] } = await this.eSService.booleanQueryAll(
            `${ESIndex.USER_LOG}-${day}` as ESIndex,
            getESQueryParams({ all, operator, group, tenant, objectType, method, source, start, end }),
            limit,
            offset,
            getESTimeSortParams(isDescOrder)
          )
          return documents
        } catch (err) {
          console.error(err)
          return []
        }
      })
    )

    const logs = []
    logsList.forEach((logList) => {
      logList.forEach((log) => {
        const {
          name = '',
          group = '',
          tenant = '',
          source = OPERATION_SOURCE.BFF, // The source value of old logs before v1.10 are all 'Bff'
          object,
          requestMethod,
          requestPath,
          responseCode,
          requestQuery,
          requestBody
        } = log || {}
        logs.push({
          operator: name,
          group,
          tenant: tenant,
          objectType: object,
          method: requestMethod,
          source,
          time: log['@timestamp'],
          detail: `${requestPath} ${responseCode} ${requestQuery} ${requestBody}`
        })
      })
    })

    return {
      total: totalCount,
      logs
    }
  }
}
