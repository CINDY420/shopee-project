import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosRequestConfig } from 'axios'
import * as qs from 'qs'

import { IAgentConfig, ClusterConfig } from 'common/interfaces'
import { AgentException } from 'common/errors/agent.exception'
import { HTTPS_AGENT, HTTP_AGENT } from 'common/constants/http'
import { IControllerRevisionInfo, IItem } from 'applications-management/deployments/dto/deployment.dto'
import { PHASE } from 'common/constants/deployment'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { parseClusterId } from 'common/helpers/deployment'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name)

  agentConfig: IAgentConfig

  constructor(private configService: ConfigService, private clustersService: ClustersService) {
    const agentConfig = this.configService.get<IAgentConfig>('agent')
    this.agentConfig = agentConfig
  }

  private generateClusterAgentAddress(clusterName: string): string {
    const { protocol, host: hostPrefix, port } = this.agentConfig
    const agentHost = process.env.NODE_ENV === 'local' ? `${hostPrefix}${clusterName}` : `${hostPrefix}-${clusterName}`
    const clusterAgentAddress = `${protocol}://${agentHost}${port ? `:${port}` : ''}`
    return clusterAgentAddress
  }

  async request<T>(
    route: string,
    isFromCache = false,
    clusterToken: ClusterConfig,
    body: any = {},
    configs: AxiosRequestConfig = {},
    isStringifyData = true
  ): Promise<T> {
    const { clusterName, config: token } = clusterToken
    const clusterAgentAddress = this.generateClusterAgentAddress(clusterName)
    const url = `${clusterAgentAddress}/${isFromCache ? 'cache-api' : 'api'}/${route}`

    const data = isStringifyData
      ? qs.stringify({
          ...body,
          token
        })
      : {
          ...body,
          token: token
        }

    try {
      this.logger.log(`Request agent url: ${url}`)

      const result = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...configs.headers
        },
        ...configs,
        timeout: 10000,
        httpsAgent: HTTPS_AGENT,
        httpAgent: HTTP_AGENT
      })

      return result.data
    } catch (e) {
      if (e.response) {
        const { status, data } = e.response
        this.logger.error(`Url: ${url}, Error code: ${status}, Error message: ${data}`)
        throw new AgentException(status, e.message)
      }

      this.logger.error(`Url: ${url}, Error: ${e}`)
      throw e
    }
  }

  async getCR(clusterId: string, deployment: IItem, phase: PHASE) {
    const { clusterName } = parseClusterId(clusterId)
    const cluster = await this.clustersService.findByName(clusterName)
    const { namespace, name } = deployment.metadata
    const { currentRevision, updateRevision } = deployment.status
    const body = { namespace, cloneset: name }
    const crList: IControllerRevisionInfo = await this.request(
      'clonesetCR',
      true,
      { config: cluster.config, clusterName },
      body
    )
    const cr = crList.items.find(
      (item) => item.metadata.name === (phase === PHASE.RELEASE ? currentRevision : updateRevision)
    )
    return cr
  }
}
