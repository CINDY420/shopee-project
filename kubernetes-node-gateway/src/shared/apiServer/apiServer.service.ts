import { Injectable, Logger, CACHE_MANAGER, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as k8s from '@kubernetes/client-node'

import { KubeConfig } from '@kubernetes/client-node'
import { Cache } from 'cache-manager'
import * as yaml from 'js-yaml'
import { isObject } from 'class-validator'

function isDrConfigMap(config: unknown): config is { silence: boolean } {
  if (!isObject(config)) {
    return false
  }

  return 'silence' in config
}

@Injectable()
export class ApiServerService {
  private readonly k8sClient: KubeConfig
  private readonly k8sApi
  private readonly logger = new Logger(ApiServerService.name)

  constructor(private configService: ConfigService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    try {
      this.k8sClient = new k8s.KubeConfig()
      const apiServerConfig = this.configService.get('apiServer')
      if (process.env.NODE_ENV === 'local') {
        this.k8sClient.loadFromString(JSON.stringify(apiServerConfig))
      } else {
        this.k8sClient.loadFromCluster()
      }
      this.k8sClient.applytoHTTPSOptions({ rejectUnauthorized: false })
      this.k8sApi = this.k8sClient.makeApiClient(k8s.CustomObjectsApi)
    } catch (err) {
      this.logger.error(`ApiServerService init error: ${err}`)
      process.exit(1)
    }
  }

  async checkIsSilenceMode(): Promise<boolean> {
    const isSilentModeInCache = await this.cacheManager.get<boolean>('silence_mode_token')

    if (isSilentModeInCache === undefined) {
      const configMapApi = this.k8sClient.makeApiClient(k8s.CoreV1Api)
      const result = await configMapApi.readNamespacedConfigMap('ecp-ha-config', 'default')
      const yamlString = result?.body?.data?.['config.yaml'] || ''
      const config = yaml.load(yamlString)

      if (isDrConfigMap(config)) {
        const isSilence = config.silence ?? false
        await this.cacheManager.del('silence_mode_token')
        await this.cacheManager.set('silence_mode_token', isSilence, { ttl: 2 })

        return isSilence
      }

      return false
    } else {
      return isSilentModeInCache
    }
  }
}
