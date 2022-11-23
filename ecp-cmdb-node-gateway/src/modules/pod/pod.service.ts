import { Injectable } from '@nestjs/common'
import {
  ListDeploymentPodParam,
  ListDeploymentPodQuery,
  KillPodParam,
  KillPodBody,
  PodMetric,
  BatchKillPodParam,
  BatchKillPodBody,
  BatchKillPod,
  GetLogFileContentParams,
  GetLogFileContentQuery,
  ListLogFilesParams,
  ListLogFilesQuery,
  GetPodLogsParams,
  GetPodLogsQuery,
} from '@/modules/pod/dto/pod.dto'
import { throwError } from '@infra-node-kit/exception'
import { ERROR } from '@/helpers/constants/error'
import { format } from 'util'
import { FILTER_TYPE, ListQuery } from '@/helpers/models/list-query.dto'
import { CustomException } from '@infra-node-kit/exception/dist/models/custom-exception'
import { IModels } from '@/rapper/cmdb/request'
import { tryGetMessage } from '@/helpers/utils/try-get-message'
import { FetchService } from '@/modules/fetch/fetch.service'
import { Promise as BPromise } from 'bluebird'
import { logger } from '@infra-node-kit/logger'
import { tryCatchWithAuth } from '@/helpers/utils/try-catch-with-auth'

type ListDeploymentPodsModules =
  IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods']['Res']
type GetpodsMetricsModules =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/metrics']['Res']
type KillPodModules =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill']['Res']
type ListLogFilesModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/files']['Res']
type GetLogFileContentModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/file:read']['Res']
type GetPodLogs =
  IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/logs']['Res']
@Injectable()
export class PodService {
  constructor(private readonly fetchService: FetchService) {}

  private formatPodMetricFn = (
    metric: PodMetric['cpu'] | PodMetric['memory'],
    metricType: string,
  ) => {
    const formatMetric =
      metricType === 'cpu'
        ? {
            applied: parseFloat(metric.applied.toFixed(2)),
            used: parseFloat(metric.used.toFixed(2)),
          }
        : {
            applied: parseFloat((metric.applied / 1024).toFixed(2)),
            used: parseFloat((metric.used / 1024).toFixed(2)),
          }
    return formatMetric
  }

