import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException,
  forwardRef,
  Inject
} from '@nestjs/common'

import { AgentService } from 'common/modules/agent/agent.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { ApplicationsService } from 'applications-management/applications/applications.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { PodsService } from 'applications-management/pods/pods.service'

import { dedup } from 'common/helpers/array'
import {
  parseClusterId,
  buildContainers,
  buildContainerDetails,
  ftePhaseToLocaleLowerCase,
  buildClusters,
  populateDeploymentWithAuthInfo,
  buildAbnormalPod,
  scaleApplicationInstance,
  fullReleaseApplicationInstance,
  getPhaseFromStableUpper,
  getFeatureFromLabelUpper,
  cancelCanaryApplicationInstance,
  parsePodType,
  getDeploymentPhaseByDeployList
} from 'common/helpers/deployment'
import { RBACCheckTenantResourceAction } from 'common/helpers/rbac'

import {
  ApiDeploymentClusterInfo,
  IDeploymentCrdInfo,
  IPod,
  GetDeployContainerTagsRequestDto,
  ApiDeployPathParams,
  ScaleDeployBody,
  FullReleaseBody,
  IGetDeployContainerTagsResponseDto,
  RollbackDeploymentRequestParamsDto,
  RollbackDeploymentRequestBodyDto,
  RolloutRestartDeploymentRequestParamsDto,
  RolloutRestartDeploymentRequestBodyDto,
  IDeploymentInfo,
  IItem,
  CancelCanaryDeployBody,
  IGetDeploymentEvents,
  IDeploymentPodsInfo,
  IDeploymentPodInfo,
  IDeploymentLatestEvents,
  IPodFirstEventsArgs,
  IControllerRevisionInfo,
  IContainers
} from './dto/deployment.dto'
import { GetOrUpdateDeployParamsDto } from './dto/common/params.dto'
import { GetOrUpdateDeployQueryDto } from './dto/common/query.dto'
import { UpdateDeployLimitBody, Phase } from './dto/update-deployLimit.dto'
import { APPLICATION_INSTANCE_CRD, NAMESPACE_PREFIX } from 'common/constants/apiServer.constants'
import {
  IApplicationInstanceCrdObject,
  IGetOrDeleteNamespacedCustomObject,
  IDeploySpec,
  IPatchOrReplaceNamespacedCustomObject
} from 'common/interfaces'
import { find, cloneDeep, some, method, mapValues } from 'lodash'
import { ERROR_MESSAGE } from 'common/constants/error'
import {
  PHASE,
  PHASE_RELEASE,
  PHASE_CANARY,
  ROLLOUT_RESTART,
  ROLLOUT_RESTART_CANARY,
  REASON,
  POD_TYPE,
  DEPLOYMENT_EVENT_TYPE,
  DEPLOYMENT_OAM_TYPE
} from 'common/constants/deployment'

import { getPhaseFromLabel } from 'common/helpers/pod'

import { makeApplicationInstanceName } from 'common/helpers/applicationInstance'
import { V1ReplicaSetList } from '@kubernetes/client-node'
import { RFC3339DateString } from 'common/helpers/date'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'
import { PLATFORM_SOURCE } from 'common/constants/source'
import { hitClusterConfigInfo, parseClusterIdWithFte } from 'common/helpers/cluster'
import { cpuQuantityScalar, memoryQuantityScalar } from 'common/helpers/clientNodeUtils'

import { promiseWaitAll } from 'common/helpers/promise'
import { AuthService } from 'common/modules/auth/auth.service'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'
import { EventService, IESEvent } from 'common/modules/event/event.service'
import * as pLimit from 'p-limit'
import * as moment from 'moment'
import { ONE_DATE_DURATION_MILLISECOND } from 'common/constants/event'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { ENV } from 'common/constants/env'
import { Logger } from 'common/helpers/logger'

const httpLimit = pLimit(100)

@Injectable()
export class DeploymentsService {
  private readonly logger = new Logger(DeploymentsService.name)

  constructor(
    private agentService: AgentService,
    private clustersService: ClustersService,
    private apiServerService: ApiServerService,
    private projectsService: ProjectsService,
    private applicationsService: ApplicationsService,
    private authService: AuthService,
    @Inject(forwardRef(() => PodsService))
    private podsService: PodsService,
    private eventService: EventService,
    private readonly openApiService: OpenApiService
  ) {}

  async getApplicationDeployClusterDetail(
    deploymentInfo: ApiDeploymentClusterInfo,
    clusterId: string,
    authToken: string
  ) {
    const { tenantId, projectName, appName, deployName, clusterName } = deploymentInfo
    const { env, cid, fte } = parseClusterId(clusterId)
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    // check application name
    await this.applicationsService.getApplication({ tenantId, projectName, appName }, authToken)

    // check deploy name
    if (deployName !== `${appName}-${env.toLowerCase()}-${cid.toLowerCase()}`) {
      throw new BadRequestException('Bad deploy name')
    }

    const appInstanceOAM = await this.podsService.getApplicationInstanceOAM(
      { projectName, appName, deployName, clusterId },
      authToken
    )

    const status = appInstanceOAM?.status
    const runtimeStatus = status?.runtimeStatus
    const workloadStatus = runtimeStatus?.workloadStatus
    const canaryWorkloadStatus = runtimeStatus?.canaryWorkloadStatus

    const sortedPhase = dedup<string>(runtimeStatus.phase).sort()
    const phase = ftePhaseToLocaleLowerCase(sortedPhase)

    // get project clusters
    const { clusters } = await this.projectsService.getEsProject(projectName, tenantId)

    const oamType = await this.podsService.getOamType(
      {
        projectName,
        appName,
        clusterId,
        deployName
      },
      authToken
    )

    // get user auth
    const deploymentAuth = populateDeploymentWithAuthInfo(phase, oamType)

    // get deployment pods
    const { config } = await this.clustersService.findByName(clusterName)
    const labelsSelect = {
      project: projectName,
      application: appName,
      env: env.toLowerCase(),
      cid: cid.toLowerCase()
    }
    const { items: pods } = await this.agentService.request<IPod>(
      'getpodsbylabelselect',
      true,
      { config, clusterName },
      {
        namespace: '',
        labelsSelect: JSON.stringify(labelsSelect)
      }
    )

    const replicas = workloadStatus.replicas || 0
    const canaryReplicas = canaryWorkloadStatus.replicas || 0
    const podCount = replicas + canaryReplicas

    const containers = (workloadStatus.containers || []).map<IContainers>((oamItem) => {
      const { name, image, limits } = oamItem
      return {
        name,
        image,
        limits,
        cpu: limits.cpu,
        memory: limits.memory
      }
    })
    const canaryWorkloadStatusContainers = canaryReplicas > 0 ? canaryWorkloadStatus.containers : []
    const canaryContainers = canaryWorkloadStatusContainers.map((oamItem) => {
      const { name, image, limits } = oamItem
      return {
        name,
        image,
        limits,
        cpu: limits.cpu,
        memory: limits.memory
      }
    })

    // use pods to build abnormalPod
    const abnormalPod = buildAbnormalPod(pods, podCount, fte, phase)
    const result = {
      name: deployName,
      clusterName,
      clusterId,
      tenantName,
      tenantId,
      projectName,
      appName,
      info: {
        appInstanceName: appInstanceOAM.name,
        podCount: podCount,
        releaseCount: replicas,
        canaryCount: canaryReplicas,
        clusterId: clusterId,
        phase: phase.join('/'),
        deployName: appName,
        name: deployName,
        env: env.toLowerCase(),
        cid: cid.toLowerCase(),
        containers: buildContainers(containers.concat(canaryContainers)),
        ...deploymentAuth
      },
      containerDetails: buildContainerDetails(containers, phase, canaryContainers),
      clusters: buildClusters(clusters, env, cid, fte),
      ...abnormalPod
    }

    return result
  }

