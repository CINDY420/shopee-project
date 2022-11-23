import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  HttpStatus,
  HttpException,
  NotFoundException
} from '@nestjs/common'

import { ESIndex, ES_MAX_SEARCH_COUNT } from 'common/constants/es'
import { ESService } from 'common/modules/es/es.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { GroupsService } from 'applications-management/groups/groups.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { AgentService } from 'common/modules/agent/agent.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { AuthService } from 'common/modules/auth/auth.service'
import {
  ICreateNamespacedCustomObject,
  IGetOrDeleteNamespacedCustomObject,
  IPatchOrReplaceNamespacedCustomObject,
  IProjectCrdObject
} from 'common/interfaces/apiServer.interface'

import { GI_B_TO_BYTE } from 'common/constants/unit'
import { orderEnvs } from 'common/helpers/env'
import { RFC3339DateString } from 'common/helpers/date'
import {
  parseClusterId,
  generateQuotaName,
  generateClusterMap,
  generateCluster,
  parseClusterQuotaName
} from 'common/helpers/cluster'
import { dedup } from 'common/helpers/array'
import {
  generateClusterProjectNamespaceMap,
  generateEnvQuotaNameMap,
  buildNewProjectCrdAndResult,
  checkEnv,
  roundQuotasNumber
} from 'common/helpers/project'
import { calculateMetricsList, generateRequestList, calculateUsageAlarm } from 'common/helpers/metrics'
import { roundToTwo } from 'common/helpers/decimal'

import {
  IESProjectDetailResponse,
  IPlayLoadInfo,
  IGetProjectDetailDtoResponse,
  IAgentServiceResult,
  IProjectListItem,
  IProjectListResult,
  IGetMetricsResult
} from './dto/create-project.dto'
import {
  IProjectQuota,
  IProjectQuotas,
  IProjectUsage,
  IProjectQuotaMap,
  IMetricResponse,
  IWhiteListProject,
  IProjectQuotasInES
} from './entities/project.entity'
import { IDetail, IProjectQuotasDto } from './dto/project.quotas.dto'

