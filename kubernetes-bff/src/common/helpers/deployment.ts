import { cloneDeep, isNumber } from 'lodash'
import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common'
import {
  IDeploymentInfo,
  IItem,
  IContainers,
  IDeploymentAuth,
  IPodItem,
  IDeploymentCrdInfo,
  ScaleDeploys
} from 'applications-management/deployments/dto/deployment.dto'

import {
  PHASE_CANARY,
  PHASE_RELEASE,
  PHASE_DEPRECATED,
  INIT,
  SIGNAL,
  EXIT_CODE,
  POD_STATUS,
  POD_TYPE,
  REASON,
  POD_CONDITIONS,
  GREEN,
  BLUE,
  PHASE,
  DEPLOYMENT_OAM_TYPE
} from 'common/constants/deployment'
import { ERROR_MESSAGE } from 'common/constants/error'

import { memoryQuantityScalar, cpuQuantityScalar } from 'common/helpers/clientNodeUtils'

export const filterDeploymentsByFteName = (deploymentInfo: IDeploymentInfo, fteName: string): IItem[] => {
  const { items } = deploymentInfo

  return items.filter((item) => {
    const { metadata = { labels: { feature: '', phase: '' } } } = item
    const { labels } = metadata

    const tPhase = labels.feature || labels.phase || ''
    const tFeature = labels.feature || ''

    if (
      (fteName === '' && (tPhase.toUpperCase() === PHASE_RELEASE || tPhase.toUpperCase() === PHASE_CANARY)) ||
      (fteName !== '' && tFeature.toUpperCase() === fteName.toUpperCase())
    ) {
      return true
    }

    return false
  })
}

export const parseClusterId = (clusterId: string) => {
  if (!clusterId.includes(':')) {
    return {}
  }

  let [fte, envWrap, clusterName] = clusterId.split(':')
  if (!clusterName) {
    clusterName = envWrap
    envWrap = fte
    fte = undefined
  }
  const [env, cid] = envWrap.split('-')

  return {
    fte,
    env,
    cid,
    clusterName
  }
}

export const generateDeploymentName = (appName: string, env: string, cid: string) =>
  `${appName}-${env && env.toLowerCase()}-${cid && cid.toLowerCase()}`

export const parseDeploymentName = (deployName: string) => {
  const items = deployName.split('-')
  const length = items.length
  if (length < 3) {
    throw new HttpException('Deployment Name param error!', HttpStatus.BAD_REQUEST)
  }
  const cid = items.pop()
  const env = items.pop()
  const app = items.join('-')
  return { cid, env, app }
}

export const buildContainers = (containers: Pick<IContainers, 'name' | 'image'>[]) => {
  const res = []
  containers.forEach((container) => {
    const { name, image } = container
    const [, tag] = image.split(':')
    res.push({
      name,
      image,
      tag
    })
  })

  return res
}

export const buildContainerDetails = (containers: IContainers[], phases: string[], canaryContainers: IContainers[]) => {
  const res = {}

  phases.forEach((phase) => {
    res[phase] = []

    let targetContainers
    if (phase === PHASE_CANARY) {
      targetContainers = canaryContainers
    } else {
      targetContainers = containers
    }

    targetContainers.forEach((container) => {
      const { name, limits } = container
      res[phase].push({
        name,
        cpuLimit: limits?.cpu && cpuQuantityScalar(limits.cpu.toString()),
        memLimit: limits?.memory && memoryQuantityScalar(limits.memory.toString())
      })
    })
  })

  return res
}

export const ftePhaseToLocaleLowerCase = (phases: string[]) => {
  return phases.map((phase) => {
    if (phase === PHASE_CANARY || phase === PHASE_RELEASE) return phase
    return phase.toLocaleLowerCase()
  })
}

export const buildClusters = (clusters: string[], env: string, cid: string, fteName: string) => {
  const result = {}
  clusters.forEach((cluster) => {
    result[cluster] = `${fteName ? fteName + ':' : ''}${env}-${cid}:${cluster}`
  })

  return result
}

export const populateDeploymentWithAuthInfo = (phase: string[], oamType: string) => {
  const deploy: IDeploymentAuth = {}
  deploy.rollbackable = true

  deploy.scalable = deploy.rollbackable
  deploy.restartable = oamType.includes(DEPLOYMENT_OAM_TYPE.CLONE_SET) ? false : deploy.rollbackable
  deploy.fullreleaseable = deploy.rollbackable
  // deploy.killable = deploy.rollbackable
  deploy.editresourceable = deploy.rollbackable

  if (phase.indexOf(PHASE_CANARY) > -1) {
    deploy.rollbackable = false
    deploy.fullreleaseable = deploy.fullreleaseable && true
  } else {
    deploy.fullreleaseable = false
  }
  return deploy
}

