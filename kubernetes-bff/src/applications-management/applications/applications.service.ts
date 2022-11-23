import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { ESService } from 'common/modules/es/es.service'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { AgentService } from 'common/modules/agent/agent.service'

import {
  ICreateApplicationDto,
  IApplicationTemplate
} from 'applications-management/applications/dto/create-application.dto'
import { IESApplication } from 'applications-management/applications/entities/application.entity'
import {
  APPLICATION_CRD,
  GROUP,
  NAMESPACE_PREFIX,
  APPLICATION_INSTANCE_CRD,
  APPLICATION_INSTANCE_OAM_CRD
} from 'common/constants/apiServer.constants'
import { ESIndex, ES_MAX_SEARCH_COUNT, ES_DEFAULT_OFFSET } from 'common/constants/es'
import { SPECIAL_APPLICATIONS_ENV } from 'common/constants/env'

import { ApplicationParamsDto, ApplicationsParamsDto } from 'applications-management/applications/dto/common/params.dto'
import {
  IListCrdBody,
  IApplicationCrdObject,
  IApplicationInstanceCrdObject,
  ICreateNamespacedCustomObject,
  IGetOrDeleteNamespacedCustomObject,
  IListNamespacedCustomObject,
  IDeploySpec,
  IApplicationInstanceOamCrdObject,
  IGlobalConfig
} from 'common/interfaces'

import { ApplicationDeploysQueryDto } from 'applications-management/applications/dto/get-applicationDeploys.dto'
import { map, flatten, uniq, toLower, mapValues, sumBy, sortBy, countBy, partition } from 'lodash'
import {
  DESIRED_CANARY_REPLICASANNOTATION,
  DESIRED_REPLICASANNOTATION,
  PHASE,
  PHASE_CANARY,
  PHASE_RELEASE
} from 'common/constants/deployment'
import { populateDeploymentWithAuthInfo, getPhaseFromStableUpper } from 'common/helpers/deployment'
import { checkIsSubsetArray, sortResource } from 'common/helpers/array'
import { removeEmpty, hasSameKeys } from 'common/helpers/object'
import {
  IGetApplicationConfigHistory,
  IESApplicationConfig,
  IApplicationConfigHistoryListDto,
  IGetDeploymentReleaseConfig,
  IDeployInfo,
  IConfigReleaseResponseDto,
  IContainerDetailInfo,
  ICreateApplicationConfigBodyDto,
  INewApplicationConfigDto,
  IGetESApplication,
  ApplicationReplayDetailParamsDto,
  ApplicationTerminalConfigParamsDto
} from 'applications-management/applications/dto/get-applicationConfig.dto'
import { IEsBooleanQuery } from 'common/interfaces/config.interface'
import { generateClusterIdWithFteName } from 'common/helpers/cluster'

import { memoryQuantityScalar, cpuQuantityScalar } from 'common/helpers/clientNodeUtils'
import { generateProbObj } from 'common/helpers/applicationInstance'

import { V1DeploymentList, V1Deployment } from '@kubernetes/client-node'
import {
  ApplicationTerminalLogsQueryDto,
  ApplicationTerminalLogsResponseDto,
  EsTerminalLog,
  Log
} from 'applications-management/applications/dto/get-application-terminal-logs.dto'
import { getDayRangeList, getTimeRangeParams } from 'common/helpers/event'
import { getESTimeSortParams, getIndexOffsetRequestList } from 'common/helpers/log'
// import { generateProjectNamespace } from 'common/helpers/project'
// import { parseClusterId } from 'common/helpers/cluster'
import { AuthService } from 'common/modules/auth/auth.service'
import { UssService } from 'common/modules/uss/uss.service'
import { paginationHandler } from 'common/helpers/pagination'
import { parseFiltersMap } from 'common/helpers/filter'
import { esTerminalRegexpSearchBuilder } from 'common/helpers/esQueryParamBuilder'
import {
  ApplicationTerminalReplayDetailQueryDto,
  ApplicationTerminalReplaysResponseDto,
  EsTerminalReplay,
  EsTerminalReplayFileData,
  Replay
} from 'applications-management/applications/dto/get-application-terminal-replays.dto'
import { IRoleBinding } from 'common/interfaces/authService.interface'
import * as moment from 'moment'
import { WriteStream } from 'fs'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { Logger } from 'common/helpers/logger'