  async updateDeployLimit(
    authUser: IAuthUser,
    params: GetOrUpdateDeployParamsDto,
    query: GetOrUpdateDeployQueryDto,
    body: UpdateDeployLimitBody,
    authToken: string
  ) {
    const { tenantId, projectName, appName, deployName } = params
    const { clusterName } = query
    const { phases } = body
    await this.authService.getTenantById(tenantId, authToken) // check application name
    this.applicationsService.getApplication({ tenantId, projectName, appName }, authToken)

    // edit auth check
    await this.projectsService.getEsProject(projectName, tenantId)

    let phase: PHASE = null

    if (phases.length === 2 && find(phases, { phase: PHASE.CANARY }) && find(phases, { phase: PHASE.RELEASE })) {
      phase = PHASE.CANARY
    } else if (phases.length === 1 && find(phases, { phase: PHASE.RELEASE })) {
      phase = PHASE.RELEASE
    } else if (phases.length === 1) {
      phase = PHASE.FTE
    } else {
      throw new BadRequestException(
        `${ERROR_MESSAGE.REQUEST_BODY_INVALID}: Unrecognized phase, phase only contain: RELEASE、RELEASE/CANARY、FTE`
      )
    }

    const namespace = `${NAMESPACE_PREFIX}${projectName}`
    // phase fte appins have a fte name suffix
    const applicationInstanceName =
      phase === PHASE.FTE
        ? `${appName}-${clusterName}${deployName.split(appName)[1]}-${phases[0].phase}`
        : `${appName}-${clusterName}${deployName.split(appName)[1]}`

    const getAppInsNamespaceCustomObject: IGetOrDeleteNamespacedCustomObject = {
      plural: APPLICATION_INSTANCE_CRD.PLURAL,
      name: applicationInstanceName,
      namespace: namespace
    }

    const applicationInstanceCrdRes = await this.apiServerService.get<IApplicationInstanceCrdObject>(
      getAppInsNamespaceCustomObject
    )

    const { body: applicationInstanceCrd } = applicationInstanceCrdRes
    const { spec } = applicationInstanceCrd

    const { deploySpec, canaryDeploySpec } = spec

    let newDeploySpec = cloneDeep(deploySpec)
    let newCanaryDeploySpec = cloneDeep(canaryDeploySpec)
    const newSpec = cloneDeep(spec)

    switch (phase) {
      case PHASE.CANARY:
        newDeploySpec = this.generateDeploySpec(find(phases, { phase: PHASE.RELEASE }), deploySpec)
        newCanaryDeploySpec = this.generateDeploySpec(find(phases, { phase: PHASE.CANARY }), canaryDeploySpec)

        newSpec.deploySpec = newDeploySpec
        newSpec.canaryDeploySpec = newCanaryDeploySpec
        break
      case PHASE.RELEASE:
        newDeploySpec = this.generateDeploySpec(find(phases, { phase: PHASE.RELEASE }), deploySpec)
        newSpec.deploySpec = newDeploySpec
        break
      case PHASE.FTE:
        newDeploySpec = this.generateDeploySpec(find(phases, { phase: phases[0].phase }), deploySpec)
        newSpec.deploySpec = newDeploySpec
        break
      default:
        break
    }

    const newApplicationInstanceCrd: IApplicationInstanceCrdObject = {
      ...applicationInstanceCrd,
      spec: {
        ...newSpec,
        source: PLATFORM_SOURCE
      }
    }

    const patchNamespaceCustomObject: IPatchOrReplaceNamespacedCustomObject<IApplicationInstanceCrdObject> = {
      ...getAppInsNamespaceCustomObject,
      crdObject: newApplicationInstanceCrd
    }

    const result = await this.apiServerService.replace(patchNamespaceCustomObject)

    return result
  }