const buildPodStatusReason = (pod: IPodItem) => {
  const {
    status = { phase: '', reason: '', initContainerStatuses: [], containerStatuses: [] },
    spec = { initContainers: [] },
    deletionTimestamp
  } = pod
  const { phase, reason: podReason = '', initContainerStatuses = [], containerStatuses = [] } = status
  const { initContainers } = spec

  let reason = phase
  if (podReason !== '') {
    reason = podReason
  }

  let initializing = false
  const initContainerStatusesLen = initContainerStatuses.length
  for (let i = 0; i < initContainerStatusesLen; i++) {
    const container = initContainerStatuses[i]
    const {
      state: { terminated, waiting }
    } = container

    if (terminated && terminated.exitCode === 0) continue
    if (terminated) {
      const { exitCode, signal, reason: terminatedReason } = terminated
      if (terminatedReason.length === 0) {
        if (signal !== 0) {
          reason = `${INIT}${SIGNAL}${signal}`
        } else {
          reason = `${INIT}${EXIT_CODE}${exitCode}`
        }
      } else {
        reason = `${INIT}${terminatedReason}`
      }
      initializing = true
    } else if (waiting && waiting.reason.length > 0 && waiting.reason !== REASON.POD_INITIALIZING) {
      reason = `${INIT}${waiting.reason}`
      initializing = true
    } else {
      reason = `${INIT}${i}/${initContainers.length}`
      initializing = true
    }
  }

  if (!initializing) {
    let hasRunning = false

    const containerStatusesLen = containerStatuses.length
    for (let i = 0; i < containerStatusesLen; i++) {
      const container = containerStatuses[i]

      const {
        ready,
        state: { running, waiting, terminated }
      } = container

      if (waiting && waiting.reason !== '') {
        reason = waiting.reason
      } else if (terminated && terminated.reason !== '') {
        reason = terminated.reason
      } else if (terminated && terminated.reason === '') {
        if (terminated.signal !== 0) {
          reason = `${SIGNAL}${terminated.signal}`
        } else {
          reason = `${EXIT_CODE}${terminated.exitCode}`
        }
      } else if (ready && running) {
        hasRunning = true
      }
    }

    if (reason === REASON.COMPLETED && hasRunning) {
      reason = REASON.RUNNING
    }
  }

  if (deletionTimestamp && podReason === REASON.NODE_LOST) {
    reason = REASON.UNKNOWN
  } else if (deletionTimestamp) {
    reason = REASON.TERMINATING
  }

  return reason
}

const parsePodStatus = (pod: IPodItem) => {
  const reason = buildPodStatusReason(pod)

  if (reason === REASON.RUNNING) {
    const { status = { conditions: [] } } = pod
    const { conditions } = status
    const len = conditions.length
    for (let i = 0; i < len; i++) {
      const condition = conditions[i]
      if (condition.type === POD_CONDITIONS.CONTAINERS_READY && condition.status === 'False') {
        return condition.reason
      }

      if (condition.type === POD_CONDITIONS.READY && condition.status === 'False') {
        return condition.reason
      }
    }
  }

  return reason
}

export const getFeatureFromLabelUpper = (label: { [map: string]: string }) => {
  const feature = label.feature
  if (feature) {
    return feature.toUpperCase()
  }

  return ''
}

const getStableFromLabel = (label: { [map: string]: string }) => {
  const stable = label.stable
  if (stable) {
    return stable
  }

  return ''
}

export const getPhaseFromStableUpper = (label: { [map: string]: string }) => {
  let phase = label.phase
  if (phase) {
    phase = phase.toUpperCase()
    if (phase === PHASE_DEPRECATED) {
      return PHASE_DEPRECATED
    }
  }
  const stable = getStableFromLabel(label)
  phase = PHASE_RELEASE
  if (stable === 'false') {
    phase = PHASE_CANARY
  }
  return phase
}

export const getPhaseFromLabelUpper = (label: { [kkk: string]: string }) => {
  const feature = getFeatureFromLabelUpper(label)
  if (feature !== '') {
    return feature.toUpperCase()
  }

  if (label.phase) {
    return label.phase.toUpperCase()
  }

  return PHASE_RELEASE
}

