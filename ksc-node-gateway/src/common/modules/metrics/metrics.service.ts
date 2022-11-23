import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { constants as HTTP_CONSTANTS } from 'http2'

import { Http, extractResponseErrorMessage } from '@/common/utils/http'
import { IMetricsConfig } from '@/common/interfaces/config.interface'
import { IRequestParams } from '@/common/interfaces/http.interface'
import { Logger } from '@/common/utils/logger'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'

import {
  GetTenantMetricsQuery,
  GetProjectMetricsQuery,
  GetTenantMetricsResponse,
  GetProjectMetricsResponse,
  GetClusterMetricsQuery,
  GetClusterMetricsResponse,
} from '@/common/dtos/metrics/metric.dto'

@Injectable()
export class MetricsService {
  private clusterName: string
  constructor(private configService: ConfigService, public readonly http: Http, private readonly logger: Logger) {
    this.logger.setContext(MetricsService.name)

    const metricsConfig = this.configService.get<IMetricsConfig>('metrics')
    const { protocol, host, port, prefix, clusterName } = metricsConfig || {}
    const serverUrl = `${protocol}://${host}${port ? `:${port}` : ''}`
    const serverUrlPrefix = prefix ? `${serverUrl}/${prefix}` : serverUrl
    const serverUrlPrefixVersion = `${serverUrlPrefix}/v1`

    this.clusterName = clusterName || ''

    this.http.setServerConfiguration({
      serverName: MetricsService.name,
      baseUrl: serverUrlPrefixVersion,
    })
  }

  private async request<
    TResponseBody = unknown,
    TRequestParams = URLSearchParams,
    TRequestBody = Record<string, unknown>,
  >(requestParams: IRequestParams<TRequestParams, TRequestBody>): Promise<TResponseBody> {
    const { method, body, query, resourceURI, headers: incomingHeaders } = requestParams
    const metricsConfig = this.configService.get<IMetricsConfig>('metrics')
    const { token } = metricsConfig || {}
    const tokenHeader = token ? { [HTTP_CONSTANTS.HTTP2_HEADER_AUTHORIZATION]: token } : {}
    const headers = {
      [HTTP_CONSTANTS.HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
      ...tokenHeader,
      ...incomingHeaders,
    }

    const [result, error] = await this.http.request<TResponseBody>({
      url: resourceURI,
      method,
      searchParams: query ?? {},
      headers,
      json: body,
    })

    if (error || !result) {
      const errorStatus = error?.response?.statusCode
      const errorBody = error?.response?.body
      const errorMessage = extractResponseErrorMessage(errorBody, 'message')

      throwError(
        {
          ...ERROR.REMOTE_SERVICE_ERROR.KSC_METRICS_ERROR.UNKNOWN_ERROR,
          status: errorStatus ?? HttpStatus.SERVICE_UNAVAILABLE,
        },
        errorMessage,
      )
    }

    return result
  }

  public getClusterMetrics(clusterId: string) {
    return this.request<GetClusterMetricsResponse, GetClusterMetricsQuery, never>({
      method: 'GET',
      resourceURI: `/clusters/${clusterId}`,
      query: {
        clusterName: this.clusterName,
      },
    })
  }

  public getTenantMetrics(tenantName: string, getTenantMetricsQuery: GetTenantMetricsQuery) {
    // TODO: tiancheng.zhang /For now, openApi need fixed clusterName. Improve in next version
    if (this.clusterName) {
      getTenantMetricsQuery.clusterName = this.clusterName
    }
    return this.request<GetTenantMetricsResponse, GetTenantMetricsQuery, never>({
      method: 'GET',
      resourceURI: `/tenants/${tenantName}`,
      query: getTenantMetricsQuery,
    })
  }

  public getProjectMetrics(tenantName: string, projectName: string, getProjectMetricsQuery: GetProjectMetricsQuery) {
    // TODO: tiancheng.zhang /For now, openApi need fixed clusterName. Improve in next version
    if (this.clusterName) {
      getProjectMetricsQuery.clusterName = this.clusterName
    }
    return this.request<GetProjectMetricsResponse, GetProjectMetricsQuery, never>({
      method: 'GET',
      resourceURI: `/tenants/${tenantName}/projects/${projectName}`,
      query: getProjectMetricsQuery,
    })
  }
}