  async getDeploymentContainerTags(
    getDeployContainerTagsDTO: GetDeployContainerTagsRequestDto,
    clusterId: string,
    authToken: string
  ): Promise<IGetDeployContainerTagsResponseDto> {
    const { tenantId, projectName, appName, containerName } = getDeployContainerTagsDTO
    const { env, cid, clusterName, fte } = parseClusterId(clusterId)

    await this.authService.getTenantById(tenantId, authToken)
    const cluster = await this.clustersService.findByName(clusterName)
    const { name, config } = cluster
    const deployments = await this.getApplicationDeploymentsFromCluster(config, name, {
      projectName,
      appName,
      env: env.toLowerCase(),
      cid: cid.toLowerCase()
    })

    let unstableCount = 0
    let deprecatedCount = 0
    let fteCount = 0

    const filterDeployments = deployments.filter((deployment) => {
      const { stable, phase, feature } = deployment.metadata.labels
      if (stable === 'false') unstableCount++
      else if (phase === 'deprecated') deprecatedCount++
      else if (feature) fteCount++

      if (fte) {
        const fteName = getFeatureFromLabelUpper(deployment.metadata.labels)
        return fteName === fte.toUpperCase()
      }

      return true
    })

    if (
      filterDeployments.length - fteCount > 3 ||
      (filterDeployments.length - fteCount === 2 && unstableCount !== 1 && deprecatedCount !== 1) ||
      (filterDeployments.length - fteCount === 3 && (unstableCount !== 1 || deprecatedCount !== 1))
    ) {
      this.logger.error('Get deployment tags error: More than one deployment exist')
      throw new InternalServerErrorException('More than one deployment exist, please check.')
    }

    let replicaSetLists = [] as Array<V1ReplicaSetList>

    try {
      replicaSetLists = await Promise.all(
        filterDeployments.map(async (deployment) => {
          return await this.agentService.request<V1ReplicaSetList>(
            'deploymentRS',
            true,
            { clusterName, config },
            {
              namespace: deployment.metadata.namespace,
              deployment: deployment.metadata.name
            }
          )
        })
      )
    } catch (e) {
      this.logger.error(`Failed to get replicaset info for ${e}`)
      throw new InternalServerErrorException('Failed to get replicaset info')
    }
    const deployContainerTags = { tags: [] } as IGetDeployContainerTagsResponseDto

    replicaSetLists.forEach((replicaSetList) => {
      replicaSetList.items.forEach((replicaSet) => {
        replicaSet.spec.template.spec.containers.forEach((container) => {
          if (container.name === containerName) {
            deployContainerTags.name = container.name
            if (container.image.split(':').length !== 2) {
              return
            }

            if (
              !deployContainerTags.tags.find(
                ({ image, tagname }) => image === container.image && tagname === container.image.split(':')[1]
              )
            ) {
              deployContainerTags.tags.push({
                image: container.image,
                tagname: container.image.split(':')[1],
                timestamp: RFC3339DateString(new Date((replicaSet.metadata.creationTimestamp as unknown) as string))
              })
            }
          }
        })
      })
    })

    if (!deployContainerTags.name) {
      throw new BadRequestException('Request container name invalid')
    }

    deployContainerTags.tags.sort((t1, t2) => (t1.timestamp < t2.timestamp ? 1 : t1.timestamp > t2.timestamp ? -1 : 0))

    return deployContainerTags
  }

  async getContainerTags(
    getDeployContainerTagsDTO: GetDeployContainerTagsRequestDto,
    clusterId: string,
    authToken: string
  ): Promise<IGetDeployContainerTagsResponseDto> {
    const { tenantId, projectName, appName, deployName } = getDeployContainerTagsDTO
    const { env, cid, clusterName } = parseClusterId(clusterId)

    // check deploy name
    if (deployName !== `${appName}-${env.toLowerCase()}-${cid.toLowerCase()}`) {
      throw new BadRequestException('Bad deploy name')
    }

    // check application name
    await this.applicationsService.getApplication({ tenantId, projectName, appName }, authToken)
    await this.authService.getTenantById(tenantId, authToken)

    const appInstanceOAM = await this.podsService.getApplicationInstanceOAM(
      { projectName, appName, deployName, clusterId },
      authToken
    )
    const oamType = appInstanceOAM?.spec?.components[0]?.type
    return oamType.includes(DEPLOYMENT_OAM_TYPE.DEPLOYMENT)
      ? await this.getDeploymentContainerTags(getDeployContainerTagsDTO, clusterId, authToken)
      : await this.getStatefulsetAndCloneSetContainerTags(getDeployContainerTagsDTO, clusterId, oamType)
  }

  async getStatefulsetAndCloneSetContainerTags(
    getDeployContainerTagsDTO: GetDeployContainerTagsRequestDto,
    clusterId: string,
    oamType: string
  ) {
    const [routeToGetDeploymentList, routeToGetCR] = oamType.includes(DEPLOYMENT_OAM_TYPE.CLONE_SET)
      ? ['getclonesetbylabelselect', 'clonesetCR']
      : ['getstatefulsetsbylabelselect', 'statefulsetCR']
    const { projectName, appName, containerName } = getDeployContainerTagsDTO
    const { env, cid, clusterName } = parseClusterId(clusterId)
    const cluster = await this.clustersService.findByName(clusterName)
    const labelsSelect = {
      project: projectName,
      application: appName,
      env: env.toLowerCase(),
      cid: cid.toLowerCase()
    }

    const clusterConfig = { clusterName, config: cluster.config }

    // get deployList to parse phaseSet
    const deploymentList: IDeploymentInfo = await this.agentService.request(
      routeToGetDeploymentList,
      true,
      clusterConfig,
      {
        labesSelect: JSON.stringify(labelsSelect)
      }
    )

    const { items } = deploymentList
    if (!items || items.length === 0) {
      throw new NotFoundException(ERROR_MESSAGE.REQUEST_DEPLOYMENT_NOT_EXIST)
    }
    const deployment: IItem = deploymentList.items[0]
    const { namespace, name } = deployment.metadata
    const body = oamType.includes(DEPLOYMENT_OAM_TYPE.CLONE_SET)
      ? { namespace, cloneset: name }
      : { namespace, statefulset: name }
    const crList: IControllerRevisionInfo = await this.agentService.request(routeToGetCR, true, clusterConfig, body)
    const deployContainerTags = { tags: [] } as IGetDeployContainerTagsResponseDto
    crList.items.forEach((cr) => {
      cr.data.spec.template.spec.containers.forEach((container) => {
        if (container.name === containerName) {
          deployContainerTags.name = container.name
          // image has a format of "image:tag". For those who do not contain a tag, display 'latest' instead of return may be better
          if (container.image.split(':').length !== 2) {
            return
          }

          if (
            !deployContainerTags.tags.find(
              ({ image, tagname }) => image === container.image && tagname === container.image.split(':')[1]
            )
          ) {
            deployContainerTags.tags.push({
              image: container.image,
              tagname: container.image.split(':')[1],
              timestamp: RFC3339DateString(new Date((cr.metadata.creationTimestamp as unknown) as string))
            })
          }
        }
      })
    })

    if (!deployContainerTags.name) {
      throw new BadRequestException('Request container name invalid')
    }

    deployContainerTags.tags.sort((t1, t2) => (t1.timestamp < t2.timestamp ? 1 : t1.timestamp > t2.timestamp ? -1 : 0))

    return deployContainerTags
  }

