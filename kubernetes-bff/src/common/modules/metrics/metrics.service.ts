import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosRequestConfig } from 'axios'

import { IMetricsConfig } from 'common/interfaces'
import { MetricsException } from 'common/errors/metrics.exception'
import { HTTPS_AGENT, HTTP_AGENT } from 'common/constants/http'
import { Logger } from 'common/helpers/logger'

export interface ISimplePod {
  name: string
  namespace: string
}

/**
 * filed对应的metric如下：
 * ```
 * | limit | cpu_limit_core|memory_limit_bytes  |
 * | cpu_usage | base_pod_cpu_usage |
 * | memory_usage | base_pod_memory_usage |
 * | memory_rss | container_memory_rss |
 * | filesystem_cpu_usage | pod_filesystem_usage_bytes |
 * ```
 */
export type IPodMetricsField = 'limit' | 'cpu_usage' | 'memory_usage' | 'memory_rss' | 'filesystem_cpu_usage'

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name)

  metricsServerUrlPrefix: string

  constructor(private configService: ConfigService) {
    const agentConfig = this.configService.get<IMetricsConfig>('metrics')
    const { protocol, host, port } = agentConfig
    this.metricsServerUrlPrefix = `${protocol}://${host}${port ? `:${port}` : ''}`
  }

  async request<T>(route: string, token: string, configs: AxiosRequestConfig = { method: 'GET' }): Promise<T> {
    const url = `${this.metricsServerUrlPrefix}${route}`
    const base64Token = Buffer.from(token).toString('base64')

    try {
      const result = await axios(url, {
        headers: {
          token: base64Token,
          ...configs.headers
        },
        ...configs,
        timeout: 10000,
        httpsAgent: HTTPS_AGENT,
        httpAgent: HTTP_AGENT
      })

      return result.data
    } catch (e) {
      if (e.code) {
        const { code, message } = e
        this.logger.error(`Url: ${url}, Error code: ${code}, Error message: ${message}`)
        throw new MetricsException(code, message)
      }

      this.logger.error(`Url: ${url}, Error: ${e}`)
      throw e
    }
  }

  async getPodsMetrics<T>(token: string, pods: ISimplePod[], field: IPodMetricsField[]) {
    const url = '/api/v2/namespaces/pods/status'
    const metrics = await this.request<T>(url, token, {
      data: {
        pods,
        field
      },
      method: 'POST'
    })
    return metrics
  }
}
