import { Injectable, InternalServerErrorException, HttpStatus, HttpException, Logger } from '@nestjs/common'

import { ESService } from 'common/modules/es/es.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { AuthService } from 'common/modules/auth/auth.service'

import { ESIndex, ES_MAX_SEARCH_COUNT } from 'common/constants/es'

import { parseClusterId, generateClusterEnvsMap, generateClusterId, generateQuotaName } from 'common/helpers/cluster'
import { dedup } from 'common/helpers/array'
import { orderEnvs } from 'common/helpers/env'
import { generateGroupNamespace } from 'common/helpers/group'
import { calculateMetricsList, generateRequestList, calculateUsageAlarm } from 'common/helpers/metrics'

import { IESProjectDetailResponse } from 'applications-management/projects/dto/create-project.dto'
import { IProjectQuotasDto } from 'applications-management/projects/dto/project.quotas.dto'
import { ICreateTenantBodyDto, IGroupDetail, IMetricsDto, ITenant } from './dto/group.dto'
import {
  IProjectQuota,
  IProjectQuotas,
  IMetricResponse
} from 'applications-management/projects/entities/project.entity'
import { ICreateNamespacedCustomObject, ITenantCrdObject } from 'common/interfaces'
import { GROUP, TENANT_QUOTA_CRD } from 'common/constants/apiServer.constants'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { TENANT_QUOTA_CRD_PREFIX } from 'common/constants/tenant'

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name)

  constructor(
    private readonly esService: ESService,
    private readonly clustersService: ClustersService,
    private metricsService: MetricsService,
    private readonly apiServerService: ApiServerService,
    private authService: AuthService
  ) {}

  async getDetail(tenantId: number, authToken: string): Promise<IGroupDetail> {
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo

    // get all projects under the group
    const { documents: projects } = await this.esService.termQueryAll<IESProjectDetailResponse>(
      ESIndex.PROJECT,
      'tenant',
      tenantId,
      ES_MAX_SEARCH_COUNT
    )

    const envs = []
    const cids = []
    const clusters = []
    const envClusterMap = {}

    projects.forEach((project) => {
      const environments = project.environments || []
      const projectCids = project.cids || []
      const projectClusters = project.clusters || []
      const relations = project.relations || []

      envs.push(...environments)
      cids.push(...projectCids)
      clusters.push(...projectClusters)
      relations.forEach((clusterId) => {
        const { env, clusterName } = parseClusterId(clusterId)
        // check if env is in group
        if (envs.includes(env)) {
          envClusterMap[env] = envClusterMap[env] ? [...envClusterMap[env], clusterName] : [clusterName]
        }
      })
    })

    envs.forEach((env) => {
      if (envClusterMap[env]) {
        envClusterMap[env] = dedup(envClusterMap[env])
      }
    })

    return {
      name: tenantName,
      id: tenantId,
      envs: dedup(orderEnvs(envs)),
      cids: dedup(cids),
      clusters: dedup(clusters),
      envClusterMap: envClusterMap
    }
  }

  async getGroupMetrics(
    tenantId: number,
    envName: string,
    clusterName: string,
    authToken: string
  ): Promise<IMetricsDto> {
    if (!tenantId || !envName || !clusterName) {
      throw new HttpException('Request name is invalid', HttpStatus.BAD_REQUEST)
    }

    const { config: token } = await this.clustersService.findByName(clusterName)

    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    const requestList = generateRequestList({ token, tenantName, envName })
    const metricsList = await Promise.all(
      requestList.map(({ token, path }) => this.metricsService.request<IMetricResponse>(path, token))
    ).catch((err) => {
      this.logger.error(`MetricsList handle error: ${err}`)
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    })

    const { cpu, memory, filesystem } = calculateMetricsList(metricsList)

    const quotaName = generateClusterId(envName, '*', clusterName)
    const { groupLimitCpu, groupLimitMemory } = await this.getGroupLimitQuotas(tenantId.toString(), quotaName)

    return {
      cluster: clusterName,
      env: envName,
      quota: {
        cpu: {
          ...cpu,
          alarm: calculateUsageAlarm(cpu),
          total: groupLimitCpu
        },
        memory: {
          ...memory,
          alarm: calculateUsageAlarm(memory),
          total: groupLimitMemory * 1024 * 1024 * 1024 // covert to bytes
        },
        filesystem: {
          ...filesystem,
          alarm: '',
          total: 0
        }
      }
    }
  }

  async getProjectEnvQuotas(
    tenantId: number,
    envs: string[] = [],
    cids: string[] = [],
    authToken: string
  ): Promise<IProjectQuotasDto> {
    if (!tenantId) {
      throw new HttpException('Request name is invalid', HttpStatus.BAD_REQUEST)
    }

    if (!envs || !cids) {
      throw new HttpException('The request body is invalid', HttpStatus.BAD_REQUEST)
    }

    envs = envs instanceof Array ? envs : [envs]
    cids = cids instanceof Array ? cids : [cids]
    if (!envs.length || !cids.length || dedup(cids).length !== cids.length || dedup(envs).length !== envs.length) {
      throw new HttpException('The request body is invalid', HttpStatus.BAD_REQUEST)
    }

    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo

    const { documents: esClusterList } = await this.clustersService.getAllClusters()
    const clusterEnvsMap = generateClusterEnvsMap(tenantId.toString(), envs, cids, esClusterList)

    const clusterQuotasList = await Promise.all(
      Object.entries(clusterEnvsMap).map(async ([clusterName, envs]) => {
        const resourceQuotas = await Promise.all(
          envs.map(async (env) => {
            const quotaName = generateClusterId(env, '*', clusterName)
            const { groupLimitCpu, groupLimitMemory } = await this.getGroupLimitQuotas(tenantId.toString(), quotaName)
            const { groupTotalCpu, groupTotalMemory } = await this.getGroupTotalQuotas(tenantId.toString(), quotaName)

            return {
              name: generateQuotaName(quotaName),
              envName: env,
              cpu: {
                used: 0,
                assigned: 0,
                total: 0,
                limit: groupLimitCpu - groupTotalCpu
              },
              memory: {
                used: 0,
                assigned: 0,
                total: 0,
                limit: groupLimitMemory - groupTotalMemory
              }
            }
          })
        )

        return {
          name: clusterName,
          resourceQuotas
        }
      })
    )

    return {
      clusters: clusterQuotasList
    }
  }

  // helpers
  async getGroupLimitQuotas(
    groupName: string,
    clusterId: string
  ): Promise<{ groupLimitCpu: number; groupLimitMemory: number }> {
    const { env, clusterName } = parseClusterId(clusterId)
    const groupQuotaName = generateGroupNamespace(groupName, env, '*')

    const clusterResource = await this.clustersService.findClusterResourceByName(clusterName)
    const resourceMap = (clusterResource && clusterResource.data.resourceQuotas) || {}
    const { cpuTotal, memoryTotal } = resourceMap[groupQuotaName] || {}

    return {
      groupLimitCpu: cpuTotal,
      groupLimitMemory: memoryTotal
    }
  }

  async getGroupTotalQuotas(
    groupName: string,
    quotaName: string
  ): Promise<{ groupTotalCpu: number; groupTotalMemory: number }> {
    let groupTotalCpu = 0
    let groupTotalMemory = 0

    const allQuotasMap = await this.getGroupQuotasMapFromES(groupName)

    try {
      Object.values(allQuotasMap).forEach((esQuota: IProjectQuotas) => {
        const quotasMap = esQuota.quotas.Quotas || {}

        Object.values(quotasMap).forEach((quota: IProjectQuota) => {
          const { name, cpuTotal, memoryTotal } = quota
          if (name === quotaName) {
            groupTotalCpu += cpuTotal
            groupTotalMemory += memoryTotal
          }
        })
      })
    } catch (e) {
      this.logger.error(`Failed to calculate quotas for ${groupName} ${quotaName}: ${e}`)
      throw new InternalServerErrorException(`Failed to calculate quotas: ${e}`)
    }

    return {
      groupTotalCpu,
      groupTotalMemory
    }
  }

  async getGroupQuotasMapFromES(groupName: string): Promise<{ [projectName: string]: IProjectQuotas }> {
    const map = {}
    const { documents: groupQuotasList } = await this.esService.termQueryAll<IProjectQuotas>(
      ESIndex.PROJECT_QUOTAS,
      'tenant',
      groupName,
      ES_MAX_SEARCH_COUNT
    )

    groupQuotasList.forEach((groupEsQuotas) => {
      try {
        groupEsQuotas.quotas = JSON.parse((groupEsQuotas.quotas as unknown) as string)
      } catch (e) {
        this.logger.error(`Can not parse group quotas for ${groupName}: ${e}`)
        throw new InternalServerErrorException(`Can not parse group quotas: ${e}`)
      }

      map[groupEsQuotas.project] = groupEsQuotas
    })

    return map
  }

  async createTenant(createTenantDto: ICreateTenantBodyDto, authToken): Promise<ITenant> {
    const tenant = await this.authService.createTenant(createTenantDto, authToken)
    const createNamespaceCustomObject: ICreateNamespacedCustomObject<ITenantCrdObject> = {
      crdObject: {
        kind: TENANT_QUOTA_CRD.KIND,
        metadata: {
          name: `${TENANT_QUOTA_CRD_PREFIX}${tenant.id}`
        },
        spec: {
          alias: tenant.name,
          quotas: []
        }
      },
      plural: TENANT_QUOTA_CRD.PLURAL,
      group: GROUP
    }

    try {
      await this.apiServerService.create(createNamespaceCustomObject)
    } catch (err) {
      this.logger.error(`failed to create tenant quota for ${err}`)
      // TODO delete tenant in auth service?
      throw new InternalServerErrorException('Fail to create tenant quotas in cluster please contact platform admin')
    }

    return tenant
  }
}