  async scaleApplicationDeploys(
    authUser: IAuthUser,
    deploymentInfo: ApiDeployPathParams,
    request: ScaleDeployBody,
    authToken: string
  ) {
    const { tenantId, projectName, appName } = deploymentInfo
    const { deploys } = request
    // check application name
    await this.applicationsService.getApplication({ tenantId, projectName, appName }, authToken)

    const scaleDeploysPromiseList = deploys.map(async (deploy) => {
      const { name, clusterId } = deploy
      const { clusterName, env, cid, fte } = parseClusterId(clusterId)

      const deployment = await this.getApplicationInstanceCrd({
        appName,
        projectName,
        clusterName,
        env,
        cid,
        fte
      })

      const newDeployment = scaleApplicationInstance(deployment, deploy)
      newDeployment.spec.source = PLATFORM_SOURCE

      const applicationInstanceName = makeApplicationInstanceName({
        clusterName,
        appName,
        env,
        cid,
        fte
      })
      const newDeploymentCustomObject = {
        namespace: `${NAMESPACE_PREFIX}${projectName}`,
        crdObject: newDeployment,
        plural: APPLICATION_INSTANCE_CRD.PLURAL,
        name: applicationInstanceName
      }
      await this.apiServerService.replace(newDeploymentCustomObject)

      return name
    })
    const resultList = await promiseWaitAll<string>(scaleDeploysPromiseList)
    resultList.forEach((result) => {
      if (result instanceof Error) {
        throw result
      }
    })

    return {
      result: `Scale ${resultList.join(', ')} successfully!`
    }
  }

  async fullReleaseApplicationDeploys(
    authUser: IAuthUser,
    deploymentInfo: ApiDeployPathParams,
    request: FullReleaseBody,
    authToken: string
  ) {
    const { projectName, appName, tenantId } = deploymentInfo
    const { deploys } = request

    // check application name
    this.applicationsService.getApplication({ tenantId, projectName, appName }, authToken)
    await this.authService.getTenantById(tenantId, authToken)
    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    const fullReleaseDeploysPromiseList = deploys.map(async (deploy) => {
      const { clusterId, name } = deploy
      const { clusterName, env, cid, fte } = parseClusterId(clusterId)

      let hasPermission = false
      if (env.toUpperCase() === ENV.live) {
        hasPermission = RBACCheckTenantResourceAction(
          tenantPermissions,
          tenantId,
          RESOURCE_TYPE.DEPLOYMENT,
          RESOURCE_ACTION.FullReleaseLive
        )
      } else {
        hasPermission = RBACCheckTenantResourceAction(
          tenantPermissions,
          tenantId,
          RESOURCE_TYPE.DEPLOYMENT,
          RESOURCE_ACTION.FullReleaseNonLive
        )
      }

      if (!hasPermission) {
        throw new ForbiddenException(`you do not have permission to full release deployment ${deploy.name}`)
      }

      const deployment = await this.getApplicationInstanceCrd({ appName, projectName, clusterName, env, cid, fte })

      const newDeployment = fullReleaseApplicationInstance(deployment)
      newDeployment.spec.source = PLATFORM_SOURCE

      const applicationInstanceName = makeApplicationInstanceName({
        clusterName,
        appName,
        env,
        cid,
        fte
      })
      const newDeploymentCustomObject = {
        namespace: `${NAMESPACE_PREFIX}${projectName}`,
        crdObject: newDeployment,
        plural: APPLICATION_INSTANCE_CRD.PLURAL,
        name: applicationInstanceName
      }
      await this.apiServerService.replace(newDeploymentCustomObject)

      return name
    })
    const resultList = await promiseWaitAll<string>(fullReleaseDeploysPromiseList)
    resultList.forEach((result) => {
      if (result instanceof Error) {
        throw result
      }
    })

    return {
      result: `FullRelease ${resultList.join(', ')} successfully!`
    }
  }

  async rollbackDeployment(
    authUser: IAuthUser,
    rollbackDeploymentParamsDto: RollbackDeploymentRequestParamsDto,
    rollbackDeploymentBodyDto: RollbackDeploymentRequestBodyDto,
    authToken: string
  ) {
    const { tenantId, projectName, appName } = rollbackDeploymentParamsDto
    await this.authService.getTenantById(tenantId, authToken)
    // check application name
    this.applicationsService.getApplication({ tenantId, projectName, appName }, authToken)

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    const rollbackDeploysPromiseList = rollbackDeploymentBodyDto.deploys.map(async (deploy) => {
      const { name: deploymentName, clusterId } = deploy
      const { clusterName, env, cid, fte } = parseClusterId(clusterId)

      let hasPermission = false
      if (env.toUpperCase() === ENV.live) {
        hasPermission = RBACCheckTenantResourceAction(
          tenantPermissions,
          tenantId,
          RESOURCE_TYPE.DEPLOYMENT,
          RESOURCE_ACTION.RollbackLive
        )
      } else {
        hasPermission = RBACCheckTenantResourceAction(
          tenantPermissions,
          tenantId,
          RESOURCE_TYPE.DEPLOYMENT,
          RESOURCE_ACTION.RollbackNonLive
        )
      }

      if (!hasPermission) {
        throw new ForbiddenException(`you do not have permission to full rollback deployment ${deploy.name}`)
      }
      const namespace = `${NAMESPACE_PREFIX}${projectName}`
      const applicationInstanceName = makeApplicationInstanceName({
        clusterName,
        appName,
        env,
        cid,
        fte
      })

      const { body: applicationInstance } = await this.apiServerService.get<IApplicationInstanceCrdObject>({
        namespace,
        plural: APPLICATION_INSTANCE_CRD.PLURAL,
        name: applicationInstanceName
      })

      if (applicationInstance.status.phase.includes(PHASE.CANARY)) {
        throw new BadRequestException('Can not rollback a deployment which is in canary phase')
      }

      const updatedApplicationInstance = cloneDeep(applicationInstance)
      const deploySpec = updatedApplicationInstance.spec.deploySpec
      deploy.containers.forEach((container) => {
        const matchedContainer = deploySpec.containers.find(
          (deploySpecContainer) => deploySpecContainer.name === container.name
        )
        if (!matchedContainer) {
          throw new BadRequestException(`Not match container ${container.name} for rollback`)
        }
        matchedContainer.image = `${container.image}`
      })
      // tell applicationInstance who updates this applicationInstance
      updatedApplicationInstance.spec.source = PLATFORM_SOURCE

      const updateApplicationInstancePayload: IPatchOrReplaceNamespacedCustomObject<IApplicationInstanceCrdObject> = {
        crdObject: updatedApplicationInstance,
        plural: APPLICATION_INSTANCE_CRD.PLURAL,
        namespace,
        name: applicationInstanceName
      }

      await this.apiServerService.replace(updateApplicationInstancePayload)

      return deploymentName
    })

    const resultList = await promiseWaitAll<string>(rollbackDeploysPromiseList)
    resultList.forEach((result) => {
      if (result instanceof Error) {
        throw result
      }
    })

    return {
      result: `Rollback ${resultList.join(', ')} successfully!`
    }
  }

