import { ESIndex, SearchResponse, SearchResponseHit, ES_MAX_SEARCH_COUNT } from 'common/constants/es'
import { ESService } from 'common/modules/es/es.service'
import { Injectable, InternalServerErrorException, HttpStatus, HttpException } from '@nestjs/common'

import { ICluster, IClusterInfoDetail, IClusterResource } from './entities/cluster.entity'
import { ERROR_MESSAGE } from 'common/constants/error'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { CLUSTER_CRD, GROUP, TENANT_QUOTA_CRD, VERSION } from 'common/constants/apiServer.constants'
import {
  IClusterCrdObject,
  ICreateNamespacedCustomObject,
  IGetOrDeleteNamespacedCustomObject,
  ITenantCrdObject,
  IPatchOrReplaceNamespacedCustomObject
} from 'common/interfaces/apiServer.interface'
import { ClusterInfoDto } from 'common/dtos/cluster.dto'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class ClustersService {
  private readonly logger = new Logger(ClustersService.name)
  private readonly clusterCrdConfig

  constructor(private esService: ESService, private apiServerService: ApiServerService) {}

  async create({ name, kubeconfig }: Record<'name' | 'kubeconfig', string>) {
    const crdObject: IClusterCrdObject = {
      apiVersion: `${GROUP}/${VERSION}`,
      kind: CLUSTER_CRD.KIND,
      metadata: {
        name
      },
      spec: {
        kubeconfig,
        groups: [],
        envs: [],
        cids: [],
        tenants: []
      }
    }

    const createNamespaceCustomObject: ICreateNamespacedCustomObject<IClusterCrdObject> = {
      crdObject,
      plural: CLUSTER_CRD.PLURAL,
      group: GROUP
    }
    const result = await this.apiServerService.create(createNamespaceCustomObject)

    return result
  }

  async delete(clusterName: string) {
    const deleteNamespaceCustomObject: IGetOrDeleteNamespacedCustomObject = {
      name: clusterName,
      plural: CLUSTER_CRD.PLURAL,
      group: GROUP
    }
    const result = await this.apiServerService.delete(deleteNamespaceCustomObject)

    return result
  }

  async getAllClusters(): Promise<{ total: number; documents: ICluster[] }> {
    return this.esService.matchAll<ICluster>(ESIndex.CLUSTER, ES_MAX_SEARCH_COUNT)
  }

  async findByName(name: string): Promise<ICluster> {
    const esCluster = await this.esService.termQueryFirst<ICluster>(ESIndex.CLUSTER, 'name', name)
    if (!esCluster) {
      throw new HttpException(`Can't not find cluster ${name}`, HttpStatus.NOT_FOUND)
    }

    return esCluster
  }

  async findClusterResourceByName(name: string): Promise<IClusterResource> {
    const clusterResource = {} as IClusterResource
    const rawClusterResource = await this.esService.termQueryFirst<any>(ESIndex.CLUSTER_RESOURCE, 'cluster', name)
    if (!rawClusterResource) {
      return null
    }

    clusterResource.cluster = rawClusterResource.name
    try {
      clusterResource.data = JSON.parse(rawClusterResource.data)
    } catch (e) {
      this.logger.error(`Can not parse cluster quotas for ${name}: ${e}`)
      throw new InternalServerErrorException(`Can not parse cluster quota: ${e}`)
    }

    return clusterResource
  }

  async getDetail(cluster: string): Promise<SearchResponseHit<ICluster>> {
    try {
      const response = await this.esService.termQueryFirst<ICluster>(ESIndex.CLUSTER, 'name', cluster, (data) => data)

      return response
    } catch (e) {
      throw new InternalServerErrorException(ERROR_MESSAGE.ELASTICSEARCH_ERROR)
    }
  }

  async listInfo() {
    const response = await this.esService.client.search<SearchResponse<ICluster>>({
      index: ESIndex.CLUSTER,
      size: ES_MAX_SEARCH_COUNT
    })
    return response.body
  }

  async getAllClustersName(): Promise<string[]> {
    const result = await this.esService.client.search<SearchResponse<ClusterInfoDto>>({
      index: ESIndex.CLUSTER,
      size: ES_MAX_SEARCH_COUNT,
      _source: ['name']
    })
    const clusterNameList = result.body.hits.hits.map((hit) => hit._source.name).sort((c1, c2) => (c1 > c2 ? 1 : -1))
    return clusterNameList
  }

  async getInfoDetail(cluster: string) {
    const response = await this.esService.termQueryFirst<IClusterInfoDetail>(
      ESIndex.CLUSTER_INFO_DETAIL,
      'name',
      cluster
    )

    return response
  }

  async updateConfig(clusterName: string, configs: Record<'cids' | 'envs' | 'groups' | 'tenants', string[]>) {
    const getNamespaceCustomObject: IGetOrDeleteNamespacedCustomObject = {
      name: clusterName,
      plural: CLUSTER_CRD.PLURAL,
      group: GROUP
    }
    const { body } = await this.apiServerService.get<IClusterCrdObject>(getNamespaceCustomObject)
    const { spec } = body

    const patchNamespaceCustomObject: IPatchOrReplaceNamespacedCustomObject<IClusterCrdObject> = {
      ...getNamespaceCustomObject,
      crdObject: {
        ...body,
        spec: {
          ...spec,
          ...configs
        }
      }
    }

    const result = await this.apiServerService.replace(patchNamespaceCustomObject)

    return result
  }

  async getTenantCrd(tenantName: string) {
    const getNamespaceCustomObject: IGetOrDeleteNamespacedCustomObject = {
      name: tenantName,
      plural: TENANT_QUOTA_CRD.PLURAL,
      group: GROUP
    }

    const { body } = await this.apiServerService.get<ITenantCrdObject>(getNamespaceCustomObject)
    return body
  }

  async updateTenantQuotas(tenantName: string, crdObj: ITenantCrdObject) {
    const patchNamespaceCustomObject: IPatchOrReplaceNamespacedCustomObject<ITenantCrdObject> = {
      name: tenantName,
      plural: TENANT_QUOTA_CRD.PLURAL,
      group: GROUP,
      crdObject: crdObj
    }

    const result = await this.apiServerService.replace(patchNamespaceCustomObject)

    return result
  }
}