// huadong TODO update
type IAuthUser = any

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name)

  constructor(
    private esService: ESService,
    private projectsService: ProjectsService,
    private apiServerService: ApiServerService,
    private clustersService: ClustersService,
    private agentService: AgentService,
    private authService: AuthService,
    private ussService: UssService,
    private configService: ConfigService,
    private openApiService: OpenApiService
  ) {}

  async getApplications(params: ApplicationsParamsDto, authToken: string) {
    const { tenantId, projectName } = params
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    // validate projectName and groupName
    await this.projectsService.getEsProject(projectName, tenantId)

    const getApplicationsNamespaceCustomObject: IListNamespacedCustomObject = {
      plural: APPLICATION_CRD.PLURAL,
      namespace: `${NAMESPACE_PREFIX}${projectName}`
    }

    const namespaceApplications = await this.apiServerService.list<IListCrdBody<IApplicationCrdObject>>(
      getApplicationsNamespaceCustomObject
    )

    const { body } = namespaceApplications
    const { items = [] } = body || {}

    const apps = items.map((item) => {
      const { status, metadata } = item
      const { name } = metadata
      const { cids = [], environments = [], status: appStatus = 'Healthy' } = removeEmpty(status) || {}

      return {
        name,
        cids,
        environments,
        status: appStatus,
        tenantName,
        tenantId,
        projectName
      }
    })

    return {
      apps,
      tenantName,
      tenantId,
      projectName,
      totalCount: apps.length
    }
  }

  async getApplication(params: ApplicationParamsDto, authToken: string) {
    const { tenantId, projectName, appName } = params
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo

    // validate projectName and groupName
    await this.projectsService.getEsProject(projectName, tenantId)

    const getAppNamespaceCustomObject: IGetOrDeleteNamespacedCustomObject = {
      plural: APPLICATION_CRD.PLURAL,
      name: appName,
      namespace: `${NAMESPACE_PREFIX}${projectName}`
    }

    const applicationCrd = await this.apiServerService.get<IApplicationCrdObject>(getAppNamespaceCustomObject)

    const labels: Record<string, string> = {
      project: projectName,
      application: appName
    }

    const labelSelector = Object.entries(labels)
      .map(([key, value]) => `${key}=${value}`)
      .join(',')

    const getAppInsOamNamespaceCustomObject: IListNamespacedCustomObject = {
      plural: APPLICATION_INSTANCE_OAM_CRD.PLURAL,
      namespace: `${NAMESPACE_PREFIX}${projectName}`,
      labelSelector
    }

    const result = await this.apiServerService.list<IListCrdBody<IApplicationInstanceOamCrdObject>>(
      getAppInsOamNamespaceCustomObject
    )

    const applicationInstanceOamList = result?.body?.items || []
    const currentApplicationOamList = applicationInstanceOamList.filter((oam) => {
      return oam?.spec?.environments?.application === appName && !oam?.metadata?.labels?.feature
    })

    const podList = currentApplicationOamList.map((applicationInstanceOam) => {
      const { spec, status = {} } = applicationInstanceOam || {}
      const env = spec?.environments?.env
      const { runtimeStatus = {} } = status
      const { canaryWorkLoadStatus, workLoadStatus } = runtimeStatus

      const canaryNormalPodCount = canaryWorkLoadStatus?.readyReplicas || 0
      const canaryAbnormalPodCount = canaryWorkLoadStatus?.unavailableReplicas || 0
      const releaseNormalPodCount = workLoadStatus?.readyReplicas || 0
      const releaseAbnormalPodCount = workLoadStatus?.unavailableReplicas || 0

      const abnormalPodCount = canaryAbnormalPodCount + releaseAbnormalPodCount
      const normalPodCount = canaryNormalPodCount + releaseNormalPodCount

      return {
        name: env,
        abnormalPodCount,
        normalPodCount
      }
    })

    const envPodListMap = podList.reduce((acc, cur) => {
      const { name } = cur
      if (!acc[name]) {
        acc[name] = [cur]
      } else {
        acc[name].push(cur)
      }
      return acc
    }, {})

    const envPodMap = mapValues(
      envPodListMap,
      (data: { name: string; abnormalPodCount: number; normalPodCount: number }[]) => {
        const name = data[0].name

        return {
          name,
          abnormalPodCount: sumBy(data, (item) => item.abnormalPodCount),
          normalPodCount: sumBy(data, (item) => item.normalPodCount)
        }
      }
    )

    const { spec, status } = applicationCrd.body
    const { cids = [], clusters = [] } = status || {}

    const projectDetail = await this.projectsService.getDetail(tenantId, projectName, authToken)
    const projectEnvs = projectDetail?.envs

    return {
      name: appName,
      tenantName,
      tenantId,
      projectName: spec.project,
      cids,
      clusters,
      envs: sortBy(Object.keys(envPodMap)),
      envPods: envPodMap,
      projectEnvs
    }
  }

  async createApplication(
    tenantId: string,
    projectName: string,
    authToken: string,
    createApplicationDto: ICreateApplicationDto
  ): Promise<IApplicationTemplate> {
    if (!projectName) {
      throw new HttpException('ProjectName is invalid', HttpStatus.BAD_REQUEST)
    }

    const applicationTemplate: IApplicationTemplate = {
      project: projectName,
      app: createApplicationDto.appName
    }

    const applicationQueryParam = {
      must: [
        {
          term: { project: projectName }
        },
        {
          term: { app: createApplicationDto.appName }
        }
      ]
    }

    // add application to crd
    const existedApplication = await this.esService.booleanQueryFirst(ESIndex.APPLICATION, applicationQueryParam)
    if (existedApplication) {
      this.logger.error(`K8s application name ${createApplicationDto.appName} is already existed`)
      throw new HttpException('K8s application name is already existed', HttpStatus.BAD_REQUEST)
    }

    await this.openApiService.createApplication(tenantId, projectName, createApplicationDto.appName, authToken)
    // add application template to es
    const existedTemplate: any = await this.esService.booleanQueryFirst(
      ESIndex.APPLICATION_TEMPLATE,
      applicationQueryParam,
      (hits) => hits
    )

    try {
      if (existedTemplate) {
        await this.esService.update(ESIndex.APPLICATION_TEMPLATE, existedTemplate._id, applicationTemplate)
      } else {
        await this.esService.index(ESIndex.APPLICATION_TEMPLATE, applicationTemplate)
      }

      return applicationTemplate
    } catch (e) {
      throw new HttpException(`Failed to create application template to es: ${e.message}`, e.code)
    }
  }

  async deleteApplication(tenantId: number, projectName: string, name: string): Promise<any> {
    if (!projectName) {
      throw new HttpException('ProjectName is invalid', HttpStatus.BAD_REQUEST)
    }

    // validate projectName and groupName
    await this.projectsService.getEsProject(projectName, tenantId)

    const deleteNamespaceCustomObject: IGetOrDeleteNamespacedCustomObject = {
      plural: APPLICATION_CRD.PLURAL,
      name,
      namespace: `${NAMESPACE_PREFIX}${projectName}`
    }

    // 跟叶老师对接结果:
    // 后端关于Ingress的逻辑有问题，可能需要重构，所以check ingress和delete service的逻辑先注释掉

    // const { documents: esClusterList } = await this.clustersService.getAllClusters()
    // const clusterMap: any = {}
    // esClusterList.forEach((cluster) => {
    //   clusterMap[cluster.name] = cluster
    // })

    // // check ingress
    // const ingressQueryParam = {
    //   must: [
    //     {
    //       term: { group: groupName }
    //     },
    //     {
    //       term: { project: projectName }
    //     },
    //     {
    //       term: { status: 'normal' }
    //     }
    //   ]
    // }
    // const { documents: ingressList } = await this.esService.booleanQueryAll<any>(ESIndex.INGRESS, ingressQueryParam)

    // const deleteServiceRequestList = []
    // ingressList.map(async (ingress: any) => {
    //   const { cluster, rules } = ingress
    //   const { clusterName, env, cid } = parseClusterId(cluster)
    //   const projectNamespace = generateProjectNamespace(projectName, env, cid)
    //   const esCluster = clusterMap[clusterName]

    //   if (!esCluster) {
    //     this.logger.error(`cluster ${clusterName} in ingress ${ingress.name} does not exist`)
    //     throw new HttpException('Failed to get information from backend service', HttpStatus.NOT_FOUND)
    //   }

    //   const formattedRules = JSON.parse(rules)
    //   const serviceFlagMap = {}
    //   formattedRules.map(async (rule) => {
    //     const { config: token } = esCluster
    //     const { serviceName } = rule
    //     if (serviceFlagMap[serviceName]) {
    //       return
    //     }
    //     serviceFlagMap[serviceName] = true
    //     deleteServiceRequestList.push({
    //       namespace: projectNamespace,
    //       name: serviceName,
    //       token,
    //       cluster // clusterId
    //     })
    //     const result = await this.agentService.request<any>('servicedeployments', true, token, {
    //       namespace: projectNamespace,
    //       name: serviceName
    //     })
    //     // TODO: check service
    //   })
    // })

    try {
      // delete application crd
      await this.apiServerService.delete(deleteNamespaceCustomObject)
      // delete service from k8s
      // await Promise.all(
      //   deleteServiceRequestList.map((request) => {
      //     const { namespace, name, token } = request
      //     return this.agentService.request<any>('deleteService', true, token, {
      //       namespace,
      //       name
      //     })
      //   })
      // )
      return {}
    } catch (err) {
      this.logger.error(`Fail to delete application for status: ${err}`)
      throw err
    }
  }

  async getApplicationDeploysInfo(params: ApplicationParamsDto, authToken: string) {
    const { tenantId, projectName, appName } = params
    await this.authService.getTenantById(tenantId, authToken)
    // validate projectName and groupName
    await this.projectsService.getEsProject(projectName, tenantId)

    const getAppNamespaceCustomObject: IGetOrDeleteNamespacedCustomObject = {
      plural: APPLICATION_CRD.PLURAL,
      name: appName,
      namespace: `${NAMESPACE_PREFIX}${projectName}`
    }

    const applicationCrd = await this.apiServerService.get<IApplicationCrdObject>(getAppNamespaceCustomObject)
    const { status } = applicationCrd.body
    const { cids = [], clusters = [] } = status || {}

    const labels: Record<string, string> = {
      project: projectName,
      application: appName
    }

    const labelSelector = Object.entries(labels)
      .map(([key, value]) => `${key}=${value}`)
      .join(',')

    const getAppInsOamNamespaceCustomObject: IListNamespacedCustomObject = {
      plural: APPLICATION_INSTANCE_OAM_CRD.PLURAL,
      namespace: `${NAMESPACE_PREFIX}${projectName}`,
      labelSelector
    }
    const result = await this.apiServerService.list<IListCrdBody<IApplicationInstanceOamCrdObject>>(
      getAppInsOamNamespaceCustomObject
    )

    const applicationInstanceOamList = result?.body?.items || []
    const currentApplicationOamList = applicationInstanceOamList.filter((oam) => {
      return oam?.spec?.environments?.application === appName
    })
    const envsCount = countBy(currentApplicationOamList, (currentApplicationOam) => {
      const env = currentApplicationOam?.spec?.environments?.env || ''
      const feature = currentApplicationOam?.metadata?.labels?.feature || ''
      const isPfb = feature && feature.indexOf('pfb-') > -1
      const isFte = feature && !isPfb

      if (isFte) {
        return SPECIAL_APPLICATIONS_ENV.FTE
      }
      if (isPfb) {
        return SPECIAL_APPLICATIONS_ENV.PFB
      }
      return env
    })

    const rawEnvs = Object.keys(envsCount)
    const splitEnvs = partition(rawEnvs, (item) => Object.keys(SPECIAL_APPLICATIONS_ENV).indexOf(item) === -1)
    const [normalEnvs, fteEnv] = splitEnvs

    return {
      name: appName,
      cids: sortBy(cids),
      clusters: sortBy(clusters),
      envs: sortBy(normalEnvs).concat(fteEnv)
    }
  }

  // helpers
  async getEsApplicationByName(projectName: string, applicationName: string): Promise<IESApplication> {
    const applicationQueryParam = {
      must: [
        {
          term: { project: projectName }
        },
        {
          term: { app: applicationName }
        }
      ]
    }

    const esApplication = await this.esService.booleanQueryFirst<IESApplication>(
      ESIndex.APPLICATION,
      applicationQueryParam
    )
    if (!esApplication) {
      throw new HttpException(`Can not find application: ${applicationName}`, HttpStatus.NOT_FOUND)
    }

    if (esApplication.project !== projectName) {
      throw new BadRequestException(`Invalid project name: ${projectName}`)
    }

    return esApplication
  }

  async getApplicationDeploys(params: ApplicationParamsDto, query: ApplicationDeploysQueryDto, authToken: string) {
    const { tenantId, projectName, appName } = params
    const { cid, env, cluster } = query
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    // validate projectName and groupName
    await this.projectsService.getEsProject(projectName, tenantId)

    const listApplicationInstancesNamespaceCustomObject: IListNamespacedCustomObject = {
      plural: APPLICATION_INSTANCE_CRD.PLURAL,
      namespace: `${NAMESPACE_PREFIX}${projectName}`
    }

    const namespaceApplicationInstances = await this.apiServerService.list<IListCrdBody<IApplicationInstanceCrdObject>>(
      listApplicationInstancesNamespaceCustomObject
    )

    const { body } = namespaceApplicationInstances
    const { items = [] } = body || {}

    const applicationInstances = items.filter((item) => {
      const { spec } = item
      const { status } = item
      const { phase = [] } = status || {}
      const isFte = !phase.find((value) => value === PHASE.RELEASE)
      let isMatch = true

      if (appName !== spec.application) {
        isMatch = false
      }

      if (env) {
        if (env === PHASE.FTE && !isFte) {
          isMatch = false
        } else if (env !== PHASE.FTE && (env !== spec.env || isFte)) {
          isMatch = false
        }
      }

      if (!!cid && !checkIsSubsetArray([spec.cid], cid.split(':'))) {
        isMatch = false
      }

      if (!!cluster && !checkIsSubsetArray([spec.cluster], cluster.split(':'))) {
        isMatch = false
      }

      return isMatch
    })

    const globalConfig = this.configService.get<IGlobalConfig>('global')
    const { deleteDeploymentConfig } = globalConfig
    const { allowDeleteClusters = [], prohibitDeleteProjects = [] } = deleteDeploymentConfig

    const deploys = applicationInstances.map((applicationInstance) => {
      const { spec, status, metadata } = applicationInstance
      const {
        deploySpec = { containers: [], replicas: 0 } as IDeploySpec,
        canaryDeploySpec = { containers: [], replicas: 0 } as IDeploySpec,
        cluster,
        application,
        project,
        cid,
        env
      } = spec
      const { runningPodCount = 0, abnormalPodCount = 0, status: deployStatus, phase, updateTime } = status || {}

      const deployAuth = populateDeploymentWithAuthInfo(phase, '')
      const { rollbackable, scalable, fullreleaseable, restartable } = deployAuth

      const containers = [].concat(deploySpec.containers, canaryDeploySpec.containers).map((container) => {
        const { image = '', name = '' } = container

        return {
          name,
          image,
          tag: image.split(':')[1] || ''
        }
      })

      const formattedPhase = phase
        .map((item) => {
          if (item !== PHASE_RELEASE && item !== PHASE_CANARY) {
            return toLower(item)
          }
          return item
        })
        .sort()
        .reverse() // canary => ["RELEASE", "CANARY"]
        .join('/')

      const isFtePhase = !phase.find((item) => item === PHASE_RELEASE) && !phase.find((item) => item === PHASE_CANARY)
      const clusterId = `${isFtePhase ? formattedPhase : ''}:${env}-${cid}:${cluster}`

      const { annotations = {} } = metadata
      const desiredReplicas = annotations[DESIRED_REPLICASANNOTATION]
      const desiredCanaryReplicas = annotations[DESIRED_CANARY_REPLICASANNOTATION]

      const { replicas = 0 } = deploySpec
      const { replicas: canaryReplicas = 0 } = canaryDeploySpec

      const desiredPodCount: number =
        desiredReplicas && desiredCanaryReplicas
          ? parseInt(desiredReplicas) + parseInt(desiredCanaryReplicas)
          : replicas + canaryReplicas

      const deletable =
        allowDeleteClusters.includes(cluster) && !prohibitDeleteProjects.includes(project) && desiredPodCount === 0

      return {
        name: `${application}-${toLower(env)}-${toLower(cid)}`,
        status: deployStatus,
        containers,
        phase: formattedPhase,
        updateTime,
        clusterId,
        clusterName: cluster,
        podCount: desiredPodCount,
        runningPodCount,
        abnormalPodCount,
        scalable,
        restartable,
        rollbackable,
        fullreleaseable,
        deletable,
        releaseCount: desiredReplicas ? parseInt(desiredReplicas) : replicas,
        canaryCount: desiredCanaryReplicas ? parseInt(desiredCanaryReplicas) : canaryReplicas,
        appInstanceName: '' // mock data for oam
      }
    })

    const phaseList = uniq(flatten(map(deploys, 'phase')))

    const { items: paginatedDeploys, total } = paginationHandler(deploys, query, 'name')

    return {
      appName,
      projectName,
      groupName: tenantName,
      deploys: paginatedDeploys,
      phaseList,
      totalCount: total
    }
  }

  async getClustersByApp(params: ApplicationParamsDto, authToken: string): Promise<string[]> {
    const { tenantId, projectName, appName } = params
    await this.authService.getTenantById(tenantId, authToken)
    // validate projectName and groupName
    await this.projectsService.getEsProject(projectName, tenantId)

    const getAppNamespaceCustomObject: IGetOrDeleteNamespacedCustomObject = {
      plural: APPLICATION_CRD.PLURAL,
      name: appName,
      namespace: `${NAMESPACE_PREFIX}${projectName}`
    }

    const applicationCrd = await this.apiServerService.get<IApplicationCrdObject>(getAppNamespaceCustomObject)
    const clusters = applicationCrd?.body?.status?.clusters ?? []
    return clusters
  }

  async getApplicationConfigHistoryList({
    tenantId,
    projectName,
    appName,
    env,
    cluster,
    searchBy
  }: IGetApplicationConfigHistory): Promise<IApplicationConfigHistoryListDto> {
    await this.getApplicationInfoFromES({ tenantId, projectName, appName, env, cluster })

    // query requesting data
    const esApplicationConfigList = await this.getEsApplicationConfigList({
      tenantId,
      projectName,
      appName,
      env,
      cluster,
      searchBy
    })
    const { total, documents } = esApplicationConfigList

    return { count: total, items: documents }
  }

  async getApplicationInfoFromES({ tenantId, projectName, appName, env, cluster }: IGetESApplication) {
    const projectInfo = await this.projectsService.getEsProject(projectName, tenantId)
    const { environments, clusters } = projectInfo
    if (!environments.includes(env) || !clusters.includes(cluster)) {
      throw new BadRequestException(`Request cluster ${cluster} or env ${env} not found!`)
    }

    const applicationInfo = await this.getEsApplicationByName(projectName, appName)

    return { projectInfo, applicationInfo }
  }

  async getEsApplicationConfigList({ projectName, appName, env, cluster, searchBy }: IGetApplicationConfigHistory) {
    const query: IEsBooleanQuery = {
      must: [
        {
          term: { env }
        },
        {
          term: { cluster }
        },
        {
          term: { project: projectName }
        },
        {
          term: { application: appName }
        }
      ]
    }
    if (searchBy) {
      query.filter = {
        wildcard: {
          operator: searchBy
        }
      }
    }
    const sort = ['createTime:desc']

    try {
      const applicationConfigList = await this.esService.booleanQueryAll<IESApplicationConfig>(
        ESIndex.APPLICATION_CONFIG,
        query,
        ES_MAX_SEARCH_COUNT,
        ES_DEFAULT_OFFSET,
        sort
      )
      return applicationConfigList
    } catch (err) {
      throw new InternalServerErrorException(`get es application config error: ${err}`)
    }
  }

  async getApplicationReleaseConfig({ tenantId, projectName, appName, env, cluster }: IGetApplicationConfigHistory) {
    // check
    const { projectInfo } = await this.getApplicationInfoFromES({ tenantId, projectName, appName, env, cluster })

    const configRelease = await this.getDeploymentReleaseConfig({
      projectName,
      appName,
      env,
      cluster,
      cids: projectInfo.cids
    })
    return configRelease
  }

  async getDeploymentReleaseConfig({
    projectName,
    appName,
    env,
    cluster,
    cids
  }: IGetDeploymentReleaseConfig): Promise<IConfigReleaseResponseDto> {
    const clusterInfo = await this.clustersService.findByName(cluster)
    const { config, name } = clusterInfo
    const labelsSelect = {
      // group: groupName.replace(/ /g, '-'),
      project: projectName,
      application: appName,
      env: env.toLowerCase()
    }
    const deploys = await this.getDeploysByLabelsSelect(String(config), name, labelsSelect)

    // filter deploys by cid and phase
    const { items } = deploys || {}
    if (items) {
      const applicationDeployList = items.filter((deploy) => {
        const {
          metadata: { labels }
        } = deploy

        const { cid } = labels
        const phase = getPhaseFromStableUpper(labels)
        return cids.includes(cid.toUpperCase()) && phase === PHASE.RELEASE
      })

      const deployInfoList = this.generateDeployInfoList(cluster, applicationDeployList)

      return this.transformDeployInfoToReleaseConfig(deployInfoList)
    }

    // {} as IConfigReleaseResponseDto will call error
    return {} as any
  }

  private async getDeploysByLabelsSelect(
    clusterConfig: string,
    clusterName: string,
    labelsSelect: Record<string, string>
  ): Promise<V1DeploymentList> {
    const body = { labesSelect: JSON.stringify(labelsSelect) }
    try {
      const deploys = await this.agentService.request<V1DeploymentList>(
        'getdeploysbylabelselect',
        true,
        { config: clusterConfig, clusterName },
        body
      )
      return deploys
    } catch (err) {
      throw new InternalServerErrorException(`Get agent deploys error: ${err}`)
    }
  }

  private generateDeployInfoList(cluster: string, deployReplicaSetList: V1Deployment[]): IDeployInfo[] {
    const deployInfoList = deployReplicaSetList.map((deploy) => {
      const {
        metadata: {
          labels: { env, cid, feature }
        }
      } = deploy

      const clusterId = generateClusterIdWithFteName(env, cid, cluster, feature)

      const deployInfo = this.parseAppFteDeployInfo(deploy, clusterId)
      return deployInfo
    })

    const orderedDeployInfoList = sortResource(deployInfoList, 'clusterId')
    return orderedDeployInfoList
  }

  private parseAppFteDeployInfo(deploy: V1Deployment, clusterId: string): IDeployInfo {
    const {
      metadata: { labels },
      spec: {
        template: {
          spec: { containers }
        },
        strategy: {
          type,
          rollingUpdate: { maxSurge, maxUnavailable }
        }
      }
    } = deploy

    const { feature } = labels

    const clusterIdItems = clusterId.split(':')
    const hasNoFeature = clusterIdItems.length === 2
    const phase = hasNoFeature ? getPhaseFromStableUpper(labels) : feature

    // find valid container values
    let deployEnvs
    let deployReadinessProbe, deployLivenessProbe, deployLifeCycle
    let deployVolumes

    const containersDetail = containers.map((container) => {
      const { name, image, resources, readinessProbe, livenessProbe, lifecycle } = container

      const { requests = {}, limits = {} } = resources || {}

      const { cpu: requestCpu = '0', memory: requestMemory = '0' } = requests
      const { cpu: limitCpu = '0', memory: limitMemory = '0' } = limits

      const readiness = readinessProbe && generateProbObj(readinessProbe)
      const liveness = livenessProbe && generateProbObj(livenessProbe)
      const { postStart, preStop } = lifecycle || {}

      const containerDetail: IContainerDetailInfo = {
        name,
        image,
        cpuRequest: cpuQuantityScalar(requestCpu),
        memRequest: memoryQuantityScalar(requestMemory),
        cpuLimit: cpuQuantityScalar(limitCpu),
        memLimit: memoryQuantityScalar(limitMemory),
        healthCheck: { readinessProbe: readiness || {}, livenessProbe: liveness || {} },
        lifeCycle: { postStart: postStart && JSON.stringify(postStart), preStop: preStop && JSON.stringify(preStop) }
      }

      // find useful values in all containers
      const { env, volumeMounts } = container
      env && env.length && (deployEnvs = env)
      readinessProbe && (deployReadinessProbe = readinessProbe)
      livenessProbe && (deployLivenessProbe = livenessProbe)
      lifecycle && (deployLifeCycle = lifecycle)
      volumeMounts && (deployVolumes = volumeMounts)

      return containerDetail
    })

    const deployInfo: IDeployInfo = {
      containersDetail,
      phase,
      envs: deployEnvs,
      readinessProbe: deployReadinessProbe,
      livenessProbe: deployLivenessProbe,
      lifecycle: deployLifeCycle,
      volumes: deployVolumes,
      strategy: type,
      rollingUpdateStrategy: { maxSurge, maxUnavailable }
    }

    return deployInfo
  }

  private transformDeployInfoToReleaseConfig(deployInfoList: IDeployInfo[]): IConfigReleaseResponseDto {
    if (deployInfoList.length <= 0) {
      throw new NotFoundException('Can not get deploy info!')
    }

    const phaseObj = deployInfoList.reduce((obj, deploy) => {
      const { phase, containersDetail } = deploy
      obj[phase] = containersDetail
      return obj
    }, {})

    // Only once
    const deployInfo = deployInfoList[0]
    const { strategy, rollingUpdateStrategy, readinessProbe, livenessProbe, lifecycle, volumes, envs } = deployInfo

    const { maxSurge, maxUnavailable } = rollingUpdateStrategy || {}
    const strategyType = {
      type: strategy,
      value: { maxSurge: String(maxSurge), maxUnavailable: String(maxUnavailable) }
    }
    const readiness = readinessProbe ? generateProbObj(readinessProbe) : {}
    const liveness = livenessProbe ? generateProbObj(livenessProbe) : {}

    const { postStart, preStop } = lifecycle || {}

    const needSpex = volumes ? !!volumes.filter((volume) => /spex/.test(volume.mountPath)).length : false

    const validEnvironments = envs ? envs.filter((env) => !env.valueFrom) : []
    const environments = validEnvironments.map((env) => ({ name: env.name, value: env.value }))

    const releaseConfig: IConfigReleaseResponseDto = {
      phase: phaseObj,
      strategyType,
      healthCheck: { readinessProbe: readiness, livenessProbe: liveness },
      lifeCycle: { postStart: postStart && JSON.stringify(postStart), preStop: preStop && JSON.stringify(preStop) },
      needSpex,
      environments: environments.length ? environments : undefined
    }

    return releaseConfig
  }

  async getApplicationLatestConfig({
    tenantId,
    projectName,
    appName,
    env,
    cluster
  }: IGetApplicationConfigHistory): Promise<IESApplicationConfig | IConfigReleaseResponseDto> {
    const { projectInfo } = await this.getApplicationInfoFromES({ tenantId, projectName, appName, env, cluster })

    const esApplicationConfigList = await this.getEsApplicationConfigList({
      tenantId,
      projectName,
      appName,
      env,
      cluster
    })
    const { total, documents } = esApplicationConfigList

    if (total) {
      return documents[0]
    }

    // if ES has no config history, return release config
    const configRelease = await this.getDeploymentReleaseConfig({
      projectName,
      appName,
      env,
      cluster,
      cids: projectInfo.cids
    })

    return configRelease
  }

  async checkApplicationConfig(
    tenantId: number,
    projectName: string,
    appName: string,
    config: ICreateApplicationConfigBodyDto,
    authToken: string
  ) {
    await this.authService.getTenantById(tenantId, authToken)
    const applicationDetail = await this.getApplication({ tenantId, projectName, appName }, authToken)
    const { clusters, envs } = applicationDetail
    const { cluster, env } = config

    // make sure requested cluster and env match with resource
    if (!clusters.includes(cluster)) {
      throw new BadRequestException(`Request cluster ${cluster} does not match this resource!`)
    }
    if (!envs.includes(env)) {
      throw new BadRequestException(`Request env ${env} does not match this resource!`)
    }

    // make sure requested cluster, project and application available
    const clusterInfo = await this.clustersService.getDetail(cluster)
    if (!clusterInfo) {
      return new NotFoundException(`Request cluster ${cluster} not found!`)
    }
    await this.getEsApplicationByName(projectName, appName)
    await this.projectsService.getEsProject(projectName, tenantId)

    // make sure request config phase has the same keys with that of current config
    const latestConfig = await this.getApplicationLatestConfig({
      tenantId,
      projectName,
      appName,
      env,
      cluster
    })

    const resourcePhase = latestConfig.phase
    const requestPhase = config.phase

    const isRequestValid = hasSameKeys(resourcePhase, requestPhase)
    if (!isRequestValid) {
      throw new BadRequestException('Request phase of body is invalid!')
    }

    // make sure request cpu,memory valid
    Object.values(requestPhase).forEach((releaseList) => {
      releaseList.forEach((release) => {
        const { cpuRequest, memRequest, cpuLimit, memLimit } = release
        const isCpuValid = cpuRequest > 0 && cpuRequest < 16 && cpuLimit > 0 && cpuLimit < 16
        if (!isCpuValid) {
          throw new BadRequestException('Request cpu should between 0 and 16!')
        }
        const isMemValid = memRequest > 0 && memRequest < 32 && memLimit > 0 && memLimit < 32
        if (!isMemValid) {
          throw new BadRequestException('Request memory should between 0 and 32!')
        }
      })
    })
  }

  async createApplicationConfig(
    tenantId: number,
    projectName: string,
    appName: string,
    config: ICreateApplicationConfigBodyDto,
    authUser: IAuthUser,
    authToken: string
  ): Promise<INewApplicationConfigDto> {
    const { phase, strategyType, healthCheck, needSpex, lifeCycle, environments, env, cluster } = config

    // unit is second
    const createTime = Math.round(Date.now() / 1000)

    const { name: operator } = authUser
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    const newApplicationConfig: INewApplicationConfigDto = {
      createTime,
      operator,
      cluster,
      env,
      group: tenantName,
      project: projectName,
      application: appName,
      phase,
      strategyType,
      healthCheck,
      needSpex,
      lifeCycle,
      environments
    }

    try {
      // only need to write new config into ES
      await this.esService.index(ESIndex.APPLICATION_CONFIG, newApplicationConfig)
      return newApplicationConfig
    } catch (err) {
      throw new InternalServerErrorException(`Write application config to ES error: ${err}`)
    }
  }

  public async getApplicationTerminalData(
    params: ApplicationTerminalConfigParamsDto,
    query: ApplicationTerminalLogsQueryDto,
    roles: IRoleBinding[],
    operator: string,
    index: ESIndex
  ): Promise<ApplicationTerminalLogsResponseDto | ApplicationTerminalReplaysResponseDto> {
    const { tenantId, projectName, appName } = params
    const { limit, offset = 0, orderBy = '', startTime, endTime, filterBy = '' } = query
    let timeParams
    const defaultOrderBy = 'time desc'
    try {
      timeParams = getTimeRangeParams(startTime, endTime, 30)
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    }
    const { from, to } = timeParams
    const searchAllKeys =
      index === ESIndex.TERMINAL_LOG
        ? ['email', 'nodeName', 'nodeIP', 'pod', 'podIP', 'container', 'requestQuery', 'requestCmd']
        : ['email', 'nodeName', 'nodeIP', 'podName', 'podIP', 'container']
    const { totalCount, data } = await this.getTerminalDataFromEs(
      operator,
      roles,
      index,
      searchAllKeys,
      from,
      to,
      limit,
      offset,
      orderBy || defaultOrderBy,
      filterBy,
      tenantId,
      projectName,
      appName
    )
    if (!data.length) {
      return { data: [], totalCount: 0 }
    }
    const isTerminalReplayData = (logListOrReplayList: Log[] | Replay[]): logListOrReplayList is Replay[] => {
      const logOrReplay = logListOrReplayList[0]
      return 'duration' in logOrReplay
    }
    if (isTerminalReplayData(data)) {
      return {
        data,
        totalCount
      }
    }
    return {
      data,
      totalCount
    }
  }

  async searchTenantApplications(tenantId: number, projectName: string, search = '.*') {
    const appSearchResult = await this.esService.booleanQueryAll<IESApplication>(
      ESIndex.APPLICATION,
      {
        must: [
          {
            term: { tenant: tenantId }
          },
          {
            term: { project: projectName }
          },
          {
            regexp: { app: `.*${search}.*` }
          }
        ]
      },
      ES_MAX_SEARCH_COUNT,
      ES_DEFAULT_OFFSET,
      ['app:asc']
    )
    return appSearchResult
  }

  private async getTerminalDataFromEs(
    operator: string,
    roles: IRoleBinding[],
    esIndex: ESIndex,
    searchAllKeys: string[],
    from: string,
    to: string,
    limit: number,
    offset: number,
    orderBy: string,
    filterBy: string,
    tenantId: string,
    projectName: string,
    appName: string
  ) {
    const queryObject = parseFiltersMap(filterBy, true)
    const { all = [] } = queryObject
    const searchAll = all[0]

    const dayRangeList = getDayRangeList(from, to)
    const isDescOrder = orderBy.includes('desc')
    let totalCount = 0

    const esCountList = await Promise.all(
      dayRangeList.map(async ({ day, start, end }) => {
        try {
          const { total } = await this.esService.booleanQueryAll(
            `${esIndex}-${day}`,
            this.getESQueryParams(operator, roles, searchAll, searchAllKeys, tenantId, projectName, appName),
            1
          )
          totalCount += total
          return {
            total,
            day,
            start,
            end
          }
        } catch (err) {
          return {
            err,
            total: 0,
            day,
            start,
            end
          }
        }
      })
    )

    const requestList = getIndexOffsetRequestList({ esCountList, limit, offset, isDescOrder })
    const logsList = await Promise.all(
      requestList.map(async ({ day, offset, limit }) => {
        try {
          const { documents = [] } = await this.esService.booleanQueryAll(
            `${esIndex}-${day}`,
            this.getESQueryParams(operator, roles, searchAll, searchAllKeys, tenantId, projectName, appName),
            limit,
            offset,
            getESTimeSortParams(isDescOrder)
          )
          return documents
        } catch (err) {
          this.logger.error(err)
          return []
        }
      })
    )

    const data = this.getQueryFormatData(esIndex, logsList)
    return {
      totalCount,
      data
    }
  }

  private getESQueryParams(
    operator: string,
    roles: IRoleBinding[],
    searchAll: string,
    searchAllKeys: string[],
    tenantId: string,
    projectName: string,
    appName: string
  ) {
    const hasPermission = roles.some((role) => AuthService.hasTerminalPermission(role, tenantId))
    const booleanConditionQuery: IEsBooleanQuery = {
      should: [],
      must: []
    }
    if (!hasPermission) {
      booleanConditionQuery.must.push({
        term: {
          email: {
            value: operator
          }
        }
      })
    }
    if (searchAll) {
      const searchAllItems = searchAll.split(' ')
      const validItems = searchAllItems.filter((item) => item.length > 0)
      const isText = validItems.length > 1
      if (isText) {
        booleanConditionQuery.should = searchAllKeys.map((key) => ({
          match_phrase: {
            [key]: {
              query: searchAll
            }
          }
        }))
      } else {
        const searchAllRegExp = esTerminalRegexpSearchBuilder(searchAll)
        booleanConditionQuery.should = searchAllKeys.map((key) => ({
          regexp: {
            [key]: searchAllRegExp
          }
        }))
      }
      booleanConditionQuery.minimumShouldMatch = 1
    }

    booleanConditionQuery.must.push({
      bool: {
        should: [
          {
            term: {
              group: {
                value: tenantId
              }
            }
          },
          {
            term: {
              tenant: {
                value: tenantId
              }
            }
          }
        ]
      }
    })

    booleanConditionQuery.must.push({
      term: {
        project: {
          value: projectName
        }
      }
    })
    booleanConditionQuery.must.push({
      term: {
        application: {
          value: appName
        }
      }
    })
    return booleanConditionQuery
  }

  private getQueryFormatData(
    esIndex: ESIndex,
    queryDataList: EsTerminalLog[][] | EsTerminalReplay[][]
  ): Log[] | Replay[] {
    if (!(esIndex === ESIndex.TERMINAL_LOG || esIndex === ESIndex.TERMINAL_REPLAY)) {
      return []
    }
    const isEsTerminalLogArray = (
      logListOrReplayList: EsTerminalLog[] | EsTerminalReplay[]
    ): logListOrReplayList is EsTerminalLog[] => {
      const logOrReplay = logListOrReplayList[0]
      return 'requestCmd' in logOrReplay
    }
    if (esIndex === ESIndex.TERMINAL_LOG) {
      const result: Log[] = []
      for (const dayLogList of queryDataList) {
        if (isEsTerminalLogArray(dayLogList)) {
          for (const log of dayLogList) {
            const { email, nodeName, nodeIP, pod, podIP, container, requestQuery, requestCmd, sessionId } = log
            result.push({
              container,
              detail: `${requestQuery} ${requestCmd}`,
              nodeName,
              operator: email,
              podIP,
              nodeIP,
              podName: pod,
              sessionId,
              time: log['@timestamp']
            })
          }
        }
      }
      return result
    }

    const result: Replay[] = []
    for (const dayReplayList of queryDataList) {
      if (!isEsTerminalLogArray(dayReplayList)) {
        for (const replay of dayReplayList) {
          const { email, nodeName, nodeIP, podName, podIP, container, sessionId, duration } = replay
          result.push({
            container,
            nodeName,
            operator: email,
            podIP,
            nodeIP,
            podName,
            sessionId,
            time: replay['@timestamp'],
            duration
          })
        }
      }
    }
    return result
  }

  private getBooleanConditionQueryForTerminalReplayES(
    tenantId: string,
    sessionId: string,
    roles: IRoleBinding[],
    currentOperator: string
  ) {
    const hasPermission = roles.some((role) => AuthService.hasTerminalPermission(role, tenantId))
    const booleanConditionQuery: IEsBooleanQuery = {
      must: []
    }
    booleanConditionQuery.must.push({
      term: {
        sessionId: {
          value: sessionId
        }
      }
    })
    if (!hasPermission) {
      booleanConditionQuery.must.push({
        term: {
          email: {
            value: currentOperator
          }
        }
      })
    }

    return booleanConditionQuery
  }

  public async getApplicationTerminalReplayDetail(
    params: ApplicationReplayDetailParamsDto,
    query: ApplicationTerminalReplayDetailQueryDto,
    roles: IRoleBinding[],
    currentOperator: string
  ): Promise<Replay> {
    const { tenantId, sessionId } = params
    const { createdTime } = query
    const formatDate = moment.utc(createdTime).format('YYYY-MM-DD')
    const esIndex = `${ESIndex.TERMINAL_REPLAY}-${formatDate}`
    const booleanConditionQuery: IEsBooleanQuery = this.getBooleanConditionQueryForTerminalReplayES(
      tenantId,
      sessionId,
      roles,
      currentOperator
    )

    const data: EsTerminalReplay | null = await this.esService.booleanQueryFirst(esIndex, booleanConditionQuery)
    if (!data) {
      throw new NotFoundException(`Can not get replay detail: ${sessionId}`)
    }
    const { email, container, nodeIP, nodeName, podIP, podName, duration } = data
    const result: Replay = {
      operator: email,
      time: data['@timestamp'],
      container,
      nodeIP,
      nodeName,
      podIP,
      podName,
      sessionId,
      duration
    }
    return result
  }

  public async getApplicationTerminalReplayFileData(
    params: ApplicationReplayDetailParamsDto,
    createdTime: string,
    roles: IRoleBinding[],
    currentOperator: string
  ): Promise<WriteStream> {
    const { tenantId, sessionId } = params
    const esIndex = `${ESIndex.TERMINAL_REPLAY}-${moment.utc(createdTime).format('YYYY-MM-DD')}`

    const booleanConditionQuery: IEsBooleanQuery = this.getBooleanConditionQueryForTerminalReplayES(
      tenantId,
      sessionId,
      roles,
      currentOperator
    )
    const esReplayData: EsTerminalReplayFileData = await this.esService.booleanQueryFirst(
      esIndex,
      booleanConditionQuery
    )

    if (!esReplayData) {
      throw new NotFoundException(`Can not find replay: ${sessionId}`)
    }

    const { fileId } = esReplayData
    const data = await this.ussService.downloadFile(fileId)

    return data
  }
}
