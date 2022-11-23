import { Injectable, HttpException, CACHE_MANAGER, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as k8s from '@kubernetes/client-node'
import http from 'http'
import * as yaml from 'js-yaml'

import {
  IListNamespacedCustomObject,
  IGetOrDeleteNamespacedCustomObject,
  ICreateNamespacedCustomObject,
  IPatchOrReplaceNamespacedCustomObject,
  IBaseCrdObject
} from 'common/interfaces/apiServer.interface'
import { GROUP, VERSION, NAMESPACE, PATCH_HEADER } from 'common/constants/apiServer.constants'
import { Logger } from 'common/helpers/logger'
import { Cache } from 'cache-manager'

type ApiServerReturn<T = IBaseCrdObject> = Promise<{ response: http.IncomingMessage; body: T }>

@Injectable()
export class ApiServerService {
  private readonly k8sClient: k8s.KubeConfig
  private readonly k8sApi
  private readonly logger = new Logger(ApiServerService.name)

  constructor(private configService: ConfigService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    try {
      const k8sClient = new k8s.KubeConfig()
      const apiServerConfig = this.configService.get<string>('apiServer')
      if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'ci') {
        k8sClient.loadFromString(JSON.stringify(apiServerConfig))
      } else {
        k8sClient.loadFromCluster()
      }
      this.k8sClient = k8sClient
      this.k8sApi = k8sClient.makeApiClient(k8s.CustomObjectsApi)
    } catch (err) {
      this.logger.error(`ApiServerService init error: ${err}`)
      process.exit(1)
    }
  }

  handleError(e) {
    if (e.response && e.response.body && e.response.body.code) {
      const { message, code } = e.response.body
      throw new HttpException(message, code)
    } else if (e.body && e.statusCode) {
      throw new HttpException(e.body, e.statusCode)
    }
    throw e
  }

  create<T>(req: ICreateNamespacedCustomObject): ApiServerReturn<T> {
    const { group = GROUP, version = VERSION, namespace = NAMESPACE, plural, crdObject } = req

    this.logger.log(`Create ${crdObject.metadata.name} in ${group}/${version}/${namespace}/${plural}`)
    return this.k8sApi
      .createNamespacedCustomObject(group, version, namespace, plural, {
        apiVersion: `${group}/${version}`,
        ...crdObject
      })
      .catch(this.handleError)
  }

  delete(req: IGetOrDeleteNamespacedCustomObject): ApiServerReturn {
    const { group = GROUP, version = VERSION, namespace = NAMESPACE, plural, name } = req

    this.logger.log(`Delete ${name} in ${group}/${version}/${namespace}/${plural}`)

    return this.k8sApi.deleteNamespacedCustomObject(group, version, namespace, plural, name).catch(this.handleError)
  }

  get<T extends IBaseCrdObject = IBaseCrdObject>(req: IGetOrDeleteNamespacedCustomObject): ApiServerReturn<T> {
    const { group = GROUP, version = VERSION, namespace = NAMESPACE, plural, name } = req

    this.logger.log(`Get ${name} in ${group}/${version}/${namespace}/${plural}`)
    return this.k8sApi.getNamespacedCustomObject(group, version, namespace, plural, name).catch(this.handleError)
  }

  list<T>(req: IListNamespacedCustomObject): ApiServerReturn<T> {
    const {
      group = GROUP,
      version = VERSION,
      namespace = NAMESPACE,
      plural,
      fieldSelector = undefined,
      labelSelector = undefined
    } = req

    this.logger.log(`List crds in ${group}/${version}/${namespace}/${plural}`)

    return this.k8sApi
      .listNamespacedCustomObject(group, version, namespace, plural, undefined, undefined, fieldSelector, labelSelector)
      .catch(this.handleError)
  }

  async patch<T extends IBaseCrdObject = IBaseCrdObject>(
    req: IPatchOrReplaceNamespacedCustomObject
  ): ApiServerReturn<T> {
    const { group = GROUP, version = VERSION, namespace = NAMESPACE, plural, name, crdObject } = req

    if (!crdObject.metadata.resourceVersion) {
      // FIXME, every update operation should have resourceVersion specified
      this.logger.warn('should specify resourceVersion from outside')
      const { body } = await this.get(req)
      crdObject.metadata.resourceVersion = body.metadata.resourceVersion
    }

    this.logger.log(`Patch ${crdObject.metadata.name} in ${group}/${version}/${namespace}/${plural}`)

    return this.k8sApi
      .patchNamespacedCustomObject(group, version, namespace, plural, name, crdObject)
      .catch(this.handleError)
  }

  async replace<T extends IBaseCrdObject = IBaseCrdObject>(
    req: IPatchOrReplaceNamespacedCustomObject<T>
  ): ApiServerReturn<T> {
    const { group = GROUP, version = VERSION, namespace = NAMESPACE, plural, name, crdObject } = req

    if (!crdObject.metadata.resourceVersion) {
      // FIXME, every update operation should have resourceVersion specified
      this.logger.warn('should specify resourceVersion from outside')
      const { body } = await this.get(req)
      crdObject.metadata.resourceVersion = body.metadata.resourceVersion
    }

    this.logger.log(`Replace ${crdObject.metadata.name} in ${group}/${version}/${namespace}/${plural}`)

    return this.k8sApi
      .replaceNamespacedCustomObject(
        group,
        version,
        namespace,
        plural,
        name,
        crdObject,
        undefined,
        undefined,
        undefined,
        PATCH_HEADER
      )
      .catch(this.handleError)
  }

  async checkIsSilenceMode(): Promise<boolean> {
    const isSilentModeInCache = await this.cacheManager.get<boolean>('silence_mode_token')

    if (isSilentModeInCache === undefined) {
      const configMapApi = this.k8sClient.makeApiClient(k8s.CoreV1Api)
      const result = await configMapApi.readNamespacedConfigMap('ecp-ha-config', 'default')
      const yamlString = result.body.data['config.yaml']
      const config = yaml.load(yamlString)
      const isSilence = config.silence ?? false

      await this.cacheManager.del('silence_mode_token')
      await this.cacheManager.set('silence_mode_token', isSilence, { ttl: 2 })

      return isSilence
    } else {
      return isSilentModeInCache
    }
  }
}
