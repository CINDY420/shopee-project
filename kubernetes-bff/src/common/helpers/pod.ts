import { IPodBaseResponse } from 'applications-management/pods/dto/pod.dto'
import { ANNOTATION_GROUP } from 'common/constants/annotation'
import { PHASE_RELEASE, PHASE_FEATURE_TEST, PHASE_PFB } from 'common/constants/deployment'
import { IInitContainers, IPodItem } from 'applications-management/deployments/dto/deployment.dto'
import { IMetricResponse } from 'applications-management/projects/entities/project.entity'

import { dedup } from 'common/helpers/array'
import { getPhaseFromStableUpper } from 'common/helpers/deployment'
import { RFC3339DateString } from 'common/helpers/date'

import {
  METRIC_NAME_POD_CPU_REQUEST,
  METRIC_NAME_POD_MEMORY_REQUEST,
  METRIC_NAME_POD_MEMORY_RSS,
  METRIC_NAME_POD_FS_USAGE,
  MEMORY_USAGE_RE,
  MEMORY_LIMIT_RE,
  CPU_LIMIT_RE,
  CPU_USAGE_RE,
  GiB_2_BYTE,
  CPU_REQUEST_OR_LIMIT,
  MEM_REQUEST_OR_LIMIT,
  MEM_RSS,
  CPU_USAGE,
  MEM_USAGE,
  FS_USAGE
} from 'applications-management/pods/pods.constant'

export const getPhaseFromLabel = (label: { [map: string]: string }): string => {
  const { phase = '', feature = '' } = label || {}
  const upperPhase = phase.toUpperCase()
  if (upperPhase === PHASE_FEATURE_TEST || upperPhase === PHASE_PFB) {
    return feature
  }
  if (upperPhase === '') {
    return PHASE_RELEASE
  }
  return upperPhase
}

export const getGroupFromAnnotationOrLabel = (
  annotations: { [map: string]: string },
  label: { [map: string]: string }
): string => {
  const group = label.group || annotations[ANNOTATION_GROUP]
  if (group) {
    return group.replace(/-/g, ' ')
  }
  return 'Default'
}

export const parsePodContainers = (containers) =>
  containers.map((container) => {
    const { image, name } = container
    const tag = image.split(':')[1]
    return {
      image,
      name,
      tag
    }
  })

export const getRestartMessage = (containerStatuses) => {
  let restartCount = 0
  let lastRestartTime = ''

  containerStatuses.forEach((status) => {
    const { restartCount: count, lastState = {} } = status
    if (count > restartCount) {
      restartCount = count
    }

    if (lastState.terminated && lastState.terminated.finishedAt > lastRestartTime) {
      lastRestartTime = lastState.terminated.finishedAt
    }
  })

  return {
    restartCount,
    lastRestartTime
  }
}

export const parsePodStatusRaw = (pod: any): string => {
  const { reason: podReason, phase, containerStatuses = [], initContainerStatuses = [] } = pod.status || {}

  let reason = podReason || phase

  let initializing = false
  for (const [i, container] of initContainerStatuses.entries()) {
    const { waiting, terminated } = container.state || {}

    if (terminated && terminated.exitCode === 0) {
      continue
    } else if (terminated) {
      if (terminated.reason) {
        reason = 'Init:' + terminated.reason
      } else {
        reason = terminated.signal !== 0 ? `Init:Signal:${terminated.signal}` : `Init:ExitCode:${terminated.exitCode}`
      }
      initializing = true
    } else if (waiting && waiting.reason && waiting.reason !== 'PodInitializing') {
      reason = `Init:${waiting.reason}`
      initializing = true
    } else {
      reason = `Init:${i}/${pod.spec.initContainers && pod.spec.initContainers.length}`
      initializing = true
    }

    break
  }

  if (!initializing) {
    let hasRunning = false
    // 这部分go代码就是倒着遍历的，原因后端同学也记不清了，所以迁移时保持原状
    for (let i = containerStatuses.length - 1; i >= 0; i--) {
      const container = containerStatuses[i]
      const { waiting, terminated, running } = container.state || {}

      if (waiting && waiting.reason !== '') {
        reason = waiting.reason
      } else if (terminated && terminated.reason !== '') {
        reason = terminated.reason
      } else if (terminated && terminated.reason === '') {
        reason = terminated.signal !== 0 ? `Signal:${terminated.signal}` : `ExitCode:${terminated.exitCode}`
      } else if (container.ready && running !== undefined) {
        hasRunning = true
      }
    }

    // change pod status back to "Running" if there is at least one container still reporting as "Running" status
    if (reason === 'Completed' && hasRunning) {
      reason = 'Running'
    }
  }

  if (pod.metadata.deletionTimestamp !== undefined) {
    reason = podReason === 'NodeLost' ? 'Unknown' : 'Terminating'
  }

  return reason
}