  async rolloutRestart(
    authUser: IAuthUser,
    rolloutRestartParamsDto: RolloutRestartDeploymentRequestParamsDto,
    rolloutRestartBodyDto: RolloutRestartDeploymentRequestBodyDto,
    authToken: string
  ) {
    const { tenantId, projectName, appName } = rolloutRestartParamsDto
    await this.authService.getTenantById(tenantId, authToken)
    // check application name
    this.applicationsService.getApplication({ tenantId, projectName, appName }, authToken)

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    for (const deploy of rolloutRestartBodyDto.deploys) {
      const { name } = deploy
      const { phases } = deploy
      const { clusterName, env, cid, fte } = parseClusterId(deploy.clusterId)

      let hasPermission = false
      if (env.toUpperCase() === ENV.live) {
        hasPermission = RBACCheckTenantResourceAction(
          tenantPermissions,
          tenantId,
          RESOURCE_TYPE.DEPLOYMENT,
          RESOURCE_ACTION.RolloutRestartLive
        )
      } else {
        hasPermission = RBACCheckTenantResourceAction(
          tenantPermissions,
          tenantId,
          RESOURCE_TYPE.DEPLOYMENT,
          RESOURCE_ACTION.RolloutRestartNonLive
        )
      }

      if (!hasPermission) {
        throw new ForbiddenException(`you do not have permission to full rollback deployment ${name}`)
      }

      const namespace = `${NAMESPACE_PREFIX}${projectName}`

      const applicationInstanceName = makeApplicationInstanceName({
        clusterName,
        appName,
        env,
        cid,
        fte
      })

      const { body: applicationInstance } = await this.apiServerService.get<IApplicationInstanceCrdObject>({
        namespace,
        plural: APPLICATION_INSTANCE_CRD.PLURAL,
        name: applicationInstanceName
      })
      const updatedApplicationInstance = cloneDeep(applicationInstance)

      updatedApplicationInstance.metadata.annotations = updatedApplicationInstance.metadata.annotations || {}

      if (some(phases, method('includes', PHASE_CANARY))) {
        updatedApplicationInstance.metadata.annotations[ROLLOUT_RESTART_CANARY] = Math.round(Date.now() / 1000) + ''
      } else {
        updatedApplicationInstance.metadata.annotations[ROLLOUT_RESTART] = Math.round(Date.now() / 1000) + ''
      }

      updatedApplicationInstance.spec.source = PLATFORM_SOURCE

      const updateApplicationInstancePayload: IPatchOrReplaceNamespacedCustomObject<IApplicationInstanceCrdObject> = {
        crdObject: updatedApplicationInstance,
        plural: APPLICATION_INSTANCE_CRD.PLURAL,
        namespace,
        name: applicationInstanceName
      }

      await this.apiServerService.replace(updateApplicationInstancePayload)
    }

    return {}
  }