import { PROJECT_CRD } from 'common/constants/apiServer.constants'
import { ITransferProjectResponse } from './dto/transfer-project.dto'
import { uniqWith } from 'lodash'

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name)

  constructor(
    private eSService: ESService,
    private metricsService: MetricsService,
    private groupsService: GroupsService,
    private clustersService: ClustersService,
    private agentService: AgentService,
    private apiServerService: ApiServerService,
    private authService: AuthService
  ) {}

  // APIS
  async getDetail(tenantId: number, projectName: string, authToken: string): Promise<IGetProjectDetailDtoResponse> {
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    const esProjectResult = await this.getEsProject(projectName, tenantId)

    const cids = esProjectResult.cids || []
    const environments = esProjectResult.environments || []
    const relations = esProjectResult.relations || []
    const project = esProjectResult.project
    const clusters = esProjectResult.clusters || []

    try {
      // const quotas = await this.getQuotas(groupName, projectName, esProjectResult)

      return {
        cids: cids,
        clusters: generateCluster(environments, relations),
        envClusterMap: generateClusterMap(relations),
        envs: orderEnvs(environments),
        tenantName,
        tenantId,
        name: project,
        simpleClusters: clusters,
        quotas: {
          clusters: []
        }
      }
    } catch (err) {
      this.logger.error(`Project detail getting error: ${err}`)
      throw new BadRequestException(`Project detail get failed: ${err}`)
    }
  }

  async getClusterListByConfigInfo(
    tenantId: number,
    projectName: string,
    environments: string[],
    cids: string[],
    authToken: string
  ): Promise<{ clusterIds: string[] }> {
    await this.authService.getTenantById(tenantId, authToken)
    const esProjectResult = await this.getEsProject(projectName, tenantId)

    const { relations } = esProjectResult

    const result: string[] = []
    relations.forEach((clusterId) => {
      const { env, cid } = parseClusterId(clusterId)
      if (environments.includes(env) && cids.includes(cid)) {
        result.push(clusterId)
      }
    })

    return { clusterIds: result }
  }

  async getList(tenantId: number, authToken: string): Promise<IProjectListResult> {
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    try {
      const { documents, total } = await this.getProjectsByTenant(tenantId)
      const projects: IProjectListItem[] = []
      documents.forEach((esProject) => {
        const { cids, clusters, environments, tenant, project } = esProject
        projects.push({
          cids: dedup(cids),
          clusters: dedup(clusters),
          envs: dedup(environments),
          tenant,
          name: project
        })
      })

      const result = {
        tenantId,
        tenantName,
        projects: projects,
        totalCount: total
      }

      return result
    } catch (err) {
      throw new BadRequestException(`Invalid tenantId: ${tenantId}, width error ${err}`)
    }
  }

  async getQuotas(
    tenantId: number,
    projectName: string,
    authToken: string,
    project?: IESProjectDetailResponse
  ): Promise<IProjectQuotasDto> {
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName, id } = tenantInfo
    let esProject = project
    if (!esProject) {
      esProject = await this.getEsProject(projectName, tenantId)
    }

    const projectQuotasMap = await this.getProjectQuotasMapByName(id.toString(), projectName)

    const clusterProjectNamespaceMap = generateClusterProjectNamespaceMap(esProject)
    const clusterAndProjectNamespaceList = Object.entries(clusterProjectNamespaceMap)

    const clusterQuotasList = await Promise.all(
      clusterAndProjectNamespaceList.map(async ([clusterName, namespaces]) => {
        const envQuotaNameMap = generateEnvQuotaNameMap(clusterName, namespaces)
        const envAndQuotasNameList = Object.entries(envQuotaNameMap)

        const resourceQuotas = await Promise.all(
          envAndQuotasNameList.map(([env, quotaName]) =>
            this.getQuotaDetail({
              projectQuotasMap,
              groupName: tenantName,
              projectName,
              quotaName,
              env,
              esProject
            })
          )
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

  async getMetrics(
    tenantId: number,
    projectName: string,
    clusterName: string,
    envName: string,
    authToken: string
  ): Promise<IGetMetricsResult> {
    if (!checkEnv(envName)) {
      throw new BadRequestException(`Invalid env name: ${envName}`)
    }

    const { config: token } = await this.clustersService.findByName(clusterName).catch((err) => {
      this.logger.error(`Cluster token getting error: ${err}`)
      throw new BadRequestException(`Invalid cluster name: ${clusterName}`)
    })

    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName, id } = tenantInfo
    await this.getEsProject(projectName, tenantId)

    const requestList = generateRequestList({
      token,
      tenantName,
      envName,
      otherParams: { project: projectName }
    })
    const metricsList = await Promise.all(
      requestList.map(({ token, path }) => this.metricsService.request<IMetricResponse>(path, token))
    ).catch((err) => {
      this.logger.error(`MetricsList handle error: ${err}`)
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    })

    const { cpu, memory, filesystem } = calculateMetricsList(metricsList)

    const quotaKey = `${envName}-*:${clusterName}`
    const { projectTotalCpu, projectTotalMemory } = await this.getProjectTotalQuotas(
      id.toString(),
      projectName,
      quotaKey
    )

    return {
      cluster: clusterName,
      env: envName,
      quota: {
        cpu: {
          ...cpu,
          alarm: calculateUsageAlarm(cpu),
          total: projectTotalCpu
        },
        memory: {
          ...memory,
          alarm: calculateUsageAlarm(memory),
          total: projectTotalMemory
        },
        filesystem: {
          ...filesystem,
          alarm: '',
          total: 0
        }
      }
    }
  }

  async update(tenantId: number, projectName: string, payload: IPlayLoadInfo): Promise<IESProjectDetailResponse> {
    const oldProject = await this.getEsProject(projectName, tenantId)
    const { quotas } = payload

    try {
      buildNewProjectCrdAndResult(tenantId.toString(), projectName, payload)
    } catch (err) {
      throw new BadRequestException(`Bad param info! ${err}`)
    }

    const { crdObject, result } = buildNewProjectCrdAndResult(tenantId.toString(), projectName, payload)

    const createNamespaceCustomObject: IPatchOrReplaceNamespacedCustomObject<IProjectCrdObject> = {
      crdObject: crdObject,
      plural: 'projects',
      name: projectName
    }

    try {
      await this.apiServerService.replace(createNamespaceCustomObject)
    } catch (err) {
      this.logger.error(`Project crd update error: ${err}`)
      throw err
    }

    const { createtime } = oldProject
    result.createtime = createtime
    result.updatetime = RFC3339DateString(new Date())

    return {
      ...result,
      quotas: roundQuotasNumber(quotas)
    }
  }

  async create(tenantId: number, payload: IPlayLoadInfo, authToken: string): Promise<IESProjectDetailResponse> {
    const { project } = payload
    await this.authService.getTenantById(tenantId, authToken)

    try {
      buildNewProjectCrdAndResult(tenantId.toString(), project, payload)
    } catch (err) {
      throw new BadRequestException(`Create Project param error! ${err}`)
    }

    const { crdObject, result } = buildNewProjectCrdAndResult(tenantId.toString(), project, payload)
    const createNamespaceCustomObject: ICreateNamespacedCustomObject<IProjectCrdObject> = {
      crdObject: crdObject,
      plural: 'projects'
    }

    try {
      await this.apiServerService.create(createNamespaceCustomObject)
    } catch (err) {
      this.logger.error(`Project crd create error: ${err}`)
      throw err
    }

    return result
  }

  async delete(tenantId: number, projectName: string, authToken: string): Promise<any> {
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    const esProjectResult = await this.getEsProject(projectName, tenantId)

    // generate Namespace Map
    const clusterNamespaceMap = generateClusterProjectNamespaceMap(esProjectResult)

    // check service
    for (const clusterName in clusterNamespaceMap) {
      const { config: token } = await this.clustersService.findByName(clusterName)
      const namespace = clusterNamespaceMap[clusterName].join(',').toLowerCase()
      const results = await this.agentService
        .request<IAgentServiceResult>(
          'service',
          true,
          { config: token, clusterName },
          {
            namespace
          }
        )
        .catch((error) => {
          this.logger.error(`Project service get error: ${error}`)
          throw new HttpException('Agent get project service error', HttpStatus.SERVICE_UNAVAILABLE)
        })
      const { items } = results
      if (items && items.length > 0) {
        throw new BadRequestException('Project contains some services')
      }
    }

    // check ingress
    const ingressEsRes = await this.checkIngressAndApp(tenantName, projectName, ESIndex.INGRESS, {
      term: { status: 'normal' }
    })
    if (ingressEsRes.total > 0) {
      throw new BadRequestException('Project contains some ingresses')
    }

    // check app
    const appEsRes = await this.checkIngressAndApp(tenantName, projectName, ESIndex.APPLICATION)
    if (appEsRes.total > 0) {
      throw new BadRequestException('Project contains some applications')
    }

    try {
      await this.apiServerService.delete({ plural: 'projects', name: projectName })
    } catch (err) {
      this.logger.error(`Project crd delete error: ${err}`)
      throw err
    }

    return {}
  }

  // helpers
  async getEsProject(projectName: string, tenantId: number) {
    const esProject = await this.eSService.getById<IESProjectDetailResponse>(ESIndex.PROJECT, projectName)

    if (!esProject) {
      throw new NotFoundException(`Can not find project: ${projectName}`)
    }

    if (esProject.tenant !== tenantId.toString()) {
      throw new NotFoundException(`project ${projectName} doesn't belong to tenant ${tenantId}`)
    }

    return esProject
  }

  async getProjectTotalQuotas(
    groupName: string,
    projectName: string,
    quotaKey: string
  ): Promise<{ projectTotalCpu: number; projectTotalMemory: number }> {
    let projectTotalCpu = 0
    let projectTotalMemory = 0

    const allQuotasMap = await this.getProjectQuotasMapByName(groupName, projectName)

    Object.values(allQuotasMap).forEach((quota: IProjectQuota) => {
      const { name, cpuTotal, memoryTotal } = quota
      if (name === quotaKey) {
        projectTotalCpu += cpuTotal
        projectTotalMemory += memoryTotal
      }
    })

    return {
      projectTotalCpu,
      projectTotalMemory: projectTotalMemory * GI_B_TO_BYTE
    }
  }

  async getProjectUsageByGroupClusterEnvCID(
    tenantId: string,
    cluster: string,
    env: string,
    cid: string
  ): Promise<Array<IProjectUsage>> {
    const { documents: projectUsageList } = (await this.eSService.booleanQueryAll<IProjectUsage>(
      ESIndex.PROJECT_USAGE,
      {
        must: [{ term: { tenant: tenantId } }, { term: { env } }, { term: { cid } }, { term: { cluster } }]
      },
      ES_MAX_SEARCH_COUNT
    )) as any

    // fix: project usage data duplicate
    const uniqueProjectUsageList: IProjectUsage[] = uniqWith(
      projectUsageList,
      (item1: IProjectUsage, item2: IProjectUsage) => {
        return (
          item1.cid === item2.cid &&
          item1.project === item2.project &&
          item1.tenant === item2.tenant &&
          item1.env === item2.env &&
          item1.cluster === item2.cluster
        )
      }
    )

    return uniqueProjectUsageList.map((projectUsage: any) => {
      projectUsage.detail = JSON.parse(projectUsage.detail)
      return projectUsage
    }) as Array<IProjectUsage>
  }

  async getGroupProjectsQuotasFromES(tenantId: number): Promise<Array<IProjectQuotas>> {
    const { documents } = await this.getProjectsQuotasByTenant(tenantId)
    const groupProjectsQuotas = documents.map((document) => {
      const projectQuotas: IProjectQuotas = {
        project: document.project,
        group: document.group,
        quotas: JSON.parse(document.quotas)
      }
      return projectQuotas
    })

    return groupProjectsQuotas
  }

  async updateQuotas(
    tenantId: number,
    projectName: string,
    body: { projectQuotas: IProjectQuota[] },
    authToken: string
  ): Promise<IProjectQuotaMap> {
    const { projectQuotas } = body || {}
    if (!projectQuotas) {
      throw new HttpException('Can not find projectQuotas in request body!', HttpStatus.BAD_REQUEST)
    }
    const esProject = await this.getEsProject(projectName, tenantId)

    const { clusters: clusterProjectQuotas } = await this.getQuotas(tenantId, projectName, authToken, esProject)
    const oldQuotas = []
    clusterProjectQuotas.forEach((quotasWrap) => {
      oldQuotas.push(...quotasWrap.resourceQuotas)
    })

    const oldQuotasMap = {}
    oldQuotas.forEach((quota) => {
      oldQuotasMap[quota.name] = quota
    })

    const newQuotasMap = {}
    projectQuotas.forEach((quota) => {
      // check if quota exist
      if (!oldQuotasMap[quota.name]) {
        throw new HttpException(`Can not find quota ${quota.name} in project ${projectName}`, HttpStatus.BAD_REQUEST)
      }
      newQuotasMap[quota.name] = quota
    })

    const newQuotas = oldQuotas.map((quota) => {
      const newQuota = newQuotasMap[quota.name]
      // check total range
      if (newQuota) {
        // if (newQuota.cpuTotal < quota.cpu.applied || newQuota.cpuTotal > quota.cpu.limit) {
        //   throw new HttpException('Request cpu range Invalid', HttpStatus.BAD_REQUEST)
        // }
        // if (newQuota.memoryTotal < quota.memory.applied || newQuota.memoryTotal > quota.memory.limit) {
        //   throw new HttpException('Request memory range Invalid', HttpStatus.BAD_REQUEST)
        // }
        quota.cpu.total = newQuota.cpuTotal
        quota.memory.total = newQuota.memoryTotal
      }
      return quota
    })

    const projectCrdQuotas = newQuotas.map((quota) => {
      const { name, cpu, memory } = quota || {}
      const { clusterName, env } = parseClusterQuotaName(name)

      if (!cpu || !memory) {
        throw new HttpException(`Can not find quota ${name} in project ${projectName}`, HttpStatus.BAD_REQUEST)
      }

      return {
        name,
        cluster: clusterName,
        env,
        cpu: roundToTwo(cpu.total),
        memory: isNaN(roundToTwo(memory.total)) ? null : roundToTwo(memory.total) + 'Gi'
      }
    })

    const projectCustomObject = {
      name: projectName,
      plural: PROJECT_CRD.PLURAL
    }

    const { body: projectCrd } = await this.apiServerService.get<IProjectCrdObject>(projectCustomObject)
    const newCrdObject = {
      ...projectCrd,
      spec: {
        ...projectCrd.spec,
        quotas: projectCrdQuotas
      }
    }

    await this.apiServerService.replace({ ...projectCustomObject, crdObject: newCrdObject })

    return newQuotasMap
  }

  async getQuotaDetail({
    projectQuotasMap,
    groupName,
    projectName,
    quotaName,
    env,
    esProject
  }: {
    projectQuotasMap: IProjectQuotaMap
    groupName: string
    projectName: string
    quotaName: string
    env: string
    esProject: IESProjectDetailResponse
  }): Promise<IDetail> {
    const { groupLimitCpu, groupLimitMemory } = await this.groupsService.getGroupLimitQuotas(groupName, quotaName)
    const { groupTotalCpu, groupTotalMemory } = await this.groupsService.getGroupTotalQuotas(groupName, quotaName)
    const { cpuTotal: projectTotalCpu, memoryTotal: projectTotalMemory } = projectQuotasMap[quotaName] || {}

    const metricsList = await this.getMetricsList({ relations: esProject.relations, groupName, projectName, quotaName })

    try {
      const { cpu, memory } = calculateMetricsList(metricsList)
      return {
        name: generateQuotaName(quotaName),
        envName: env,
        cpu: {
          used: cpu.used,
          assigned: cpu.applied,
          total: projectTotalCpu,
          limit: groupLimitCpu - groupTotalCpu + projectTotalCpu
        },
        memory: {
          used: memory.used / GI_B_TO_BYTE,
          assigned: memory.applied / GI_B_TO_BYTE,
          total: projectTotalMemory,
          limit: groupLimitMemory - groupTotalMemory + projectTotalMemory
        }
      }
    } catch (e) {
      this.logger.error(`Failed to calculate metrics: metricsList: ${metricsList}: ${e}`)
      throw new InternalServerErrorException(`Failed to calculate metrics: ${e}`)
    }
  }

  async getMetricsList({
    relations,
    groupName,
    projectName,
    quotaName
  }: {
    relations: string[]
    groupName: string
    projectName: string
    quotaName: string
  }): Promise<IMetricResponse[]> {
    const requestList = []
    const map = {}

    const { clusterName } = parseClusterId(quotaName)
    const { config: token } = await this.clustersService.findByName(clusterName)

    try {
      relations.forEach((clusterId) => {
        if (generateQuotaName(clusterId) !== generateQuotaName(quotaName)) {
          return
        }

        const { env } = parseClusterId(clusterId)
        if (!map[env]) {
          map[env] = true
          const requests = generateRequestList({
            token,
            tenantName: groupName,
            envName: env,
            otherParams: { project: projectName }
          })
          requestList.push(...requests)
        }
      })
    } catch (e) {
      this.logger.error(`Failed to get metrics list: quotaName:${quotaName}, relations: ${relations}: ${e}`)
      throw new InternalServerErrorException(`Failed to get metrics list: ${e}`)
    }

    return Promise.all(requestList.map(({ token, path }) => this.metricsService.request<IMetricResponse>(path, token)))
  }

  async getProjectQuotasMapByName(tenantId: string, projectName: string): Promise<IProjectQuotaMap> {
    const queryParam = {
      must: [
        {
          term: { tenant: tenantId }
        },
        {
          term: { project: projectName }
        }
      ]
    }

    const projectEsQuotas = await this.eSService.booleanQueryFirst<IProjectQuotas>(ESIndex.PROJECT_QUOTAS, queryParam)

    if (!projectEsQuotas) {
      return {}
    }

    try {
      projectEsQuotas.quotas = JSON.parse((projectEsQuotas.quotas as unknown) as string)
    } catch (e) {
      throw new InternalServerErrorException('Can not parse project quotas')
    }

    return projectEsQuotas.quotas.Quotas
  }

  async checkIngressAndApp(groupName, projectName, esIndex, extraParam = null) {
    const queryParam = {
      must: [
        {
          term: { group: groupName }
        },
        {
          term: { project: projectName }
        }
      ]
    }
    if (extraParam) queryParam.must.push(extraParam)
    return await this.eSService.booleanQueryAll(esIndex, queryParam)
  }

  async getWhiteListProject(groupName: string, projectName: string): Promise<IWhiteListProject> {
    return this.eSService.booleanQueryFirst<IWhiteListProject>(ESIndex.PROJECT_WHITE_LIST, {
      must: [
        {
          term: {
            group: groupName
          }
        },
        {
          term: {
            project: projectName
          }
        }
      ]
    })
  }

  async transferProject(
    sourceTenantId: number,
    targetTenantId: number,
    projectName: string
  ): Promise<ITransferProjectResponse> {
    const getAppNamespaceCustomObject: IGetOrDeleteNamespacedCustomObject = {
      plural: PROJECT_CRD.PLURAL,
      name: projectName
    }

    const {
      body: { spec: oldProjectCrd }
    } = await this.apiServerService.get<IProjectCrdObject>(getAppNamespaceCustomObject)
    if (sourceTenantId.toString() !== oldProjectCrd.tenant) {
      throw new BadRequestException(`project ${projectName} doesn't belong to this tenant ${sourceTenantId}`)
    }
    if (sourceTenantId === targetTenantId) {
      throw new BadRequestException('source and target tenant can not be same')
    }

    const updateProjectCrd = {
      apiVersion: 'app.kubernetes.devops.i.sz.shopee.io/v1',
      kind: 'Project',
      metadata: {
        name: projectName
      },
      spec: {
        ...oldProjectCrd,
        tenant: targetTenantId.toString()
      }
    }
    const updateProjectCrdPayload: IPatchOrReplaceNamespacedCustomObject<IProjectCrdObject> = {
      crdObject: updateProjectCrd,
      plural: 'projects',
      name: projectName
    }

    try {
      await this.apiServerService.replace(updateProjectCrdPayload)
    } catch (err) {
      this.logger.error(`Project crd update error: ${err}`)
      throw err
    }

    return {
      tenantId: parseInt(updateProjectCrdPayload.crdObject.spec.tenant),
      name: updateProjectCrdPayload.crdObject.metadata.name
    }
  }

  /**
   * query ESIndex.PROJECT from es
   * @param tenantId
   * @returns
   */
  async getProjectsByTenant(tenantId: number) {
    const { documents, total } = await this.eSService.termQueryAll<IESProjectDetailResponse>(
      ESIndex.PROJECT,
      'tenant',
      tenantId,
      ES_MAX_SEARCH_COUNT
    )
    return {
      documents,
      total
    }
  }

  /**
   * query ESIndex.PROJECT_QUOTAS from es
   * @param tenantId
   * @returns
   */
  async getProjectsQuotasByTenant(tenantId: number) {
    const { documents, total } = await this.eSService.termQueryAll<IProjectQuotasInES>(
      ESIndex.PROJECT_QUOTAS,
      'tenant',
      tenantId,
      ES_MAX_SEARCH_COUNT
    )
    return {
      documents,
      total
    }
  }
}