export const parsePodStatus = (pod: any): string => {
  const reason = parsePodStatusRaw(pod)
  const { conditions = [] } = pod.status || {}

  if (reason === 'Running') {
    for (const condition of conditions) {
      const { type, status, reason } = condition || {}
      if ((type === 'ContainersReady' || type === 'Ready') && status === 'False') {
        return reason
      }
    }
  }
  return reason
}

export const sortPodsByName = (podList: IPodBaseResponse[]) => {
  return podList.sort((a, b) => {
    return a.name > b.name ? 1 : -1
  })
}

export const parsePodLabels = (labels: { [map: string]: string }) => {
  const res = []
  for (const key in labels) {
    res.push(`${key}:${labels[key]}`)
  }

  return res
}

export const parsePodPorts = (containers: IInitContainers[]) => {
  return dedup(
    containers.reduce((accumulator, container) => {
      const { ports = [] } = container
      return accumulator.concat(ports.map((port) => port.containerPort))
    }, [])
  )
}

export const parsePodTags = (containers: IInitContainers[]) => {
  const res = []

  containers.forEach((container) => {
    const { image } = container
    const tags = image.split(':')
    if (tags.length === 2) {
      res.push(tags[1])
    }
  })

  return dedup(res)
}

export const parseVolumes = (volumes: any[], containers: IInitContainers[]) => {
  const mapVolumes = {}
  volumes.forEach((volume) => {
    if (volume.hostPath) {
      const volumeInfo = {
        name: volume.name,
        type: 'HostPath',
        source: volume.hostPath.path
      }
      mapVolumes[volume.name] = volumeInfo
    }
    if (volume.configMap) {
      const volumeInfo = {
        name: volume.name,
        type: 'ConfigMap',
        source: volume.configMap.name
      }
      mapVolumes[volume.name] = volumeInfo
    }
    if (volume.secret) {
      const volumeInfo = {
        name: volume.name,
        type: 'Secret',
        source: volume.secret.secretName
      }
      mapVolumes[volume.name] = volumeInfo
    }
  })

  const list = []
  containers.forEach((container) => {
    const { volumeMounts } = container
    volumeMounts.forEach((volumeMount) => {
      const vol = mapVolumes[volumeMount.name]
      if (vol) {
        vol.MountPoint = volumeMount.mountPath
        if (volumeMount.readOnly) {
          vol.ReadOnly = 'TRUE'
        } else {
          vol.ReadOnly = 'FALSE'
        }
        list.push(vol)
      }
    })
  })
  return list
}

export const getPodPrefixReg = (str: string) => {
  const reverseStr = str.split('').reverse().join('')

  const tmp = reverseStr.indexOf('-')
  const pos = reverseStr.indexOf('-', tmp + 1)

  return `^${reverseStr[pos - 1] || ''}.*$`
}

const parsePodUsage = (metric: IMetricResponse) => {
  const ready = {
    [CPU_REQUEST_OR_LIMIT]: 0,
    [MEM_REQUEST_OR_LIMIT]: 0,
    [CPU_USAGE]: 0,
    [MEM_USAGE]: 0,
    [FS_USAGE]: 0,
    [MEM_RSS]: 0,
    CPURequestOrLimitReady: false,
    MemRequestOrLimitReady: false,
    CPUUsageReady: false,
    MemUsageReady: false,
    MemRssReady: false,
    FsUsageReady: false
  }

  const { data = { result: [] } } = metric
  const { result = [] } = data

  for (const info of result) {
    if (!info) {
      continue
    }

    let usageValue, usageName
    const { metric = { name: ' ' }, values } = info
    const { __name__: name } = metric

    if (name === METRIC_NAME_POD_CPU_REQUEST) {
      usageValue = ready[CPU_REQUEST_OR_LIMIT]
      usageName = CPU_REQUEST_OR_LIMIT
      ready.CPURequestOrLimitReady = true
    } else if (name === METRIC_NAME_POD_MEMORY_REQUEST) {
      usageValue = ready[MEM_REQUEST_OR_LIMIT]
      usageName = MEM_REQUEST_OR_LIMIT
      ready.MemRequestOrLimitReady = true
    } else if (name === METRIC_NAME_POD_MEMORY_RSS) {
      usageValue = ready[MEM_RSS]
      usageName = MEM_RSS
      ready.MemRssReady = true
    } else if (RegExp(CPU_USAGE_RE).test(name)) {
      usageValue = ready[CPU_USAGE]
      usageName = CPU_USAGE
      ready.CPUUsageReady = true
    } else if (RegExp(MEMORY_USAGE_RE).test(name)) {
      usageValue = ready[MEM_USAGE]
      usageName = MEM_USAGE
      ready.MemUsageReady = true
    } else if (name === METRIC_NAME_POD_FS_USAGE) {
      usageValue = ready[FS_USAGE]
      usageName = FS_USAGE
      ready.FsUsageReady = true
    } else if (RegExp(CPU_LIMIT_RE).test(name)) {
      usageValue = ready[CPU_REQUEST_OR_LIMIT]
      usageName = CPU_REQUEST_OR_LIMIT
      ready.CPURequestOrLimitReady = true
    } else if (RegExp(MEMORY_LIMIT_RE).test(name)) {
      usageValue = ready[MEM_REQUEST_OR_LIMIT]
      usageName = MEM_REQUEST_OR_LIMIT
      ready.MemRequestOrLimitReady = true
    }

    if (usageValue !== null || usageValue !== undefined) {
      for (const value of values) {
        if (value.length === 2) {
          const valueStr = value[1]
          const valueNum = parseFloat(valueStr)
          if (valueNum) {
            usageValue = valueNum
          }
        }
      }
    }

    const target = ready[usageName]
    if (target !== null || target !== undefined) {
      ready[usageName] = usageValue
    }
  }

  ready[CPU_USAGE] *= ready[CPU_REQUEST_OR_LIMIT]
  ready[MEM_USAGE] *= ready[MEM_REQUEST_OR_LIMIT]

  return ready
}

