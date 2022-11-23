import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  Controller,
  Get,
  Param,
  NotFoundException,
  UseInterceptors,
  Query,
  Post,
  Body,
  Delete,
  Put,
  BadRequestException,
  HttpException
} from '@nestjs/common'

import { ESIndex, SearchResponseHit } from 'common/constants/es'

import { ListQueryDto } from 'common/dtos'
import {
  ClusterInfoListDto,
  ClassNamesDto,
  ClusterConfigDto,
  ClusterCreateBodyDto,
  ClusterDeleteResponseDto,
  ClusterConfigKeys,
  ClusterDeleteParamsDto
} from './dto'
import { ClusterInfoDto, GetClusterEventsResponseDto } from './dto/common/cluster.dto'
import { ICluster, IClusterInfoDetail, IEvent } from './entities/cluster.entity'
import { ROLES } from 'common/constants/node'
import { getRoleFromLabel } from 'common/helpers/node'
import { NodesService } from 'nodes/nodes.service'
import {
  IGetClusterQuotasResponseDto,
  IGetClusterQuotasResponseFromOpenApi,
  IGroupResourceQuotaInCluster,
  IResourceQuotaDetail
} from './dto/get-cluster-quotas.dto'
import { memoryQuantityScalar, cpuQuantityScalar } from 'common/helpers/clientNodeUtils'
import { EventService } from 'common/modules/event/event.service'

import { ClustersService } from './clusters.service'
import { Pagination } from 'common/decorators/methods'
import { AuthUser } from 'common/decorators/parameters/AuthUser'
import { PaginateInterceptor } from 'common/interceptors/paginate.interceptor'
import { GI_B_TO_BYTE } from 'common/constants/unit'
import { GetOrUpdateNameParamsDto, GetClusterStatusParamsDto } from './dto/common/params.dto'
import { ERROR_MESSAGE } from 'common/constants/error'
import { ClusterUpdateQuotasBodyDto } from './dto/update-cluster-quotas.dto'
import { ITenantCrdObject } from 'common/interfaces/apiServer.interface'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'

import { EsSyncInterceptor } from 'common/interceptors/esSync.interceptor'
import { intersectionWith, isEqual, sortBy } from 'lodash'
import { EsSync } from 'common/decorators/methods/esSync.decorator'
import { IClusterStatus } from 'common/constants'
import { roundToTwo } from 'common/helpers/decimal'
import { parseFiltersMap } from 'common/helpers/filter'
import { AuthService } from 'common/modules/auth/auth.service'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import * as BPromise from 'bluebird'
import { calculateMetricsList, generateRequestList } from 'common/helpers/metrics'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { IMetricResponse } from 'applications-management/projects/entities/project.entity'
import { ITenant } from 'applications-management/groups/dto/group.dto'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { Logger } from 'common/helpers/logger'

@ApiTags('Cluster')
@Controller()
export class ClustersController {
  private logger: Logger = new Logger(ClustersController.name)

  constructor(
    private readonly clustersService: ClustersService,
    private nodesService: NodesService,
    private eventService: EventService,
    private authService: AuthService,
    private metricsService: MetricsService,
    private openapiService: OpenApiService
  ) {}