  async listDeploymentPods(param: ListDeploymentPodParam, query: ListDeploymentPodQuery) {
    const { sduName, deployId } = param
    const { filterBy, searchBy } = query
    const [podList, podListRequestError] = await tryCatchWithAuth<
      ListDeploymentPodsModules,
      CustomException
    >(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods']({
        sduName,
        deployId,
      }),
    )
    if (podListRequestError) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(podListRequestError?.response?.data)
      throwError({
        status,
        message: format(message, errorMessage),
        data: podListRequestError?.response?.message,
      })
    }
    const { items: podItems } = podList

    const filterList = ListQuery.parseFilterBy(filterBy)
    const filteredByStatusPods = ListQuery.getFilteredData(
      FILTER_TYPE.FILTER_BY,
      filterList,
      podItems,
    )

    const searchValue = searchBy && ListQuery.parseFilter(searchBy).value
    const searchRegexp = searchValue && new RegExp(`.*${searchValue}.*`)
    const filteredBySearchValuePods = searchRegexp
      ? filteredByStatusPods.filter(
          (pod) =>
            searchRegexp.test(pod.podName) ||
            searchRegexp.test(pod.nodeIp) ||
            searchRegexp.test(pod.podIp),
        )
      : filteredByStatusPods

    const getPodsMetricsBody = filteredBySearchValuePods.map((item) => ({
      podName: item.podName,
      namespace: item.namespace,
    }))

    const [podsMetrics, podsMetricsRequestError] = await tryCatchWithAuth<
      GetpodsMetricsModules,
      CustomException
    >(
      this.fetchService.cmdbFetch[
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/metrics'
      ]({
        deployId,
        sduName,
        pods: getPodsMetricsBody,
      }),
    )

    if (podsMetricsRequestError) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(podsMetricsRequestError?.response?.data)
      throwError({
        status,
        message: format(message, errorMessage),
        data: podsMetricsRequestError?.response?.data,
      })
    }

    const { items: podsMetricsItems } = podsMetrics

    const podListWithMetrics = filteredBySearchValuePods.map((pod) => {
      let podMetric = podsMetricsItems.find(
        (item) => item.podName === pod.podName && item.namespace === pod.namespace,
      )

      if (!podMetric) {
        logger.error(`${pod.podName} metric is not find`)
        podMetric = {
          podName: pod.podName,
          namespace: pod.namespace,
          cpu: {
            applied: 0,
            used: 0,
          },
          memory: {
            applied: 0,
            used: 0,
          },
        }
      }

      return {
        ...pod,
        cpu: this.formatPodMetricFn(podMetric.cpu, 'cpu'),
        memory: this.formatPodMetricFn(podMetric.memory, 'memory'),
      }
    })

    const statusList = podListWithMetrics.map((podItem) => podItem.status)
    const set = new Set(statusList)
    const deduplicatedStatusList = [...set]

    const orderedPodListWithMetrics = podListWithMetrics.sort((left, right) => {
      if (left.status === right.status) {
        if (left.createdTime === right.createdTime) {
          return left.podName.localeCompare(right.podName)
        }
        return right.createdTime - left.createdTime
      }
      return left.status !== 'Running' ? -1 : 1
    })

    return {
      items: orderedPodListWithMetrics,
      statusList: deduplicatedStatusList,
      total: podListWithMetrics.length,
    }
  }

  async killPod(param: KillPodParam, body: KillPodBody) {
    const { sduName, deployId, podName } = param
    const { clusterName, namespace } = body
    const [, killPodRequestError] = await tryCatchWithAuth<KillPodModules, CustomException>(
      this.fetchService.cmdbFetch[
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill'
      ]({
        sduName,
        deployId,
        podName,
        clusterName,
        namespace,
      }),
    )

    if (killPodRequestError) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(killPodRequestError?.response?.data)
      throwError({
        status,
        message: format(message, errorMessage),
        data: killPodRequestError?.response?.data,
      })
    }
  }

  async batchKillPods(param: BatchKillPodParam, body: BatchKillPodBody) {
    const { pods } = body

    const errors: string[] = []
    await BPromise.resolve(pods).map(
      async (pod: BatchKillPod) => {
        const { podName, clusterName, namespace } = pod
        const killPodParam: KillPodParam = {
          ...param,
          podName,
        }

        const [, error] = await tryCatchWithAuth<unknown, CustomException>(
          this.killPod(killPodParam, {
            clusterName,
            namespace,
          }),
        )

        if (error) {
          const errorMessage = error.message
          logger.error(`kill pod ${podName} error: ${errorMessage}`)
          errors.push(`pod name ${podName}: ${errorMessage}`)
        }
      },
      { concurrency: 30 },
    )

    if (errors.length) {
      throwError({
        status: ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR.status,
        message: `kill pods ${
          errors.length === pods.length ? 'all failed' : 'partial failed'
        }: ${errors.join(',')}`,
        data: {},
      })
    }

    return {}
  }

  async listPodFiles(param: ListLogFilesParams, query: ListLogFilesQuery) {
    const { sduName, deployId, podName } = param
    const { hostIp } = query
    const [data, error] = await tryCatchWithAuth<ListLogFilesModels, CustomException>(
      this.fetchService.cmdbFetch[
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/files'
      ]({
        sduName,
        deployId,
        podName,
        hostIp,
      }),
    )
    if (error) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(error?.response?.data)
      throwError({
        status,
        message: format(message, errorMessage),
        data: error?.response?.message,
      })
    }
    const { files } = data
    return {
      items: files,
      total: files.length,
    }
  }

  async getLogFileContent(param: GetLogFileContentParams, query: GetLogFileContentQuery) {
    const { sduName, deployId, podName } = param
    const { hostIp, length, offset, path } = query
    const [data, error] = await tryCatchWithAuth<GetLogFileContentModels, CustomException>(
      this.fetchService.cmdbFetch[
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/file:read'
      ]({
        sduName,
        deployId,
        podName,
        offset,
        length,
        hostIp,
        path,
      }),
    )
    if (error) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(error?.response?.data)
      throwError({
        status,
        message: format(message, errorMessage),
        data: error?.response?.data,
      })
    }

    return data
  }

  async getPodLogs(param: GetPodLogsParams, query: GetPodLogsQuery) {
    const [data, error] = await tryCatchWithAuth<GetPodLogs, CustomException>(
      this.fetchService.cmdbFetch[
        'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/logs'
      ]({
        ...param,
        ...query,
      }),
    )
    if (error) {
      logger.error('get pod logs error:', error)
      return {
        data: '',
      }
    }

    return data
  }
}
