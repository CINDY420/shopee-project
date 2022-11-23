import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as k8s from '@kubernetes/client-node'

import { KubeConfig } from '@kubernetes/client-node'
import * as yaml from 'js-yaml'
import { isObject } from 'class-validator'
import { IPromConfigData } from '@/shared/apiServer/apiServer.interface'

function isDrConfigMap(config: unknown): config is { promConfig: IPromConfigData[] } {
  if (!isObject(config)) {
    return false
  }

  return 'promConfig' in config
}

@Injectable()
export class ApiServerService {
  private readonly k8sClient: KubeConfig
  private readonly k8sApi
  private readonly logger = new Logger(ApiServerService.name)

  constructor(private configService: ConfigService) {
    try {
      this.k8sClient = new k8s.KubeConfig()
      const apiServerConfig = this.configService.get('ecpGlobalConfig.apiServer')
      if (process.env.NODE_ENV === 'local') {
        this.k8sClient.loadFromString(JSON.stringify(apiServerConfig))
      } else {
        this.k8sClient.loadFromCluster()
      }
      this.k8sClient.applytoHTTPSOptions({ rejectUnauthorized: false })
      this.k8sApi = this.k8sClient.makeApiClient(k8s.CustomObjectsApi)
    } catch (err) {
      this.logger.error(`ApiServerService init error: ${err instanceof Error ? err.stack : ''}`)
    }
  }

  async getPromConfig(): Promise<IPromConfigData[]> {
    const configMapApi = this.k8sClient.makeApiClient(k8s.CoreV1Api)
    const result = await configMapApi.readNamespacedConfigMap(
      'ske-gateway-global-config',
      'platform-backend',
    )
    const yamlString = result?.body?.data?.['config.yaml'] || ''
    const config = yaml.load(yamlString)
    const promConfig = isDrConfigMap(config) ? config?.promConfig : []
    return promConfig
  }
}