  // ClusterAPIGet
  @Get('clusters/:clusterName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.VIEW
  // })
  @ApiResponse({ status: 200, type: ClusterInfoDto, description: 'Get Summary of Cluster' })
  async getClusterInfo(@Param() params: GetOrUpdateNameParamsDto, @AuthToken() authToken: string) {
    const { clusterName } = params
    const data = await this.clustersService.getDetail(clusterName)

    const { tenants } = await this.authService.getAllTenants(authToken)
    const cluster = this.generateClusterInfoWithDetail(data, tenants)

    return cluster
  }

  // ClusterAPIAdd
  @Post('clusters')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.CREATE
  // })
  @EsSync({
    esContext: {
      index: ESIndex.CLUSTER,
      key: 'name'
    },
    reqContext: {
      key: 'name',
      position: 'body'
    },
    operation: 'create'
  })
  @UseInterceptors(EsSyncInterceptor)
  @ApiResponse({ status: 201, type: ClusterCreateBodyDto, description: 'Add a cluster' })
  async createCluster(@Body() body: ClusterCreateBodyDto) {
    const { name, kubeconfig } = body

    await this.clustersService.create({ name, kubeconfig })

    return { name, kubeconfig }
  }

  // ClusterAPIDel
  @Delete('clusters/:clusterName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.DELETE
  // })
  @EsSync({
    esContext: {
      index: ESIndex.CLUSTER,
      key: 'name'
    },
    reqContext: {
      key: 'clusterName',
      position: 'params'
    },
    operation: 'delete'
  })
  @UseInterceptors(EsSyncInterceptor)
  @ApiResponse({ status: 200, type: ClusterDeleteResponseDto, description: 'Delete a cluster' })
  async deleteCluster(@Param() params: ClusterDeleteParamsDto) {
    const { clusterName } = params

    await this.clustersService.delete(clusterName)

    return {}
  }

  // ClusterAPIGetConfigInfo
  @Get('clusterconfig/:clusterName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.VIEW
  // })
  @ApiResponse({ status: 200, type: ClusterConfigDto, description: 'Get ConfigInfo of a Cluster' })
  async getClusterConfig(
    @Param() params: GetOrUpdateNameParamsDto,
    @AuthToken() authToken: string
  ): Promise<ClusterConfigDto> {
    const { clusterName } = params
    const data = await this.clustersService.findByName(clusterName)

    const { tenants, envs, cids } = data
    const tenantNames = await Promise.all(
      (tenants || []).map(async (tenantId) => {
        const { name } = await this.authService.getTenantById(Number(tenantId), authToken)

        return name
      })
    )

    return {
      tenants: tenantNames, // huadong TODO remove in v1.1
      environments: envs || [],
      cids: cids || []
    }
  }

  @Put('clusterconfig/:clusterName')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  @EsSync({
    esContext: {
      index: ESIndex.CLUSTER,
      key: 'name'
    },
    reqContext: {
      key: 'clusterName',
      position: 'params'
    },
    operation: 'update',
    validator: (data: Record<'cids' | 'environments' | 'tenants', string[]>, esData: ICluster) => {
      return (
        isEqual(sortBy(data.cids), sortBy(esData.cids)) && isEqual(sortBy(data.environments), sortBy(esData.envs))
        // isEqual(sortBy(data.tenants), sortBy(esData.groups))
      )
    }
  })
  @UseInterceptors(EsSyncInterceptor)
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.EDIT
  // })
  @ApiResponse({ status: 201, type: ClusterConfigDto, description: 'Update ConfigInfo of a Cluster' })
  async updateClusterConfig(
    @Param() params: GetOrUpdateNameParamsDto,
    @Body() body: ClusterConfigDto,
    @AuthToken() authToken: string
  ): Promise<ClusterConfigDto> {
    const { clusterName } = params

    const data = await this.clustersService.findByName(clusterName)
    let isParentSet = true
    Object.entries(body).forEach(([key, item]: [string, string[]]) => {
      const requestItems = data[ClusterConfigKeys[key]] || []

      isParentSet =
        isParentSet &&
        requestItems.every((val) => {
          return item.includes(val)
        })
    })

    if (!isParentSet) {
      throw new BadRequestException(ERROR_MESSAGE.REQUEST_BODY_INVALID)
    }

    // huadong TODO remove in v1.1
    const { cids, environments, tenants: tenantNames } = body

    const { tenants } = await this.authService.getAllTenants(authToken)

    const matchTenantInfos = intersectionWith(tenants, tenantNames, (info, name) => {
      return info.name === name
    })

    const tenantIds = matchTenantInfos.map((info) => info.id.toString())

    const configs = {
      cids,
      envs: environments,
      groups: data.groups,
      tenants: tenantIds
    }

    await this.clustersService.updateConfig(clusterName, configs)

    return body
  }

  // ClusterAPIGetList
  @Get('clusters')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.VIEW
  // })
  @Pagination({
    key: 'clusters',
    countKey: 'totalCount',
    defaultOrder: 'name'
  })
  @UseInterceptors(PaginateInterceptor)
  @ApiResponse({ status: 200, type: ClusterInfoListDto, description: 'Get Summary of Clusters' })
  async listClustersInfo(@Query() queryParams: ListQueryDto, @AuthUser() authUser: any): Promise<ClusterInfoListDto> {
    const data = await this.clustersService.listInfo()
    const { hits, total } = data.hits

    const isWithConfig = authUser.isInfra

    const clusters = await Promise.all(
      hits.map(async (hit) => {
        const result = await this.generateClusterInfo(hit, isWithConfig)
        return result
      })
    )
    return {
      clusters,
      totalCount: total.value
    }
  }

  @Get('clustersnames')
  @ApiResponse({ status: 200, type: ClassNamesDto, description: 'Get Summary of Clusters' })
  async getClusterNames() {
    const names = await this.clustersService.getAllClustersName()
    return { names }
  }

  // ClusterAPIGetStatus
  @Get('clusterstatus')
  @Pagination({
    key: 'clusters',
    countKey: 'totalCount',
    defaultOrder: 'name'
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  @UseInterceptors(PaginateInterceptor)
  @ApiQuery({ name: 'clusters', type: String, description: 'clusterName|clusterName...' })
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.VIEW
  // })
  @ApiResponse({ status: 200, type: ClusterInfoListDto, description: 'list clusters info status' })
  async listClustersInfoStatus(
    @Query() clustersParam: GetClusterStatusParamsDto,
    @AuthToken() authToken: string
  ): Promise<ClusterInfoListDto> {
    const clusterNames = clustersParam.clusters.split('|')

    const data = await this.clustersService.listInfo()
    const { hits, total } = data.hits

    const matchHits = hits.filter((hit) => {
      const { _source } = hit

      const { name } = _source

      return clusterNames.indexOf(name) >= 0
    })

    const { tenants } = await this.authService.getAllTenants(authToken)
    const clusters = await Promise.all(
      matchHits.map(async (hit) => {
        const result = await this.generateClusterInfoWithDetail(hit, tenants)
        return result
      })
    )

    return {
      clusters,
      totalCount: total.value
    }
  }

  private async generateClusterInfo(hit: SearchResponseHit<ICluster>, isWithConfig: boolean): Promise<ClusterInfoDto> {
    const baseData = this.generateClusterInfoBaseData(hit)

    const { _source } = hit
    const { name } = _source

    const infoDetail = (await this.clustersService.getInfoDetail(name)) || { status: IClusterStatus.UNKNOWN }
    const { status } = infoDetail

    const info = {
      name,
      config: isWithConfig
        ? baseData.config
        : {
            name: '', // default return
            kubeconfig: '' // default return
          },
      status
    }

    return {
      ...baseData,
      ...info
    } as ClusterInfoDto
  }

  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.GROUP_QUOTA,
  //   verb: ACCESS_CONTROL_VERBS.VIEW
  // })
  @Get('clusters/:clusterName/resourceQuotas')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RESOURCE_QUOTA)
  @ApiResponse({ status: 200, type: IGetClusterQuotasResponseDto })
  async findResourceQuotas(
    @Param() params: GetOrUpdateNameParamsDto,
    @AuthToken() authToken: string
  ): Promise<IGetClusterQuotasResponseDto> {
    // const { clusterName } = params

    // return this.getResourceQuotas(clusterName, authToken)
    try {
      const result: IGetClusterQuotasResponseFromOpenApi = await this.openapiService.getClusterQuotas(params, authToken)
      return {
        groups: result.tenants
      }
    } catch (err) {
      const { status } = err
      const message = 'Get cluster node from agent failed.'
      throw new HttpException(message, status)
    }
  }

  @Put('clusters/:clusterName/resourceQuotas')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RESOURCE_QUOTA)
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.EDIT
  // })
  // @EsSync({
  //   esContext: {
  //     index: ESIndex.CLUSTER_RESOURCE,
  //     key: 'cluster'
  //   },
  //   reqContext: {
  //     key: 'clusterName',
  //     position: 'params'
  //   },
  //   operation: 'update',
  //   validator: (data: ClusterUpdateQuotasBodyDto, rawEsData) => {
  //     const esAllGroupsData = JSON.parse(rawEsData.data).resourceQuotas

  //     const { quotasConfig } = data

  //     const esGroupData = Object.entries(esAllGroupsData).map(([name, data]: [string, any]) => {
  //       return {
  //         name,
  //         ...data
  //       }
  //     })

  //     let isSynced = true

  //     quotasConfig.forEach((config: { name: string; cpuTotal: number; memoryTotal: number }) => {
  //       const { name, cpuTotal, memoryTotal } = config
  //       const esDataName = name.split(':').join('-') + '-*'

  //       const matchEsData = esGroupData.find((item) => item.name === esDataName)

  //       if (
  //         roundToTwo(matchEsData.cpuTotal) !== roundToTwo(cpuTotal) ||
  //         roundToTwo(matchEsData.memoryTotal) !== roundToTwo(memoryTotal)
  //       ) {
  //         isSynced = false
  //       }
  //     })

  //     return isSynced
  //   }
  // })
  // @UseInterceptors(EsSyncInterceptor)
  async updateQuotas(
    @Param() params: GetOrUpdateNameParamsDto,
    @Body() body: ClusterUpdateQuotasBodyDto,
    @AuthToken() authToken: string
  ) {
    const result = await this.openapiService.updateClusterQuotas(params, body, authToken)

    return result
  }

  // deprecated
  async updateResourceQuotas(@Param() params: GetOrUpdateNameParamsDto, @Body() body: ClusterUpdateQuotasBodyDto) {
    const { clusterName } = params

    // get group name
    const { quotasConfig } = body

    // validate: payload quotas must be an not empty array
    if (!Array.isArray(quotasConfig) || quotasConfig.length === 0) {
      throw new BadRequestException(ERROR_MESSAGE.REQUEST_BODY_INVALID)
    }

    // validate: payload quotas item's name must not be duplicate
    const nameMap = quotasConfig.map((quota) => quota.name)
    const nameSet = new Set(nameMap)
    if (Array.from(nameSet).length !== nameMap.length) {
      throw new BadRequestException(ERROR_MESSAGE.REQUEST_BODY_INVALID)
    }

    const tenantId = quotasConfig[0].name.split(':')[0]
    // const tenantName = rawTenantName
    //   .split(' ')
    //   .map((val) => val.toLocaleLowerCase())
    //   .join('-')
    const tenantName = `tenant-${tenantId}`

    const tenant = await this.clustersService.getTenantCrd(tenantName)

    const { spec } = tenant
    const { quotas = [] } = spec

    const retainQuotas = quotas.filter((quota) => quota.cluster !== clusterName)
    const updatingQuotas = quotas.filter((quota) => quota.cluster === clusterName)

    const notExistQuotasConfig = quotasConfig.filter((config) => {
      const { name } = config
      const env = name.split(':')[1]

      return !updatingQuotas.find((quota) => {
        return quota.env === env
      })
    })

    const notExistQuotas = notExistQuotasConfig.map((config) => {
      const { name, cpuTotal, memoryTotal } = config
      const env = name.split(':')[1]

      return {
        cluster: clusterName,
        cpu: roundToTwo(cpuTotal),
        memory: roundToTwo(memoryTotal) + 'Gi',
        env,
        name: `${clusterName}-${env}`
      }
    })

    const updateQuotas = updatingQuotas.map((quota) => {
      const data = quotasConfig.find((config) => {
        const { name } = config
        const env = name.split(':')[1]

        return env === quota.env
      })

      if (!data) {
        return quota
      }

      const { cpuTotal, memoryTotal } = data

      return {
        ...quota,
        cpu: roundToTwo(cpuTotal),
        memory: roundToTwo(memoryTotal) + 'Gi'
      }
    })

    const tenantQuotas = [...retainQuotas, ...updateQuotas, ...notExistQuotas]

    const newSpec = {
      ...spec,
      quotas: tenantQuotas
    }

    const newCrdObject: ITenantCrdObject = {
      ...tenant,
      spec: newSpec
    }

    await this.clustersService.updateTenantQuotas(tenantName, newCrdObject)

    return body
  }

  // helpers
  private async generateClusterInfoWithDetail(
    hit: SearchResponseHit<ICluster>,
    tenants: ITenant[]
  ): Promise<ClusterInfoDto> {
    const baseData = this.generateClusterInfoBaseData(hit)

    const { _source } = hit
    const { cids, envs, tenants: tenantIds, name, config } = _source

    const matchTenantInfos = intersectionWith(tenants, tenantIds, (info, id) => {
      return info.id.toString() === id
    })

    const infoDetail: Partial<IClusterInfoDetail> = (await this.clustersService.getInfoDetail(name)) || {
      status: IClusterStatus.UNKNOWN,
      ...baseData
    }

    const { status, alarms, nodeSummary, podSummary, metrics } = infoDetail

    const { cpu, memory } = metrics

    const { workerAllocatable, quotaTotal } = await this.getClusterWorkerNodeAllocatableAndQuotaTotal(name, config)
    const info = {
      name,
      status,
      alarms,
      nodeSummary,
      podSummary,
      metrics: {
        cpu: {
          ...cpu,
          workerAllocatable: workerAllocatable.cpu,
          quotaTotal: quotaTotal.cpu
        },
        memory: {
          ...memory,
          workerAllocatable: workerAllocatable.memory,
          quotaTotal: quotaTotal.memory
        }
      },
      config: baseData.config
    }

    return {
      ...baseData,
      ...info,
      cids,
      envs,
      tenants: matchTenantInfos.map((info) => info.name) // huadong TODO remove
    } as ClusterInfoDto
  }

  private async getClusterWorkerNodeAllocatableAndQuotaTotal(clusterName: string, config: string) {
    const data = {
      workerAllocatable: {
        cpu: 0,
        memory: 0
      },
      quotaTotal: {
        cpu: 0,
        memory: 0
      }
    }

    try {
      // get worker node allocatable cpu and memory
      const nodeList = await this.nodesService.getNodeListWithClusterConfig(config, clusterName)
      const workerNodes = nodeList.items.filter((node) => {
        if (!node.metadata) {
          return false
        }

        return !!Object.keys(node.metadata.labels || {}).find((label) => {
          const role = getRoleFromLabel(label)
          return role === ROLES.WORKER || role === ROLES.NODE
        })
      })
      const [allocatableCPU, allocatableMemory] = workerNodes.reduce(
        (prev, node) => {
          let [currentCpuTotal, currentMemoryTotal] = prev
          const cpu = node.status.allocatable.cpu
          if (cpu) {
            currentCpuTotal += cpuQuantityScalar(cpu)
          }

          const memory = node.status.allocatable.memory
          if (memory) {
            currentMemoryTotal += memoryQuantityScalar(memory)
          }

          return [currentCpuTotal, currentMemoryTotal]
        },
        [0, 0]
      )

      // calculate cluster quota total
      let clusterResource = await this.clustersService.findClusterResourceByName(clusterName)
      if (!clusterResource) {
        this.logger.error(`Can not get cluster resource from es with name ${clusterName}`)
        clusterResource = { cluster: clusterName, data: { resourceQuotas: {} } }
      }

      const [quotaTotalCPU, quotaTotalMemory] = Object.values(clusterResource.data.resourceQuotas).reduce(
        (prev, quota) => {
          const [currentAllQuotaCPU, currentAllQuotaMemory] = prev
          return [currentAllQuotaCPU + quota.cpuTotal, currentAllQuotaMemory + quota.memoryTotal]
        },
        [0, 0]
      )

      return {
        workerAllocatable: {
          cpu: allocatableCPU,
          memory: allocatableMemory
        },
        quotaTotal: {
          cpu: quotaTotalCPU,
          memory: quotaTotalMemory
        }
      }
    } catch {
      return data
    }
  }

  private generateClusterInfoBaseData(hit: SearchResponseHit<ICluster>): Partial<ClusterInfoDto> {
    const { _id, _source } = hit
    const { config, createTime, name } = _source

    return {
      id: _id,
      config: {
        name,
        kubeconfig: config
      },
      creationTimestamp: createTime,
      name,
      alarms: [], // default return
      cids: [], // default return
      envs: [], // default return
      groups: [], // default return
      nodeSummary: {
        // default return
        count: 0,
        unhealthyCount: 0
      },
      podSummary: {
        // default return
        count: 0,
        unhealthyCount: 0
      },
      metrics: {
        // default return
        cpu: {
          assigned: 0,
          assignedUsage: 0,
          capacity: 0,
          free: 0,
          reserved: 0,
          used: 0,
          usedUsage: 0,
          workerAllocatable: 0,
          quotaTotal: 0
        },
        memory: {
          assigned: 0,
          assignedUsage: 0,
          capacity: 0,
          free: 0,
          reserved: 0,
          used: 0,
          usedUsage: 0,
          workerAllocatable: 0,
          quotaTotal: 0
        }
      }
    }
  }

  @Get('clusters/:clusterName/events')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  // @GlobalResourceGuard({
  //   resource: GLOBAL_RESOURCES.CLUSTER_TAB,
  //   verb: ACCESS_CONTROL_VERBS.VIEW
  // })
  @ApiResponse({ status: 200, type: GetClusterEventsResponseDto, description: 'Get Events of Cluster' })
  async getClusterEvents(
    @Param() params: GetOrUpdateNameParamsDto,
    @Query() query: ListQueryDto
  ): Promise<GetClusterEventsResponseDto> {
    const { clusterName } = params
    const { offset, limit, orderBy, filterBy } = query

    const queryObject = parseFiltersMap(filterBy)
    const { creationTimestamp = [], name = [], namespace = [], kind = [], all = [] } = queryObject

    const startTime = creationTimestamp[0] || ''
    const endTime = creationTimestamp[1] || ''
    const queryItems = { cluster: [clusterName], name, namespace, kind }
    const isDesc = orderBy && orderBy.includes('desc')

    const { eventList: esEvents, totalCount, kindList } = await this.eventService.getEvents({
      startTime,
      endTime,
      query: queryItems,
      searchAll: all,
      offset,
      limit,
      isCreateTimeDesc: isDesc
    })

    const events: IEvent[] = esEvents.map((esEvent: any) => {
      const { name, namespace, message, reason, kind, createtime, podip: tempPod, hostip: tempHost } = esEvent
      return { name, namespace, message, reason, kind, creationTimestamp: createtime, podip: tempHost, hostip: tempPod }
    })

    return { totalCount, events, kindList }
  }

  async getResourceQuotas(clusterName: string, authToken: string) {
    const clusterQuotasResponse = { groups: [] } as IGetClusterQuotasResponseDto

    const cluster = await this.clustersService.findByName(clusterName)
    if (!cluster) {
      this.logger.error(`Can not get cluster from es with name ${clusterName}`)
      throw new NotFoundException(`Cluster ${clusterName} not found`)
    }

    let clusterResource = await this.clustersService.findClusterResourceByName(clusterName)
    if (!clusterResource) {
      this.logger.error(`Can not get cluster resource from es with name ${clusterName}`)
      clusterResource = { cluster: cluster.name, data: { resourceQuotas: {} } }
    }

    const nodeList = await this.nodesService.getNodeListWithClusterConfig(cluster.config, clusterName)
    const workerNodes = nodeList.items.filter((node) => {
      if (!node.metadata) {
        return false
      }

      return !!Object.keys(node.metadata.labels || {}).find((label) => {
        const role = getRoleFromLabel(label)
        return role === ROLES.WORKER || role === ROLES.NODE
      })
    })

    // calculate allocatable CPU and memory from worker nodes
    const [allocatableCPU, allocatableMemory] = workerNodes.reduce(
      (prev, node) => {
        let [currentCpuTotal, currentMemoryTotal] = prev
        const cpu = node.status.allocatable.cpu
        if (cpu) {
          currentCpuTotal += cpuQuantityScalar(cpu)
        }

        const memory = node.status.allocatable.memory
        if (memory) {
          currentMemoryTotal += memoryQuantityScalar(memory)
        }

        return [currentCpuTotal, currentMemoryTotal]
      },
      [0, 0]
    )

    // calculate all cpu and memory from resource quotas info in cluster
    const [allCPU, allMemory] = Object.values(clusterResource.data.resourceQuotas).reduce(
      (prev, quota) => {
        const [currentAllQuotaCPU, currentAllQuotaMemory] = prev
        return [currentAllQuotaCPU + quota.cpuTotal, currentAllQuotaMemory + quota.memoryTotal]
      },
      [0, 0]
    )

    const token = cluster.config
    const tenantIds = cluster.tenants || []
    const envs = cluster.envs || []
    const tenantInfos = await this.authService.getAllTenants(authToken)
    const tenantResourceQuotas = await BPromise.map(
      tenantIds,
      async (tenantId) => {
        const tenantInfo = tenantInfos.tenants.find((tenant) => tenant.id === Number(tenantId))
        if (!tenantInfo) {
          return {
            name: tenantId,
            resourceQuotas: []
          }
        }
        const { name: tenantName } = tenantInfo
        const tenantResourceQuota: IGroupResourceQuotaInCluster = {
          name: tenantId,
          alias: tenantName,
          resourceQuotas: []
        }

        // get tenant projects quotas from es for calculate tenant-env assigned
        // const tenantProjectQuotasFromEs = await this.projectService.getGroupProjectsQuotasFromES(tenantId)

        // get tenant cpu、mem usage and limit by env
        const tenantQuotasByEnv = await BPromise.map(
          envs,
          async (env: string) => {
            const name = `${tenantId}-${env}`
            // request metrics: group env status
            let cpuUsed = 0
            let memoryUsed = 0
            let cpuAssigned = 0
            let memoryAssigned = 0
            const requestList = generateRequestList({ token, tenantName, envName: env.toLowerCase() })

            const metricsList = await Promise.all(
              requestList.map(({ token, path }) => this.metricsService.request<IMetricResponse>(path, token))
            ).catch((err) => {
              this.logger.error(`MetricsList handle error: ${err}`)
              return null
            })

            // get tenant-env cpu、mem used
            if (metricsList) {
              const { cpu, memory } = calculateMetricsList(metricsList)
              cpuUsed = cpu.used
              memoryUsed = memory.used / GI_B_TO_BYTE
              cpuAssigned = cpu.applied
              memoryAssigned = memory.applied / GI_B_TO_BYTE
            }

            // get total from cluster-resource index
            const clusterResourceQuotaName = `${name}-*`
            const clusterResourceQuota = clusterResource.data.resourceQuotas[clusterResourceQuotaName]
            const { cpuTotal = 0, memoryTotal = 0 } = clusterResourceQuota || {}

            const otherCPU = allCPU - cpuTotal
            const otherMemory = allMemory - memoryTotal
            const cpuLimit = allocatableCPU - otherCPU
            const memoryLimit = allocatableMemory - otherMemory

            const quota: IResourceQuotaDetail = {
              cpu: {
                used: cpuUsed,
                assigned: cpuAssigned,
                limit: cpuLimit,
                total: cpuTotal
              },
              memory: {
                used: memoryUsed,
                assigned: memoryAssigned,
                limit: memoryLimit,
                total: memoryTotal
              },
              name,
              envName: env
            }

            return quota
          },
          { concurrency: 10 }
        )

        tenantResourceQuota.resourceQuotas = tenantQuotasByEnv

        return tenantResourceQuota
      },
      { concurrency: 30 }
    )
    clusterQuotasResponse.groups = tenantResourceQuotas

    return clusterQuotasResponse
  }
}