export const buildAbnormalPod = (pods: IPodItem[], podCount: number, fte = '', realPhaseList: string[]) => {
  const abnormalPod = {
    runningUnhealth: 0,
    error: 0,
    crashBackOff: 0,
    other: 0
  }
  let normalPod = 0

  if (!pods) {
    return { normalPod, abnormalPod }
  }

  pods.forEach((pod) => {
    const podType = parsePodType(pod, fte, realPhaseList)
    if (podType === POD_TYPE.ERROR) {
      abnormalPod.error++
    } else if (podType === POD_TYPE.CRASH_LOOP_BACK_OFF) {
      abnormalPod.crashBackOff++
    } else if (podType === POD_TYPE.HEALTHY) {
      normalPod++
    } else if (podType === POD_TYPE.UNHEALTHY) {
      abnormalPod.runningUnhealth++
    } else if (podType === POD_TYPE.OTHER) {
      abnormalPod.other++
    }
  })

  const desiredPod = podCount

  const abPod = abnormalPod.runningUnhealth + abnormalPod.error + abnormalPod.crashBackOff + abnormalPod.other
  if (abPod + normalPod < desiredPod) {
    abnormalPod.other += desiredPod - abPod - normalPod
  }

  return { normalPod, abnormalPod }
}

export const parsePodType = (pod: IPodItem, fte = '', realPhaseList: string[]) => {
  const { metadata = { labels: {} } } = pod
  const { labels } = metadata

  const tPhase = getPhaseFromLabelUpper(labels)
  const tFeature = getFeatureFromLabelUpper(labels)
  if (
    (fte === '' && (realPhaseList.indexOf(tPhase) > -1 || tPhase === GREEN || tPhase === BLUE)) ||
    (fte !== '' && tFeature === fte.toUpperCase())
  ) {
    const status = parsePodStatus(pod)
    if (status === POD_STATUS.ERROR) {
      return POD_TYPE.ERROR
    } else if (status === POD_STATUS.CRASH_LOOP_BACK_OFF) {
      return POD_TYPE.CRASH_LOOP_BACK_OFF
    } else if (status === POD_STATUS.RUNNING) {
      return POD_TYPE.HEALTHY
    } else if (status === POD_STATUS.CONTAINERS_NOT_READY) {
      return POD_TYPE.UNHEALTHY
    } else {
      return POD_TYPE.OTHER
    }
  }
}

export const scaleApplicationInstance = (deploymentCrd: IDeploymentCrdInfo, scaleDeploys: ScaleDeploys) => {
  const deploy = cloneDeep(deploymentCrd)
  const { spec = { deploySpec: { replicas: undefined }, canaryDeploySpec: { replicas: undefined } } } = deploy
  const { deploySpec, canaryDeploySpec } = spec

  const { canaryCount, releaseCount } = scaleDeploys

  if (deploySpec) {
    deploySpec.replicas = releaseCount
  }

  if (canaryDeploySpec) {
    canaryDeploySpec.replicas = canaryCount
  }

  return deploy
}

export const cancelCanaryApplicationInstance = (deploymentCrd: IDeploymentCrdInfo) => {
  const deploy = cloneDeep(deploymentCrd)
  const { spec = { deploySpec: { replicas: undefined }, canaryDeploySpec: { replicas: undefined } } } = deploy
  const { deploySpec, canaryDeploySpec } = spec

  const releaseCount = deploySpec.replicas
  const canaryCount = canaryDeploySpec.replicas

  if (deploySpec && canaryDeploySpec) {
    deploySpec.replicas = releaseCount + canaryCount
    canaryDeploySpec.replicas = 0
  }

  return deploy
}

export const fullReleaseApplicationInstance = (deploymentCrd: IDeploymentCrdInfo) => {
  const deploy = cloneDeep(deploymentCrd)
  const { spec = { deploySpec: { replicas: undefined }, canaryDeploySpec: { replicas: undefined } } } = deploy
  const { deploySpec, canaryDeploySpec } = spec

  if (deploySpec && isNumber(deploySpec.replicas) && canaryDeploySpec && isNumber(canaryDeploySpec.replicas)) {
    canaryDeploySpec.replicas += deploySpec.replicas
    deploySpec.replicas = 0
  }

  return deploy
}

export const getDeploymentPhaseByDeployList = (selectedDeployList: any[]) => {
  let deploymentPhase: PHASE

  if (selectedDeployList.length === 2) {
    deploymentPhase = PHASE.CANARY
  } else if (
    selectedDeployList.length === 1 &&
    !selectedDeployList[0].metadata.labels.stable &&
    !selectedDeployList[0].metadata.labels.feature
  ) {
    deploymentPhase = PHASE.RELEASE
  } else if (selectedDeployList.length === 1 && selectedDeployList[0].metadata.labels.feature) {
    deploymentPhase = PHASE.FTE
  } else {
    throw new InternalServerErrorException(ERROR_MESSAGE.REQUEST_DEPLOYMENT_UNKNOWN_PHASE)
  }
  return deploymentPhase
}
