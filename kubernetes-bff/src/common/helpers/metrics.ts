import {
  METRICS_READY_KEY_MAP,
  USAGE_ALARM_BOTTOM,
  USAGE_ALARM_UP,
  USAGE_ALARM_FREE_MESSAGE,
  USAGE_ALARM_USED_MESSAGE
} from 'common/constants/metrics'
import { IMetricResponse } from 'applications-management/projects/entities/project.entity'
import { IMetrics, IUsage } from 'applications-management/projects/dto/project.quotas.dto'

export interface IGeneratePathParams {
  prefix?: string
  suffix: string
  params: { [key: string]: string }
}

export type GeneratePathFn = (params: IGeneratePathParams) => string

/**
 * Used to generate request path for metrics service
 * @param {
 *    prefix: url prefix, default to '/api/v1'
 *    suffix: url suffix, such as 'status'、'metrics'
 *    params: resource name map
 * }
 * @returns request url
 *
 * @example
 *    generatePath({ suffix: 'status', params: { node: 'node-111' } })
 *    returns  '/api/v1/nodes/node-111/status'
 */
export const generatePath: GeneratePathFn = ({ prefix = '/api/v2', suffix, params }) => {
  let path = prefix

  // nodes
  if (params.node) {
    path += `/nodes/${params.node}`
  }

  // namespaced resources
  if (params.namespace) {
    path += `/namespaces/${params.namespace}`

    if (params.pod) {
      path += `/pods/${params.pod}`
      path += suffix
      return path
    }

    throw new Error('incomplete/incorrect namespaced resources')
  }

  // tenanted resources
  if (params.tenant) {
    path += `/tenants/${params.tenant}`
  }

  if (params.project) {
    path += `/projects/${params.project}`
  }

  if (params.env) {
    path += `/envs/${params.env}`
  }

  if (params.application) {
    path += `/applications/${params.application}`
  }

  path += suffix

  return path
}

export interface IGenerateRequestListParams {
  token: string
  tenantName?: string
  envName?: string
  otherParams?: {
    [key: string]: string
  }
  suffix?: string
}

export type GenerateRequestList = (params: IGenerateRequestListParams) => { token: string; path: string }[]

export const generateRequestList: GenerateRequestList = ({
  token,
  tenantName,
  envName,
  otherParams = {},
  suffix = '/status'
}) => {
  const requestList = []
  const params = otherParams

  if (tenantName) {
    params.tenant = tenantName.replace(/ /g, '-')
  }
  if (envName) {
    params.env = envName
  }

  const path = generatePath({ suffix, params })

  requestList.push({ token, path })

  // In order to be compatible with the old interface, tenantName with '' should be requested twice
  // if (tenantName && tenantName.includes(' ')) {
  //   const params2 = {
  //     ...otherParams,
  //     tenant: tenantName.replace(/ /g, '-'),
  //     env: envName
  //   }
  //   const path = generatePath({ suffix, params: params2 })

  //   requestList.push({ token, path })
  // }

  return requestList
}

export type CalculateMetricsListFn = (metricsList: IMetricResponse[]) => IMetrics

export const calculateMetricsList: CalculateMetricsListFn = (metricsList) => {
  let cpuUsage = -1
  let memUsage = -1
  let fsUsage = -1
  let cpuRequestOrLimit = -1
  let memRequestOrLimit = -1

  const calculatedMetrics: IMetrics = {
    cpu: {
      used: 0,
      applied: 0
    },
    filesystem: {
      used: 0,
      applied: 0
    },
    memory: {
      used: 0,
      applied: 0
    }
  }

  metricsList.forEach((metrics) => {
    metrics.data.result.forEach((result) => {
      const key = result.metric.__name__
      const value = Number(result.values[0][1])

      if (key.endsWith(METRICS_READY_KEY_MAP._cpu_request_core)) {
        cpuRequestOrLimit = value
      } else if (key.endsWith(METRICS_READY_KEY_MAP._memory_request_byte)) {
        memRequestOrLimit = value
      } else if (key.endsWith(METRICS_READY_KEY_MAP._cpu_usage_rate)) {
        cpuUsage = value
      } else if (key.endsWith(METRICS_READY_KEY_MAP._memory_usage_rate)) {
        memUsage = value
      } else if (key.endsWith(METRICS_READY_KEY_MAP._filesystem_usage_bytes_sum)) {
        fsUsage = value
      } else if (key.endsWith(METRICS_READY_KEY_MAP.cpu_limit_core)) {
        cpuRequestOrLimit = value
      } else if (key.endsWith(METRICS_READY_KEY_MAP.memory_limit_bytes)) {
        memRequestOrLimit = value
      }
    })
  })

  cpuUsage = cpuUsage * cpuRequestOrLimit
  memUsage = memUsage * memRequestOrLimit

  if (cpuUsage >= 0 && cpuRequestOrLimit >= 0) {
    calculatedMetrics.cpu.used = cpuUsage
    calculatedMetrics.cpu.applied = cpuRequestOrLimit
    calculatedMetrics.cpu.Ready = true
  }
  if (memUsage >= 0 && memRequestOrLimit >= 0) {
    calculatedMetrics.memory.used = memUsage
    calculatedMetrics.memory.applied = memRequestOrLimit
    calculatedMetrics.memory.Ready = true
  }
  if (fsUsage >= 0) {
    calculatedMetrics.filesystem.used = fsUsage
    calculatedMetrics.filesystem.Ready = true
  }

  return calculatedMetrics
}

export const calculateUsageAlarm = (usage: IUsage): string => {
  let result = ''
  if (usage.used >= usage.applied * USAGE_ALARM_UP) {
    result = USAGE_ALARM_USED_MESSAGE
  }
  if (usage.used <= usage.applied * USAGE_ALARM_BOTTOM) {
    result = USAGE_ALARM_FREE_MESSAGE
  }
  return result
}

export const formatDataFromGibToByte = (gibNum: number) => {
  const byteNumber = gibNum * (1024 * 1024 * 1024)
  return byteNumber
}