  async getDeploymentBasicInfo(
    deploymentInfo: ApiDeploymentClusterInfo,
    clusterId: string,
    isCanary: boolean,
    authToken: string
  ) {
    const { tenantId, projectName, appName, deployName, clusterName } = deploymentInfo
    const { env, cid, fteName = '' } = parseClusterIdWithFte(clusterId)
    // check application name
    await this.applicationsService.getApplication({ tenantId, projectName, appName }, authToken)

    // check deploy name
    if (deployName !== `${appName}-${env.toLowerCase()}-${cid.toLowerCase()}`) {
      throw new BadRequestException('Bad deploy name')
    }

    // get deployments pods
    const { config: token } = await this.clustersService.findByName(clusterName)
    const labelsSelect = {
      project: projectName,
      application: appName,
      env: env.toLowerCase(),
      cid: cid.toLowerCase()
    }

    const oamType = await this.podsService.getOamType(
      {
        projectName,
        appName,
        clusterId,
        deployName
      },
      authToken
    )

    const agentPath = this.podsService.getAgentOamDeployRoute(oamType)

    const deployList = await this.agentService.request<{
      items: {
        metadata: {
          labels: Record<string, string>
        }
      }[]
    }>(
      agentPath,
      true,
      { config: token, clusterName },
      {
        labesSelect: JSON.stringify(labelsSelect)
      }
    )

    const { items } = deployList

    if (!items || items.length === 0) {
      throw new NotFoundException(ERROR_MESSAGE.REQUEST_DEPLOYMENT_NOT_EXIST)
    }

    const selectedDeployList = []
    if (deployList.items && deployList.items.length) {
      deployList.items.forEach((deployment) => {
        const { labels = {} } = deployment.metadata || {}

        const tPhase = getPhaseFromStableUpper(labels)
        const tFeature = getFeatureFromLabelUpper(labels)
        if (
          (fteName === '' && (tPhase === PHASE_RELEASE || tPhase === PHASE_CANARY) && tFeature === '') ||
          (fteName !== '' && tFeature === fteName.toUpperCase())
        ) {
          selectedDeployList.push(deployment)
        }
      })
    }

    const isCloneSet = oamType.includes(DEPLOYMENT_OAM_TYPE.CLONE_SET)
    let deploymentPhase = getDeploymentPhaseByDeployList(selectedDeployList)
    if (deploymentPhase !== PHASE.FTE && isCloneSet) {
      deploymentPhase = isCanary ? PHASE.CANARY : PHASE.RELEASE
    }
    let basicInfo
    try {
      switch (deploymentPhase) {
        case PHASE.RELEASE:
          basicInfo = {
            pods: {
              RELEASE: this.getReleaseDeploymentReplicas(selectedDeployList[0])
            },
            phase: {
              RELEASE: isCloneSet
                ? await this.generateClonesetPhase(selectedDeployList[0], clusterId, PHASE.RELEASE)
                : this.generateDeploymentPhase(selectedDeployList[0])
            },
            ...this.generateDeploymentStrategy(selectedDeployList[0], oamType)
          }
          break

        case PHASE.CANARY:
          const releaseDeployment = isCloneSet
            ? selectedDeployList[0]
            : selectedDeployList.find((deployment) => !deployment?.metadata?.labels?.stable)
          const canaryDeployment = isCloneSet
            ? selectedDeployList[0]
            : selectedDeployList.find((deployment) => deployment?.metadata?.labels?.stable)
          const { release, canary } = this.getCanaryDeploymentReplicas(releaseDeployment, canaryDeployment, isCloneSet)

          basicInfo = {
            pods: {
              RELEASE: release,
              CANARY: canary
            },
            phase: {
              RELEASE: isCloneSet
                ? await this.generateClonesetPhase(releaseDeployment, clusterId, PHASE.RELEASE)
                : this.generateDeploymentPhase(releaseDeployment),
              CANARY: isCloneSet
                ? await this.generateClonesetPhase(releaseDeployment, clusterId, PHASE.CANARY)
                : this.generateDeploymentPhase(canaryDeployment)
            },
            ...this.generateDeploymentStrategy(releaseDeployment, oamType)
          }
          break

        case PHASE.FTE:
          const rawKey: string = selectedDeployList[0]?.metadata?.labels?.feature || ''
          const key = rawKey.toUpperCase()
          basicInfo = {
            pods: {
              [key]: this.getReleaseDeploymentReplicas(selectedDeployList[0])
            },
            phase: {
              [rawKey]: this.generateDeploymentPhase(selectedDeployList[0])
            },
            ...this.generateDeploymentStrategy(selectedDeployList[0], oamType)
          }
          break

        default:
          break
      }
    } catch {
      throw new InternalServerErrorException(ERROR_MESSAGE.REQUEST_DEPLOYMENT_UNKNOWN_PHASE)
    }

    // return selectedDeployList
    return {
      name: deployName,
      ...basicInfo
    }
  }

  async cancelCanaryDeploys(
    authUser: IAuthUser,
    deploymentInfo: ApiDeployPathParams,
    request: CancelCanaryDeployBody,
    authToken: string
  ) {
    const { projectName, tenantId, appName } = deploymentInfo
    const { deploys } = request
    await this.authService.getTenantById(tenantId, authToken)
    // check application name
    await this.applicationsService.getApplication({ tenantId, projectName, appName }, authToken)

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    const cancelCanaryDeployPromiseList = deploys.map(async (deploy) => {
      const { clusterId, name } = deploy
      const { clusterName, env, cid, fte } = parseClusterId(clusterId)

      let hasPermission = false
      if (env.toUpperCase() === ENV.live) {
        hasPermission = RBACCheckTenantResourceAction(
          tenantPermissions,
          tenantId,
          RESOURCE_TYPE.DEPLOYMENT,
          RESOURCE_ACTION.CancelCanaryLive
        )
      } else {
        hasPermission = RBACCheckTenantResourceAction(
          tenantPermissions,
          tenantId,
          RESOURCE_TYPE.DEPLOYMENT,
          RESOURCE_ACTION.CancelCanaryNonLive
        )
      }

      if (!hasPermission) {
        throw new ForbiddenException(`you do not have permission to cancel canary deployment ${deploy.name}`)
      }

      const deployment = await this.getApplicationInstanceCrd({ appName, projectName, clusterName, env, cid, fte })

      const newDeployment = cancelCanaryApplicationInstance(deployment)
      newDeployment.spec.source = PLATFORM_SOURCE

      if (newDeployment.metadata.annotations) {
        delete newDeployment.metadata.annotations['kube-platform.shopee.io/in-canary']
      }

      const applicationInstanceName = makeApplicationInstanceName({
        clusterName,
        appName,
        env,
        cid,
        fte
      })
      const newDeploymentCustomObject = {
        namespace: `${NAMESPACE_PREFIX}${projectName}`,
        crdObject: newDeployment,
        plural: APPLICATION_INSTANCE_CRD.PLURAL,
        name: applicationInstanceName
      }
      await this.apiServerService.replace(newDeploymentCustomObject)
      return name
    })

    const resultList = await promiseWaitAll<string>(cancelCanaryDeployPromiseList)
    resultList.forEach((result) => {
      if (result instanceof Error) {
        throw result
      }
    })

    return {
      result: `Cancel canary for ${resultList.join(', ')} successfully!`
    }
  }

  // helpers
  private generateDeploymentPhase(deployment) {
    const containers = deployment?.spec?.template?.spec?.containers || []
    return containers.map((container) => {
      const { name = '', image = '', resources = {}, lifecycle = {} } = container
      const { limits = {}, requests = {} } = resources
      const { memory: memoryLimit = '0', cpu: cpuLimit = '0' } = limits
      const { memory: memRequest = '0', cpu: cpuRequest = '0' } = requests

      return {
        name,
        image,
        healthCheck: this.generateDeploymentContainerHealthCheck(container),
        lifeCycle: mapValues(lifecycle, (value) => JSON.stringify(value)),
        memLimit: memoryQuantityScalar(memoryLimit),
        cpuLimit: cpuQuantityScalar(cpuLimit),
        memRequest: memoryQuantityScalar(memRequest),
        cpuRequest: cpuQuantityScalar(cpuRequest)
      }
    })
  }