const parsePodMetrics = (metric: IMetricResponse) => {
  const ready = {
    CPUPoints: [],
    MemPoints: [],
    FsPoints: [],
    CPUReady: false,
    MemReady: false,
    FsReady: false
  }

  const { data = { result: [] } } = metric
  const { result = [] } = data

  for (const res of result) {
    if (!res.values) {
      continue
    }

    let pointsPointer = []
    const { metric = { name: '' }, values } = res
    const { __name__: name } = metric

    if (RegExp(CPU_USAGE_RE).test(name)) {
      pointsPointer = ready.CPUPoints
      ready.CPUReady = true
    } else if (RegExp(MEMORY_USAGE_RE).test(name)) {
      pointsPointer = ready.MemPoints
      ready.MemReady = true
    } else if (name === METRIC_NAME_POD_FS_USAGE) {
      pointsPointer = ready.FsPoints
      ready.FsReady = true
    }

    if (pointsPointer) {
      for (const value of values) {
        if (value.length === 2) {
          const time = parseInt(value[0])
          const usageStr = value[1]
          const usageNum = parseFloat(usageStr)
          if (usageNum) {
            pointsPointer.push({ x: RFC3339DateString(new Date(time * 1000)), y: usageNum })
          }
        }
      }
    }
  }

  return ready
}

const adjustGraph = (points: any[], base) => {
  const res = []
  for (const point of points) {
    const newPoint = {
      x: point.x,
      y: point.y * base
    }
    res.push(newPoint)
  }
  return res
}

export const fillPodUsage = (metrics: IMetricResponse, podStatus: IMetricResponse, percentMode: boolean) => {
  const uReady = parsePodUsage(podStatus)
  const mReady = parsePodMetrics(metrics)

  const pod = { cpu: {} as any, memory: {} as any, filesystem: {} as any, memRss: {} as any }

  if (percentMode) {
    pod.cpu.graph = adjustGraph(mReady.CPUPoints, 100)
  } else {
    pod.cpu.graph = adjustGraph(mReady.CPUPoints, uReady[CPU_REQUEST_OR_LIMIT])
  }
  pod.cpu.used = uReady[CPU_USAGE]
  pod.cpu.capacity = uReady[CPU_REQUEST_OR_LIMIT]
  pod.cpu.ready = mReady.CPUReady && uReady.CPUUsageReady && uReady.CPURequestOrLimitReady

  if (percentMode) {
    pod.memory.graph = adjustGraph(mReady.MemPoints, 100)
  } else {
    pod.memory.graph = adjustGraph(mReady.MemPoints, uReady[MEM_REQUEST_OR_LIMIT] / GiB_2_BYTE)
  }

  pod.memory.used = uReady[MEM_USAGE]
  pod.memory.capacity = uReady[MEM_REQUEST_OR_LIMIT]
  pod.memory.ready = mReady.MemReady && uReady.MemUsageReady && uReady.MemRequestOrLimitReady

  pod.memRss.used = uReady[MEM_RSS]
  pod.memRss.ready = uReady.MemRssReady

  pod.filesystem.graph = mReady.FsPoints
  pod.filesystem.used = uReady[FS_USAGE]
  pod.filesystem.ready = mReady.FsReady && uReady.FsUsageReady

  // 没在后段端代码里面出现的赋值操作，但是返回值又带上了的
  pod.filesystem.capacity = 0
  pod.memRss.capacity = 0
  pod.memRss.graph = null
  pod.memory.status = ''
  pod.memRss.status = ''
  pod.filesystem.status = ''
  pod.cpu.status = ''

  return pod
}
