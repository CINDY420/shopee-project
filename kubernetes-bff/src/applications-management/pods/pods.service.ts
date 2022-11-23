import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common'

import * as BPromise from 'bluebird'
import { ConfigService } from '@nestjs/config'
import * as k8s from '@kubernetes/client-node'
import { IGlobalConfig } from 'common/interfaces'
import { AgentService } from 'common/modules/agent/agent.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { ApplicationsService } from 'applications-management/applications/applications.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { ESService } from 'common/modules/es/es.service'
import { ClientManagerService } from 'common/modules/client-manager/client-manager.service'

import { generateClusterIdWithFteName, parseClusterIdWithFte } from 'common/helpers/cluster'
import {
  getPhaseFromStableUpper,
  getFeatureFromLabelUpper,
  getPhaseFromLabelUpper,
  parseClusterId,
  getDeploymentPhaseByDeployList
} from 'common/helpers/deployment'
import {
  getPhaseFromLabel,
  getRestartMessage,
  parsePodContainers,
  parsePodStatus,
  sortPodsByName,
  parsePodLabels,
  parsePodPorts,
  parsePodTags,
  parseVolumes,
  getPodPrefixReg,
  fillPodUsage
} from 'common/helpers/pod'
import {
  DEPLOYMENT_OAM_TYPE,
  PHASE_CANARY,
  PHASE_RELEASE,
  PHASE,
  ANNOTATIONS_TRACE_ID_KEY,
  ANNOTATIONS_CREATED_TIMESTAMP,
  ANNOTATIONS_ZONE
} from 'common/constants/deployment'
import {
  IPodListResponse,
  IDeletePodResponse,
  IApplicationInfo,
  ILabelSelector,
  IPayloadPod,
  IPodContainerFileLogResponse,
  IGetK8sPods,
  IK8sPodsResponse,
  IGetPodListQuery
} from './dto/pod.dto'
import { IMetricResponse, IMetricListResponse } from 'applications-management/projects/entities/project.entity'
import { calculateMetricsList, generateRequestList, formatDataFromGibToByte } from 'common/helpers/metrics'
import { cpuQuantityScalar, memoryQuantityScalar } from 'common/helpers/clientNodeUtils'
import { ESIndex } from 'common/constants/es'
import { GetPodDetailQueryDto, GetPodDetailParamsDto } from './dto/get-pod-detail.dto'
import { ERROR_MESSAGE } from 'common/constants/error'
import {
  EPHEMERAL_CONTAINER_VOLUME_MOUNT_NAME,
  EPHEMERAL_CONTAINER_NAME,
  EPHEMERAL_CONTAINER_VOLUME_MOUNT_PATH
} from './pods.constant'
import { IDeploymentInfo, IItem, IPodItem } from 'applications-management/deployments/dto/deployment.dto'
import { GetPodContainerParamsDto, GetPodContainerQueryDto } from './dto/get-pod-container.dto'
import { execCMDInPodContainer } from 'common/helpers/exec'

import { RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'

import { V1Pod } from '@kubernetes/client-node'
import { GetLogDirectoryParamsDto, GetLogDirectoryQueryDto } from './dto/get-log-directory.dto'
import { AuthService } from 'common/modules/auth/auth.service'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'
import { RBACCheckTenantResourceAction } from 'common/helpers/rbac'
import { paginationHandler } from 'common/helpers/pagination'
import { ENV } from 'common/constants/env'
import { NAMESPACE_PREFIX } from 'common/constants/apiServer.constants'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { IListNamespaceOamPayLoad, IOam } from 'common/interfaces/openApiService.interface'

@Injectable()
export class PodsService {
  private readonly logger = new Logger(PodsService.name)

  constructor(
    private clustersService: ClustersService,
    private agentService: AgentService,
    private applicationService: ApplicationsService,
    private metricsService: MetricsService,
    private esService: ESService,
    private clientManagerService: ClientManagerService,
    private configService: ConfigService,
    private authService: AuthService,
    private openAPI: OpenApiService
  ) {}

  getAgentOamDeployRoute(oamType: string) {
    if (oamType.includes(DEPLOYMENT_OAM_TYPE.DEPLOYMENT)) {
      return 'getdeploysbylabelselect'
    } else if (oamType.includes(DEPLOYMENT_OAM_TYPE.CLONE_SET)) {
      return 'getclonesetbylabelselect'
    } else {
      return 'getstatefulsetsbylabelselect'
    }
  }

  // now oam have two types of pod: deployment pod and statefulsets pod
  // type message is defined by oam crd spec.components.type property
  async getDeploymentPods(
    { tenantId, projectName, appName, clusterId, phase: deploymentPhase, deployName },
    authToken: string,
    authUser: IAuthUser,
    query: IGetPodListQuery
  ): Promise<IPodListResponse> {
    const { phase } = query

    await this.authService.getTenantById(tenantId, authToken)
    // validate projectName、applicationName
    await this.applicationService.getEsApplicationByName(projectName, appName)

    const { clusterName, fteName = '', cid, env } = parseClusterIdWithFte(clusterId)
    const { config: token } = await this.clustersService.findByName(clusterName)

    const oamType = await this.getOamType(
      {
        projectName,
        appName,
        deployName,
        clusterId
      },
      authToken
    )

    const deployAgentRoute = this.getAgentOamDeployRoute(oamType)

    const labelsSelect = {
      project: projectName,
      application: appName,
      env: env.toLowerCase(),
      cid: cid.toLowerCase()
    }
    const deployList: IDeploymentInfo = await this.agentService.request(
      deployAgentRoute,
      true,
      { config: token, clusterName },
      {
        labesSelect: JSON.stringify(labelsSelect)
      }
    )

    const selectedDeployList: IItem[] = []
    if (deployList.items && deployList.items.length) {
      deployList.items.forEach((deployment) => {
        const { labels = {} } = deployment.metadata || {}

        const phase: string = getPhaseFromStableUpper(labels)
        const feature: string = getFeatureFromLabelUpper(labels)
        if (
          (fteName === '' && (phase === PHASE_RELEASE || phase === PHASE_CANARY) && feature === '') ||
          (fteName !== '' && feature === fteName.toUpperCase())
        ) {
          selectedDeployList.push(deployment)
        }
      })
    }

    const cpuMemoryLimits = await this.getDeploymentCpuAndMemoryLimit({
      token,
      clusterName,
      project: projectName,
      application: appName,
      env,
      cid,
      fte: fteName,
      agentPath: deployAgentRoute,
      oamType,
      clusterId,
      phase
    })
    const { phaseSet, podList } = await this.getK8sPods({
      phase: deploymentPhase,
      projectName,
      appName,
      env,
      cid,
      fteName,
      token,
      clusterName,
      agentPath: deployAgentRoute
    })

    const normalPodList = []
    const abnormalPodList = []
    const statusMap = {}
    const phaseMap = {}

    if (podList.items && podList.items.length) {
      for (const k8sPod of podList.items) {
        const { labels = {}, name, namespace, creationTimestamp, annotations = {} } = k8sPod.metadata || {}
        const { hostIP, podIP, containerStatuses = [] } = k8sPod.status || {}
        const { nodeName, containers = [] } = k8sPod.spec || {}

        let phase: string
        if (oamType.includes(DEPLOYMENT_OAM_TYPE.CLONE_SET)) {
          // phases = ['release', 'canary']
          const phases = deploymentPhase.split('/')
          if (phases.length === 1) {
            phase = PHASE_RELEASE
          } else {
            const deployCurrentRevision = selectedDeployList[0].status.currentRevision
            const podControllerRevisionHash = labels['controller-revision-hash']
            phase = this.isControllerRevisionHashMatch(deployCurrentRevision, podControllerRevisionHash)
              ? PHASE_RELEASE
              : PHASE_CANARY
          }
        } else {
          const phaseKey = getPhaseFromLabel(labels)
          // We only want pod which phase is in phaseSet
          if (!phaseSet[phaseKey]) {
            continue
          }
          phase = phaseSet[phaseKey]
        }

        const cpuMemoryLimit = cpuMemoryLimits.find(({ type }) => type === phase)
        const { limits } = cpuMemoryLimit || cpuMemoryLimits[0]
        const { cpuLimit, memLimit } = limits
        const status = parsePodStatus(k8sPod)
        const traceId = annotations[ANNOTATIONS_TRACE_ID_KEY]

        const pod = {
          name,
          nodeName,
          projectName,
          appName,
          tenantId,
          namespace,
          cid,
          environment: env,
          nodeIP: hostIP,
          podIP,
          status,
          clusterId: generateClusterIdWithFteName(env, cid, clusterName, labels.feature),
          creationTimestamp: oamType.includes(DEPLOYMENT_OAM_TYPE.CLONE_SET)
            ? annotations[ANNOTATIONS_CREATED_TIMESTAMP]
            : creationTimestamp,
          containers: parsePodContainers(containers),
          restart: getRestartMessage(containerStatuses),
          phase,
          traceId,
          cpu: { applied: cpuLimit },
          memory: { applied: memLimit }
        }

        statusMap[status] = true
        phaseMap[phase] = true
        if (pod.status === 'Running') {
          normalPodList.push(pod)
        } else {
          abnormalPodList.push(pod)
        }
      }
    }

    const allPods = [...sortPodsByName(abnormalPodList), ...sortPodsByName(normalPodList)]

    const { items: pods, total } = paginationHandler(allPods, query)

    const simplePods = pods.map((pod) => {
      return {
        name: pod.name,
        namespace: pod.namespace
      }
    })
    const metricList = await this.metricsService.getPodsMetrics<IMetricListResponse[]>(token, simplePods, [
      'cpu_usage',
      'memory_usage',
      'limit'
    ])
    pods.forEach((pod) => {
      const metric = metricList.find((metric) => metric.podName === pod.name)
      if (metric) {
        const { cpu, memory } = calculateMetricsList([metric.metrics])
        const { applied: appliedCpu, ...cpuOthers } = cpu
        const { applied: appliedMem, ...memOthers } = memory
        pod.cpu = { ...pod.cpu, ...cpuOthers }
        pod.memory = { ...pod.memory, ...memOthers }
      }
    })

    return {
      pods,
      totalCount: total,
      statusList: Object.keys(statusMap),
      phaseList: Object.keys(phaseMap)
    }
  }

  private isControllerRevisionHashMatch(deployCurrentRevision: string, podControllerRevisionHash: string): boolean {
    if (deployCurrentRevision === podControllerRevisionHash) return true
    const deployCrShortHash = deployCurrentRevision.split('-').pop()
    const podCrShortHash = podControllerRevisionHash.split('-').pop()
    return deployCrShortHash === podCrShortHash
  }

  async getDeploymentCpuAndMemoryLimit({
    token,
    clusterName,
    project,
    application,
    env,
    cid,
    fte: fteName,
    agentPath,
    oamType,
    clusterId,
    phase
  }: {
    token: string
    clusterName: string
    project: string
    application: string
    env: string
    cid: string
    fte: string
    agentPath: string
    oamType: string
    clusterId: string
    phase: string
  }) {
    const isCloneSet = oamType.includes(DEPLOYMENT_OAM_TYPE.CLONE_SET)
    const labelsSelect = {
      project,
      application,
      env: env.toLowerCase(),
      cid: cid.toLowerCase()
    }
    const deployList: IDeploymentInfo = await this.agentService.request(
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
    items.forEach((deployment) => {
      const { labels = {} } = deployment.metadata || {}

      const phase = getPhaseFromStableUpper(labels)
      const feature = getFeatureFromLabelUpper(labels)
      if (
        (fteName === '' && (phase === PHASE_RELEASE || phase === PHASE_CANARY) && feature === '') ||
        (fteName !== '' && feature === fteName.toUpperCase())
      ) {
        selectedDeployList.push(deployment)
      }
    })

    let deploymentPhase = getDeploymentPhaseByDeployList(selectedDeployList)
    if (deploymentPhase !== PHASE.FTE && isCloneSet) {
      // Canary/Release
      deploymentPhase = phase.split('/').length > 1 ? PHASE.CANARY : PHASE.RELEASE
    }
    const phaseDeployments: { type: PHASE; deployment: IItem }[] = []
    if (deploymentPhase === PHASE.CANARY) {
      const releaseDeployment = isCloneSet
        ? selectedDeployList[0]
        : selectedDeployList.find((deployment) => !deployment?.metadata?.labels?.stable)
      const canaryDeployment = isCloneSet
        ? selectedDeployList[0]
        : selectedDeployList.find((deployment) => deployment?.metadata?.labels?.stable)
      phaseDeployments.push({ type: PHASE.RELEASE, deployment: releaseDeployment })
      phaseDeployments.push({ type: PHASE.CANARY, deployment: canaryDeployment })
    } else {
      const releaseDeployment = selectedDeployList.length && selectedDeployList[0]
      phaseDeployments.push({ type: PHASE.RELEASE, deployment: releaseDeployment })
    }

    const cpuMemoryLimits = await BPromise.resolve(phaseDeployments).map(async ({ type, deployment }) => {
      const cr = isCloneSet ? await this.agentService.getCR(clusterId, deployment, type) : undefined
      const containers = isCloneSet
        ? cr?.data.spec?.template?.spec?.containers || []
        : deployment?.spec?.template?.spec?.containers || []

      const container = containers.length && containers[0]
      // example: limits: { cpu: '1', memory: '1Gi' }
      const { cpu: cpuLimit, memory: memoryLimit } = container?.resources?.limits || {}
      const limitedCpu = cpuLimit ? cpuQuantityScalar(cpuLimit) : 0
      const limitedMemoryGib = memoryLimit ? memoryQuantityScalar(memoryLimit) : 0
      const limitedMemory = limitedMemoryGib ? formatDataFromGibToByte(limitedMemoryGib) : 0
      return {
        type,
        limits: { cpuLimit: limitedCpu, memLimit: limitedMemory }
      }
    })

    return cpuMemoryLimits
  }

  async getK8sPods({
    phase,
    projectName,
    appName,
    env,
    cid,
    fteName,
    token,
    clusterName,
    agentPath
  }: IGetK8sPods): Promise<IK8sPodsResponse> {
    const phases = phase.split('/')

    const labelsSelect = {
      project: projectName,
      application: appName,
      env: env.toLowerCase(),
      cid: cid.toLowerCase()
    }

    // get deployList to parse phaseSet
    const deployList = await this.agentService.request<k8s.V1PodList>(
      agentPath,
      true,
      { config: token, clusterName },
      {
        labesSelect: JSON.stringify(labelsSelect)
      }
    )

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

    // get phaseSet from selectedDeployList
    const phaseSet = {}
    selectedDeployList.forEach((deployment) => {
      const { labels = {} } = deployment.metadata || {}
      const deployPhase = labels.feature || getPhaseFromStableUpper(labels)

      if (phases.includes(deployPhase)) {
        const realPhase = labels.feature || getPhaseFromLabelUpper(labels)
        phaseSet[realPhase] = deployPhase
      }
    })

    const podList: any = await this.agentService.request(
      'getpodsbylabelselect',
      true,
      { clusterName, config: token },
      {
        labelsSelect: JSON.stringify(labelsSelect)
      }
    )

    return { phaseSet, podList }
  }

  async getPodDetail(
    params: GetPodDetailParamsDto,
    query: GetPodDetailQueryDto,
    authToken: string,
    authUser: IAuthUser
  ) {
    const { Scope } = authUser
    const isBot = Scope !== 'user'
    const { tenantId, projectName, appName, podName } = params
    const { clusterId } = query
    const { env, cid, clusterName } = parseClusterIdWithFte(clusterId)
    await this.authService.getTenantById(tenantId, authToken)

    try {
      const cluster = await this.esService.getById(ESIndex.CLUSTER, clusterName)

      if (!cluster) {
        throw new NotFoundException(`${ERROR_MESSAGE.REQUEST_CLUSTER_NOT_EXIST}`)
      }
    } catch (e) {
      throw new InternalServerErrorException(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR}: ${e}`)
    }

    const { config: token } = await this.clustersService.findByName(clusterName)
    const labelsSelect = {
      project: projectName,
      application: appName,
      env: env.toLowerCase(),
      cid: cid.toLowerCase()
    }
    const clusterConfig = { config: token, clusterName }

    const pod = await this.agentService.request<IPodItem>('poddetailv2', true, clusterConfig, {
      podname: podName,
      labelsSelect: JSON.stringify(labelsSelect)
    })

    const {
      metadata = { annotations: {}, labels: {}, creationTimestamp: '', namespace: '' },
      spec = { nodeName: '', containers: [], volumes: [] },
      status = { podIP: '', hostIP: '' }
    } = pod
    const { labels = {}, creationTimestamp = '', namespace = '', annotations } = metadata
    const { nodeName = '', containers = [], volumes = [] } = spec
    const { podIP = '', hostIP = '' } = status

    const phaseSet = {}
    const podPhase = labels.feature || getPhaseFromStableUpper(labels)
    const realPhase = labels.feature || getPhaseFromLabelUpper(labels)
    phaseSet[realPhase] = podPhase
    const phaseKey = getPhaseFromLabel(labels)

    const podContainers = await this.parsePodContainers(pod, token)

    let metrics = {} as IMetricResponse
    let podStatus = {} as IMetricResponse
    if (!isBot) {
      metrics = await this.getK8SPodMetrics(token, namespace, podName, 'metrics')

      podStatus = await this.getK8SPodMetrics(token, namespace, podName, 'status')
    }

    const podUsage = fillPodUsage(metrics, podStatus, true)
    const traceId = annotations?.[ANNOTATIONS_TRACE_ID_KEY]
    const zoneName = annotations?.[ANNOTATIONS_ZONE]

    return {
      name: podName,
      tenantId,
      projectName,
      appName,
      labels: parsePodLabels(labels),
      nodeName,
      nodeIP: hostIP,
      status: parsePodStatus(pod),
      clusterId,
      clusterName,
      creationTimestamp: creationTimestamp,
      volumes: parseVolumes(volumes, containers),
      containers: this.sortPodContainers(podContainers, podName),
      cid,
      environment: env,
      podIP,
      podPort: parsePodPorts(containers).join(';'),
      tag: parsePodTags(containers).join(';'),
      phase: phaseSet[phaseKey] || phaseKey,
      namespace,
      traceId,
      zoneName,
      ...podUsage
    }
  }

  private async parsePodContainers(pod: IPodItem, clusterToken: string): Promise<string[]> {
    const { spec, metadata = { name: '', namespace: '' } } = pod
    const { containers = [], volumes = [], ephemeralContainers = [] } = spec || {}

    const list = containers.map((container) => container.name)

    if (list.length === 0) {
      return list
    }

    // check hostPath
    const dockerPathExist = !!volumes.find((volume) => {
      const { hostPath, name } = volume

      return !!hostPath && name === EPHEMERAL_CONTAINER_VOLUME_MOUNT_NAME
    })

    if (!dockerPathExist) {
      return list
    }

    // try to use EphemeralContainers
    ephemeralContainers.forEach((ephemeralContainer) => {
      const { name } = ephemeralContainer
      if (name === EPHEMERAL_CONTAINER_NAME) {
        list.push(name)
      }
    })

    // try to create EphemeralContainers
    // EphemeralContainers is used to build debug commands before user used
    // these commands are in debugger/Dockerfile
    const ec = { objectMeta: {} } as any
    ec.objectMeta.name = metadata.name
    ec.objectMeta.namespace = metadata.namespace
    ec.ephemeralContainers = ephemeralContainers
    const debuggerImageName = process.env.DEBUGGER_IMAGE || 'busybox'

    ec.ephemeralContainers.push({
      ephemeralContainerCommon: {
        command: ['bash'],
        name: EPHEMERAL_CONTAINER_NAME,
        image: debuggerImageName,
        imagePullPolicy: 'IfNotPresent',
        terminationMessagePolicy: 'File',
        volumeMounts: [
          {
            name: EPHEMERAL_CONTAINER_VOLUME_MOUNT_NAME,
            mountPath: EPHEMERAL_CONTAINER_VOLUME_MOUNT_PATH,
            readOnly: true
          }
        ],
        stdin: true,
        TTY: true
      },
      targetContainerName: list[0]
    })

    let k8sClient
    try {
      k8sClient = this.clientManagerService.getClient(clusterToken)
    } catch (e) {
      return list
    }

    const coreK8sApi = k8sClient.makeApiClient(k8s.CoreV1Api)
    try {
      await coreK8sApi.patchNamespacedPod(metadata.name, metadata.namespace, ec)
    } catch (e) {
      return list
    }

    list.push(EPHEMERAL_CONTAINER_NAME)
    return list
  }

  private sortPodContainers(containers: string[] = [], podName: string) {
    if (containers.length <= 1) {
      return containers
    }

    const globalConfig = this.configService.get<IGlobalConfig>('global')
    const { podContainerNameRegex } = globalConfig

    containers.sort((a) => {
      let flag = -1
      for (const regex of podContainerNameRegex) {
        const regexp = new RegExp(regex)
        if (regexp.test(a)) {
          flag = 1
        }
      }
      return flag
    })

    const pNameRegex = getPodPrefixReg(podName)
    const regexp = new RegExp(pNameRegex)

    containers.sort((a) => {
      let flag = 1
      if (regexp.test(a)) {
        flag = -1
      }
      return flag
    })

    return containers
  }

  private async getK8SPodMetrics(token: string, namespace: string, name: string, kind: string) {
    const [requestList] = generateRequestList({ token, otherParams: { namespace, pod: name }, suffix: `/${kind}` })

    let metricsList

    try {
      metricsList = await this.metricsService.request<IMetricResponse>(requestList.path, token)
    } catch (e) {
      throw new BadRequestException(`Get pod ${kind} error: ${e}`)
    }

    return metricsList
  }

  async getPodContainerEnvs(params: GetPodContainerParamsDto, query: GetPodContainerQueryDto, authToken: string) {
    const { tenantId, projectName, appName, podName, containerName } = params
    const { clusterId } = query
    await this.authService.getTenantById(tenantId, authToken)

    const { token, namespace } = await this.checkBeforeExecCMDinPodContainer({
      projectName,
      appName,
      podName,
      containerName,
      clusterId
    })

    try {
      const result: string = await execCMDInPodContainer({
        token,
        namespace,
        podName,
        containerName,
        command: 'env'
      })

      const envStrings: Array<string> = result.split('\n').filter(Boolean)
      let lastKey = ''
      const envMap = envStrings.reduce((acc: Record<string, string>, cur: string) => {
        const entry = cur.split('=')
        const [key, value] = entry
        if (value) {
          lastKey = key
          acc[lastKey] = value.replace('\r', '')
        } else {
          acc[lastKey] += key.replace('\r', '')
        }
        return acc
      }, {})

      return {
        pairs: envMap
      }
    } catch (e) {
      throw new InternalServerErrorException(
        `Exec Pod ${podName} container ${containerName} command env failed: ${JSON.stringify(e)}`
      )
    }
  }

  async deletePod(
    projectName: string,
    appName: string,
    podName: string,
    clusterName: string
  ): Promise<IDeletePodResponse> {
    const appInfo = await this.getApplicationInfo(projectName, appName)
    if (!appInfo) {
      throw new NotFoundException(`Request app ${appName} not found!`)
    }

    await this.handlePodDelete(projectName, appName, podName, clusterName)

    return { result: `Delete pod ${podName} successfully!` }
  }

  private async getApplicationInfo(projectName: string, appName: string): Promise<IApplicationInfo> {
    const query = {
      must: [
        {
          term: { project: projectName }
        },
        {
          term: { app: appName }
        }
      ]
    }
    try {
      const res = await this.esService.booleanQueryFirst<IApplicationInfo>(ESIndex.APPLICATION, query)
      return res
    } catch (err) {
      throw new InternalServerErrorException(`search app ${appName} from es error: ${err}`)
    }
  }

  private generateLabelsSelector(projectName: string, appName: string): ILabelSelector {
    const labelsSelector = {
      project: projectName,
      application: appName
    }
    return labelsSelector
  }

  private async getPod(
    clusterConfig: string,
    clusterName: string,
    podName: string,
    labelsSelector: ILabelSelector
  ): Promise<V1Pod> {
    const body = {
      labelsSelect: JSON.stringify(labelsSelector),
      podname: podName
    }

    try {
      const podDetail = await this.agentService.request<V1Pod>(
        'poddetailv2',
        true,
        { clusterName, config: clusterConfig },
        body
      )
      return podDetail
    } catch (err) {
      if (err.status && err.status === 404) {
        throw new NotFoundException(`Request pod ${podName} detail not found!`)
      }
      throw new InternalServerErrorException(`Request pod ${podName} detail error: ${err}`)
    }
  }

  private async handlePodDelete(projectName: string, appName: string, podName: string, clusterName: string) {
    let kubeConfig: string
    try {
      const { config } = await this.clustersService.findByName(clusterName)
      kubeConfig = config
    } catch (err) {
      if (err.status && err.status === 404) {
        throw new NotFoundException(`Cluster ${clusterName} not found!`)
      }

      throw new InternalServerErrorException(`Get cluster ${clusterName} error: ${err}!`)
    }

    const labelsSelector = this.generateLabelsSelector(projectName, appName)
    const podDetail = await this.getPod(kubeConfig, clusterName, podName, labelsSelector)

    const {
      metadata: { namespace }
    } = podDetail

    const body = {
      namespace,
      podname: podName
    }

    try {
      await this.agentService.request('deletepod', false, { config: kubeConfig, clusterName }, body)
    } catch (err) {
      throw new InternalServerErrorException(`Agent delete pod ${podName} error: ${err}`)
    }
  }

  async batchDeletePods(
    authUser: IAuthUser,
    tenantId: number,
    projectName: string,
    appName: string,
    pods: IPayloadPod[],
    authToken: string
  ): Promise<IDeletePodResponse> {
    const appInfo = await this.getApplicationInfo(projectName, appName)
    if (!appInfo) {
      throw new NotFoundException(`Request app ${appName} not found!`)
    }

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    // try to delete all pods and get all results
    const deletePodsResults: any[] = await new Promise((resolve) => {
      const deleteResults = []
      pods.forEach(async (pod) => {
        const { name: podName, clusterId } = pod
        const { env, clusterName } = parseClusterIdWithFte(clusterId)

        let hasPermission = false
        if (env.toUpperCase() === ENV.live) {
          hasPermission = RBACCheckTenantResourceAction(
            tenantPermissions,
            tenantId,
            RESOURCE_TYPE.POD,
            RESOURCE_ACTION.KillLive
          )
        } else {
          hasPermission = RBACCheckTenantResourceAction(
            tenantPermissions,
            tenantId,
            RESOURCE_TYPE.POD,
            RESOURCE_ACTION.KillNonLive
          )
        }

        if (!hasPermission) {
          throw new ForbiddenException(`you do not have permission to kill pod ${podName}`)
        }

        try {
          await this.handlePodDelete(projectName, appName, podName, clusterName)
          deleteResults.push('success')
        } catch (err) {
          deleteResults.push(err)
        }

        if (deleteResults.length === pods.length) {
          resolve(deleteResults)
        }
      })
    })

    const deleteErrors = deletePodsResults.filter((result) => result instanceof Error)

    if (deleteErrors.length) {
      throw deleteErrors[0]
    }

    return { result: `Batch delete pods ${pods.map((pod) => pod.name).join(',')} successfully!` }
  }

  async getPodContainerFileLog(
    projectName: string,
    appName: string,
    podName: string,
    containerName: string,
    fileName: string,
    clusterId: string,
    searchBy: string
  ): Promise<IPodContainerFileLogResponse> {
    const { clusterName } = parseClusterIdWithFte(clusterId)
    let clusterInfo
    try {
      clusterInfo = await this.clustersService.findByName(clusterName)
    } catch (err) {
      if (err.status && err.status === 404) {
        throw new NotFoundException(`Cluster ${clusterName} not found!`)
      }
      throw new InternalServerErrorException(`Get cluster ${clusterName} error: ${err}!`)
    }

    const { config } = clusterInfo
    const labelsSelector = this.generateLabelsSelector(projectName, appName)
    const podDetail = await this.getPod(config, clusterName, podName, labelsSelector)
    const {
      status: { containerStatuses },
      metadata: { namespace }
    } = podDetail

    const isContainerRunning = containerStatuses.some((container) => {
      return container.name === containerName && !!container?.state?.running
    })
    if (!isContainerRunning) {
      throw new NotFoundException(`Request container ${containerName} not found!`)
    }

    const logString = await this.readLogFileInPodContainer(
      config,
      namespace,
      podName,
      containerName,
      fileName,
      searchBy
    )

    return { content: logString }
  }

  private async readLogFileInPodContainer(
    clusterConfig: string,
    namespace: string,
    podName: string,
    containerName: string,
    fileName: string,
    searchBy: string
  ): Promise<string> {
    // read lasted 1000 line of file in linux
    const readFileCmd = `cat "${fileName}"| tail -n 1000`

    try {
      const fileLog: string = await execCMDInPodContainer({
        token: clusterConfig,
        namespace,
        podName,
        containerName,
        command: readFileCmd
      })

      const fileLogList = fileLog.split('\n')
      const result = fileLogList.filter((text) => text.search(searchBy) >= 0).join('\n')

      return result
    } catch (e) {
      throw new InternalServerErrorException(
        `Exec Pod ${podName} container ${containerName} command env failed: ${JSON.stringify(e)}`
      )
    }
  }

  async getLogDirectory(params: GetLogDirectoryParamsDto, query: GetLogDirectoryQueryDto, authToken: string) {
    const { projectName, appName, podName, containerName, tenantId } = params
    await this.authService.getTenantById(tenantId, authToken)

    const { clusterId } = query
    const { token, namespace } = await this.checkBeforeExecCMDinPodContainer({
      projectName,
      appName,
      podName,
      containerName,
      clusterId
    })

    const logDirectories = ['$PWD', '$WORKDIR', '/workspace', '/data']
    // Fix Alpine Linux does not support 'ls' with option '--time-style=full-iso' and '-o'
    const command = logDirectories
      .map(
        (directory) =>
          `if test -d ${directory}/log  ;then ls --full-time -lhgR ${directory}/log |sed -r s'/\\s+/|/g'; fi`
      )
      .join(';')

    try {
      const files = []
      const result: string = await execCMDInPodContainer({
        token,
        namespace,
        podName,
        containerName,
        command
      })

      if (!result) {
        return { files }
      }

      let curDir = '/'
      /**
       * result data template
       * /etc/modprobe.d:
        /data/log:
        total|69M
        drwxr-xr-x|2|root|4.0K|2021-09-24|07:11:51.638778495|+0000|5487c7f679m2hzh
        drwxr-xr-x|2|root|4.0K|2021-09-28|06:24:36.029535790|+0000|b66f8d54cb8clr
        drwxr-xr-x|2|root|4.0K|2021-09-23|10:45:33.991216607|+0000|fcfb4b6c9r2lnr

        /data/log/5487c7f679m2hzh:
        total 75M
        -rw-r--r-- 1 root 75M 2021-09-26 08:16:16.880920712 +0000 data.log

        /data/log/5568db975fngxqz:
        total 7.8M
        -rw-r--r-- 1 root 7.8M 2021-10-08 11:44:04.612829966 +0000 data.log
|     */
      const entries = result.split('\n').filter(Boolean)
      entries.forEach((entry) => {
        const items = entry.split('|')

        if (items.length === 1 && items[0].length > 0 && items[0][0] === '/') {
          // Means this item is a directory string
          curDir = items[0]
        }
        if (items.length < 8) {
          // Means this is not a valid log file string, a valid log file string is like: -rwxr-xr-x 1 0 2020-12-09 19:35:03.996613584 +0800 daemon.log
          // When we use '|' split it, item's length >= 8
          return
        }

        const mod = items[0]

        if (mod !== '' && mod[0] === '-') {
          // If item[0] start with -, that means it is the string of file permissions like -rwxr-xr-x
          files.push({
            name: `${curDir.replace(':\r', '')}/${items[7].replace('\r', '')}`,
            updateTime: `${items[4]} ${items[5]} ${items[6]}`,
            filesSize: items[3]
          })
        }
      })

      return {
        files
      }
    } catch (e) {
      throw new InternalServerErrorException(
        `Exec Pod ${podName} container ${containerName} command ${command} failed: ${JSON.stringify(e)}`
      )
    }
  }

  async checkBeforeExecCMDinPodContainer({ projectName, appName, podName, containerName, clusterId }) {
    const { clusterName } = parseClusterIdWithFte(clusterId)

    try {
      const cluster = await this.esService.getById(ESIndex.CLUSTER, clusterName)

      if (!cluster) {
        throw new NotFoundException(`${ERROR_MESSAGE.REQUEST_CLUSTER_NOT_EXIST}`)
      }
    } catch (e) {
      throw new InternalServerErrorException(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR}: ${e}`)
    }

    const { config: token } = await this.clustersService.findByName(clusterName)
    const labelsSelect = {
      project: projectName,
      application: appName
    }

    const pod = await this.agentService.request<IPodItem>(
      'poddetailv2',
      true,
      { config: token, clusterName },
      {
        podname: podName,
        labelsSelect: JSON.stringify(labelsSelect)
      }
    )

    const containerStatuses = pod?.status?.containerStatuses
    if (!containerStatuses) {
      throw new InternalServerErrorException(
        `container statuses is null, labelsSelect: ${JSON.stringify(labelsSelect)},  podName: ${podName}`
      )
    }
    const containerStatus = containerStatuses.find((containerStatus) => containerStatus.name === containerName)
    const isContainerRunning = !!containerStatus?.state?.running

    if (!isContainerRunning) {
      throw new NotFoundException(ERROR_MESSAGE.REQUEST_CONTAINER_NOT_EXIST)
    }

    const { metadata } = pod
    const { namespace } = metadata

    return {
      token,
      namespace,
      pod
    }
  }

  async getPodPreviousLog(
    tenantId: number,
    clusterId: string,
    podName: string,
    containerName: string,
    projectName: string,
    appName: string,
    token: string
  ): Promise<string> {
    const commonErrorMessage = `log ${podName} ${containerName} error`
    let namespace = ''

    const { clusterName } = parseClusterIdWithFte(clusterId)

    const cluster = await this.esService.getById(ESIndex.CLUSTER, clusterName)
    if (!cluster) {
      const message = `${commonErrorMessage}: cluster ${clusterName} not exist!`
      this.logger.error(message)
      return message
    }
    const { config } = await this.clustersService.findByName(clusterName)
    const labelsSelector = this.generateLabelsSelector(projectName, appName)
    const pod = await this.getPod(config, clusterName, podName, labelsSelector)

    const { metadata } = pod
    namespace = metadata?.namespace
    const result = await this.openAPI.getPodPreviousLog(
      {
        tenantId,
        projectName,
        appName,
        podName,
        namespace
      },
      token
    )
    return result
  }

  async getApplicationInstanceOAM(
    params: {
      projectName: string
      appName: string
      deployName: string
      clusterId: string
    },
    authToken: string
  ): Promise<IOam> {
    const { projectName, appName, deployName, clusterId } = params
    const { env, cid, fte, clusterName } = parseClusterId(clusterId)

    const payload: IListNamespaceOamPayLoad = {
      project: projectName,
      application: appName,
      clusterName,
      env: env.toLowerCase(),
      cid: cid.toLowerCase(),
      namespace: `${NAMESPACE_PREFIX}${projectName}`
    }

    if (fte) {
      payload.feature = fte
    }

    let applicationInstanceOamList = await this.openAPI.listNamespaceOam(payload, authToken)

    if (!fte) {
      // filter out all fte phase oam crd
      applicationInstanceOamList = applicationInstanceOamList.filter((oam) => {
        const { feature = '' } = oam?.labels || {}
        return feature === ''
      })
    }
    if (applicationInstanceOamList.length !== 1) {
      this.logger.error(
        `List applicationInstanceOamList Error: deploy ${deployName} oamlist length not match 1 but ${applicationInstanceOamList.length} `
      )
      throw new HttpException(
        `get ${deployName} oamlist length not match 1 but ${applicationInstanceOamList.length}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
    const applicationInstanceOam = applicationInstanceOamList[0]
    return applicationInstanceOam
  }

  async getOamType(
    params: { projectName: string; appName: string; deployName: string; clusterId: string },
    authToken: string
  ) {
    let oamType = ''
    try {
      const applicationInstanceOam = await this.getApplicationInstanceOAM(params, authToken)
      oamType = applicationInstanceOam?.spec?.components[0]?.type
    } catch (e) {
      this.logger.error(`List applicationInstanceOamList Error: deploy ${params.deployName} ${e}`)
    }

    return oamType
  }
}