  private async generateClonesetPhase(deployment: IItem, clusterId: string, phase: PHASE) {
    const cr = await this.agentService.getCR(clusterId, deployment, phase)
    const containers = cr?.data.spec?.template?.spec?.containers || []
    return containers.map((container) => {
      const { name = '', image = '', resources, lifecycle = {} } = container
      const { limits, requests } = resources
      const { memory: memoryLimit = '0', cpu: cpuLimit = '0' } = limits
      const { memory: memRequest = '0', cpu: cpuRequest = '0' } = requests

      return {
        name,
        image,
        healthCheck: this.generateDeploymentContainerHealthCheck(container),
        lifeCycle: mapValues(lifecycle, (value) => JSON.stringify(value)),
        memLimit: memoryQuantityScalar(memoryLimit),
        cpuLimit: cpuQuantityScalar(cpuLimit),
        memRequest: memoryQuantityScalar(memRequest),
        cpuRequest: cpuQuantityScalar(cpuRequest)
      }
    })
  }

  private generateDeploymentContainerHealthCheck(container) {
    const { readinessProbe, livenessProbe } = container
    const healthCheck: any = {
      livenessProbe: {},
      readinessProbe: {}
    }

    if (readinessProbe) {
      const { initialDelaySeconds, timeoutSeconds, periodSeconds, successThreshold } = readinessProbe

      healthCheck.readinessProbe = {
        initialDelaySeconds,
        periodSeconds,
        successThreshold,
        timeoutSeconds
      }

      if (readinessProbe.exec) {
        healthCheck.readinessProbe.type = 'Command'
        healthCheck.readinessProbe.typeValue = readinessProbe.exec.command.join(' ')
      } else if (readinessProbe.tcpSocket) {
        healthCheck.readinessProbe.type = 'TCP'
        healthCheck.readinessProbe.typeValue = readinessProbe.tcpSocket.port
      } else if (readinessProbe.httpGet) {
        healthCheck.readinessProbe.type = 'HTTP'
        healthCheck.readinessProbe.typeValue = readinessProbe.httpGet.path
      }
    }

    if (livenessProbe) {
      const { initialDelaySeconds, timeoutSeconds, periodSeconds, successThreshold } = livenessProbe

      healthCheck.livenessProbe = {
        initialDelaySeconds,
        periodSeconds,
        successThreshold,
        timeoutSeconds
      }

      if (livenessProbe.exec) {
        healthCheck.livenessProbe.type = 'Command'
        healthCheck.livenessProbe.typeValue = livenessProbe.exec.command.join(' ')
      } else if (livenessProbe.tcpSocket) {
        healthCheck.livenessProbe.type = 'TCP'
        healthCheck.livenessProbe.typeValue = livenessProbe.tcpSocket.port
      } else if (livenessProbe.httpGet) {
        healthCheck.livenessProbe.type = 'HTTP'
        healthCheck.livenessProbe.typeValue = livenessProbe.httpGet.path
      }
    }

    return healthCheck
  }

  private getReleaseDeploymentReplicas(deployment: IItem): number {
    return deployment?.spec?.replicas
  }

  private getCanaryDeploymentReplicas(
    releasedeployment: IItem,
    canaryDeployment: IItem,
    isCloneSet: boolean
  ): { release: number; canary: number } {
    if (isCloneSet) {
      const total = releasedeployment?.spec?.replicas
      const release = releasedeployment?.spec?.updateStrategy?.partition
      const canary = total - release
      return {
        release,
        canary
      }
    }
    return {
      release: releasedeployment?.spec?.replicas,
      canary: canaryDeployment?.spec?.replicas
    }
  }

  private generateDeploymentStrategy(deployment: IItem, oamType: string) {
    const { spec } = deployment
    if (oamType.includes(DEPLOYMENT_OAM_TYPE.CLONE_SET)) {
      const { updateStrategy: currentDeploymentStrategy } = spec
      const { type = '', maxUnavailable = '', maxSurge = '' } = currentDeploymentStrategy
      return {
        strategy: type,
        rollingUpdateStrategy: { maxUnavailable, maxSurge }
      }
    } else {
      const { strategy: currentDeploymentStrategy } = spec
      const { type = '', rollingUpdate = { maxUnavailable: '', maxSurge: '' } } = currentDeploymentStrategy
      return {
        strategy: type,
        rollingUpdateStrategy: rollingUpdate
      }
    }
  }

  private async getApplicationInstanceCrd({ appName, projectName, clusterName, env, cid, fte }) {
    const applicationInstanceName = makeApplicationInstanceName({
      clusterName,
      appName,
      env,
      cid,
      fte
    })
    const { body: deployment } = await this.apiServerService.get<IDeploymentCrdInfo>({
      namespace: `${NAMESPACE_PREFIX}${projectName}`,
      plural: APPLICATION_INSTANCE_CRD.PLURAL,
      name: applicationInstanceName
    })

    return deployment
  }

  private generateDeploySpec(updateSpecObj: Phase, deploySpec: IDeploySpec): IDeploySpec {
    if (!deploySpec) {
      throw new BadRequestException(ERROR_MESSAGE.REQUEST_BODY_INVALID)
    }

    const { resource } = updateSpecObj

    const { containers } = deploySpec

    // validate updating deploy spec containers is consistent with the crd
    let isValid = resource.length === containers.length
    resource.forEach((item) => {
      const { container } = item
      const isExist = !!containers.find((item) => item.name === container)
      isValid = isValid && isExist
    })

    if (!isValid) {
      throw new BadRequestException(ERROR_MESSAGE.REQUEST_BODY_INVALID)
    }

    const newDeploySpecContainers = resource.map((item) => {
      const { container, cpuLimit, memLimit } = item
      const oldDeploySpec = containers.find((item) => item.name === container)

      return {
        ...oldDeploySpec,
        cpuLimit: cpuLimit,
        memLimit: `${memLimit}Gi`
      }
    })

    return {
      ...deploySpec,
      containers: newDeploySpecContainers
    }
  }

  private async getApplicationDeploymentsFromCluster(
    config: string,
    clusterName: string,
    {
      projectName,
      appName,
      env,
      cid
    }: {
      projectName: string
      appName: string
      env: string
      cid: string
    }
  ): Promise<IItem[]> {
    const labelsSelect = {
      project: projectName,
      application: appName,
      env: env.toLowerCase(),
      cid: cid.toLowerCase()
    }
    try {
      const { items } = await this.agentService.request<IDeploymentInfo>(
        'getdeploysbylabelselect',
        true,
        { config, clusterName },
        {
          namespace: '',
          labesSelect: JSON.stringify(labelsSelect)
        }
      )
      return items
    } catch (e) {
      this.logger.error(`Cannot get deployment info from cluster for ${e}`)
      throw new InternalServerErrorException('Failed to get deployment info from cluster')
    }
  }

  async getDeploymentLatestAbnormalEvents(
    args: IGetDeploymentEvents,
    authToken: string
  ): Promise<IDeploymentLatestEvents> {
    const { tenantId, projectName, appName, clusterId, types } = args
    // list deployment pods name
    await this.authService.getTenantById(tenantId, authToken)
    // validate projectName、applicationName
    await this.applicationsService.getEsApplicationByName(projectName, appName)
    const deploymentPodsInfo = await this.getDeploymentPodsInfo(args, authToken)
    const { pods } = deploymentPodsInfo

    const { env, cid, fte, clusterName } = parseClusterId(clusterId)
    // get deployment crd
    const deployment = await this.getApplicationInstanceCrd({ appName, projectName, clusterName, env, cid, fte })
    const { status } = deployment
    const { phase: crdPhase = [] } = status
    const sortedPhase = dedup<string>(crdPhase).sort()
    const phase = ftePhaseToLocaleLowerCase(sortedPhase)

    const abnormalPods = pods.filter((pod) => {
      const podType = parsePodType(pod, fte, phase)
      return podType && podType !== POD_TYPE.HEALTHY
    })

    const podsDetails: IDeploymentPodInfo[] = abnormalPods.map((k8sPod) => {
      const { name, namespace } = k8sPod.metadata || {}
      const { nodeName } = k8sPod.spec || {}

      return {
        tenantId,
        projectName,
        appName,
        name,
        namespace,
        nodeName
      }
    })

    const requestEventsTypes = types.split(';')

    const latestEvents = []
    await Promise.all(
      requestEventsTypes.map(async (type) => {
        let latestTypeEvents
        if (type === DEPLOYMENT_EVENT_TYPE.FAILED_SCHEDULING) {
          latestTypeEvents = await this.getPodsLatestFailedSchedulingEvents(podsDetails)
        } else if (type === DEPLOYMENT_EVENT_TYPE.PROBE_FAILED) {
          latestTypeEvents = await this.getPodsLatestProbeFailedEvents(podsDetails)
        }
        if (latestTypeEvents) {
          latestEvents.push({
            type,
            event: latestTypeEvents.length > 0 ? latestTypeEvents[0] : null,
            totalCount: latestTypeEvents.length
          })
        }
      })
    )

    return {
      events: latestEvents,
      totalCount: latestEvents.length
    }
  }

  async getPodsLatestFailedSchedulingEvents(podsDetails: IDeploymentPodInfo[]) {
    const reason = [REASON.FAILED_SCHEDULING, REASON.SCHEDULED]
    const podsFirstFailedSchedulingEvents: IESEvent[] = await Promise.all(
      podsDetails.map((pod) => {
        return httpLimit(async () => {
          const event = await this.getPodFirstEvent({ customPod: pod, reason })
          return event
        })
      })
    )

    const validPodsFirstFailedSchedulingEvents = podsFirstFailedSchedulingEvents.filter((event) => {
      // filter out successfully scheduled event pod
      return event && event.reason === REASON.FAILED_SCHEDULING
    })

    // desc by time
    const sortedFailedSchedulingEvents = validPodsFirstFailedSchedulingEvents.sort((preFirstEvents, curFirstEvents) => {
      const { createtime: createtimeA } = preFirstEvents
      const { createtime: createtimeB } = curFirstEvents
      const timeA = new Date(createtimeA)
      const timeB = new Date(createtimeB)
      return timeA < timeB ? 1 : -1
    })

    return sortedFailedSchedulingEvents
  }

  async getPodsLatestProbeFailedEvents(podsDetails: IDeploymentPodInfo[]) {
    const searchAll = ['probe failed']
    const podsFirstProbeFailedEvents: IESEvent[] = await Promise.all(
      podsDetails.map((pod) => {
        return httpLimit(async () => {
          const event = await this.getPodFirstEvent({ customPod: pod, searchAll })
          return event
        })
      })
    )

    const validPodsFirstProbeFailedEvents = podsFirstProbeFailedEvents.filter((event) => !!event)
    return validPodsFirstProbeFailedEvents
  }

  async getDeploymentPodsInfo(
    { clusterId, phase, projectName, appName, deployName }: IGetDeploymentEvents,
    authToken: string
  ): Promise<IDeploymentPodsInfo> {
    const { clusterName, fteName = '', cid, env } = parseClusterIdWithFte(clusterId)
    const { config: token } = await this.clustersService.findByName(clusterName)

    const oamType = await this.podsService.getOamType(
      {
        projectName,
        appName,
        deployName,
        clusterId
      },
      authToken
    )

    const agentDeployRoute = this.podsService.getAgentOamDeployRoute(oamType)

    const { phaseSet, podList } = await this.podsService.getK8sPods({
      phase,
      projectName,
      appName,
      env,
      cid,
      fteName,
      token,
      clusterName,
      agentPath: agentDeployRoute
    })

    if (podList.items && podList.items.length) {
      const validPods = podList.items.filter((k8sPod) => {
        const { labels = {} } = k8sPod.metadata || {}
        const phaseKey = getPhaseFromLabel(labels)
        // We only want pod which phase is in phaseSet
        return !!phaseSet[phaseKey]
      })

      return {
        pods: validPods as any,
        totalCount: validPods.length
      }
    } else {
      return {
        pods: [],
        totalCount: 0
      }
    }
  }

  private async getPodFirstEvent(args: IPodFirstEventsArgs): Promise<IESEvent> {
    const { customPod, reason, searchAll } = args
    const { projectName, appName, name: podName } = customPod

    const endTime = Date.now()
    const startTime = endTime - ONE_DATE_DURATION_MILLISECOND * 3
    const startDate = moment(startTime).format('YYYY-MM-DD')
    const endDate = moment(endTime).format('YYYY-MM-DD')

    const event = await this.eventService.getFirstEvent({
      startTime: startDate,
      endTime: endDate,
      query: { reason },
      searchAll,
      isCreateTimeDesc: true,
      projectName,
      appName,
      podName
    })

    return event
  }
}
