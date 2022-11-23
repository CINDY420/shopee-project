import { Injectable } from '@nestjs/common'
import { ListSduParam, ListSduQuery } from '@/modules/sdu/dtos/list-sdu.dto'
import { FetchService } from '@/modules/fetch/fetch.service'

import { throwError } from '@infra-node-kit/exception'
import { ERROR } from '@/helpers/constants/error'
import { CustomException } from '@infra-node-kit/exception/dist/models/custom-exception'
import { format } from 'util'
import { IModels } from '@/rapper/cmdb/request'
import { IModels as ISpaceModles } from '@/rapper/space/request'
import { tryGetMessage } from '@/helpers/utils/try-get-message'
import { Promise as BPromise } from 'bluebird'
import { ListSDUHpaEnabledAZsParam } from '@/modules/sdu/dtos/list-sdu-hpa-enabled-azs.dto'
import { ScaleSDUBody, ScaleSDUParam } from '@/modules/sdu/dtos/scale-sdu.dto'
import {
  GetEnabledSduAutoScalerParam,
  GetEnabledSduAutoScalerQuery,
} from '@/modules/sdu/dtos/get-enabled-sdu-auto-scaler.dto'
import { logger } from '@infra-node-kit/logger'
import { BindSDUsBody, BindSDUsParam } from '@/modules/sdu/dtos/bind-sdus.dto'
import { UnbindSDUParam } from '@/modules/sdu/dtos/unbind-sdu.dto'
import { RestartSDUParam, RestartSDUBody } from '@/modules/sdu/dtos/restart-sdu.dto'
import { SuspendSDUParam, SuspendSDUBody } from '@/modules/sdu/dtos/suspend-sdu.dto'
import { StopSDUParam, StopSDUBody } from '@/modules/sdu/dtos/stop-sdu.dto'
import {
  ListRollbackableSDUParam,
  ListRollbackableSDUQuery,
} from '@/modules/sdu/dtos/list-rollbackable-sdu.dto'
import { RollbackSDUsBody, DeploymentRollbackHistory } from '@/modules/sdu/dtos/rollback-sdus.dto'
import { DeploymentHistory } from '@/modules/sdu/dtos/list-sdus-history.dto'
import { GetUnboundSDUsQuery } from '@/modules/sdu/dtos/get-unbound-sdus.dto'
import { tryCatchWithAuth } from '@/helpers/utils/try-catch-with-auth'
import { DeploymentRollbackPreview } from '@/modules/sdu/dtos/get-sdus-rollback-preview.dto'
import { uniqBy, uniq, groupBy } from 'lodash'
import { ApiServerService } from '@/shared/apiServer/apiServer.service'
import { tryCatch } from '@infra/utils'
import { FILTER_TYPE, ListQuery } from '@/helpers/models/list-query.dto'

type ListSduModels = IModels['GET/ecpapi/v2/services/{serviceName}/sdus']['Res']
type BulkGetSdus = IModels['GET/ecpapi/v2/services/{serviceName}/bulk_get_sdus']['Res']
type BulkGetDeployments =
  IModels['POST/ecpapi/v2/services/{serviceName}/bulk_get_deployments']['Res']
type ListDeployments = IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys']['Res']
type ListlistSDUHpaEnabledAZsModels = IModels['GET/ecpapi/v2/sdus/{sduName}/hpas']['Res']
type GetEnabledAutoScaleModels =
  ISpaceModles['GET/apis/autoscaler/v1/service/acknowledgement_status']['Res']
type SaleDeplomentModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale']['Res']
type GetUnboundSDUsModels = ISpaceModles['GET/apis/cmdb/v2/service/get_unbounded_sdus']['Res']
type BindSDUModels = ISpaceModles['POST/apis/cmdb/v2/service/bind_sdu']['Res']
type UnbindSDUModels = ISpaceModles['POST/apis/cmdb/v2/service/unbind_sdu']['Res']
type RestartSDUModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart']['Res']
type SuspendSDUModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend']['Res']
type StopSDUModels = IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop']['Res']
type RollbackDeploymentModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:rollback']['Res']
type GetDeploymentHistoryModels =
  IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/deploy_history']['Res']
type GetDeploymentPreviewModels =
  IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/deploy_preview']['Res']

export const DEPLOY_ENGINE = {
  OAM: 'OAM',
  BROMO: 'Bromo',
}
export const STATUS = {
  ABNORMAL: 'Abnormal',
  NORMAL: 'Normal',
  UNHEALTHY: 'Unhealthy',
  HEALTHY: 'Healthy',
  DEPLOYING: 'Deploying',
  STOPED: 'Stopped',
}

const RUNNING_STATUS = {
  RUNNING_HEALTHY: 'Running_Healthy',
  RUNNING_UNKNOWN: 'Running_Unknown',
}

@Injectable()
export class SduService {
  constructor(
    private readonly fetchService: FetchService,
    private readonly apiServerService: ApiServerService,
  ) {}

  async ping() {
    return await tryCatchWithAuth(this.fetchService.cmdbFetch['GET/ecpapi/v2/check']())
  }

  private convertMegaByteToGigabyte = (megabyte: number) => Math.floor(megabyte / 1024)

  async listSdus(param: ListSduParam, query: ListSduQuery) {
    const { serviceName } = param
    const { isGroup, offset = 0, limit = 10, searchBy, filterBy, orderBy, sduFilterBy } = query

    const [promConfig, getPromConfigError] = await tryCatch(this.apiServerService.getPromConfig())
    if (getPromConfigError) {
      logger.error('get promConfig error:', getPromConfigError)
    }

    const [sduList, listSduError] = await tryCatchWithAuth<BulkGetSdus, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/services/{serviceName}/bulk_get_sdus']({
        serviceName,
        isGroup,
      }),
    )
    if (listSduError) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(listSduError?.response?.data)
      throwError({
        status,
        message: format(message, errorMessage),
        data: listSduError?.response?.message,
      })
    }
    const { items } = sduList
    const sduWithSummary = items.map((item) => {
      const { summary, ...rest } = item
      const validSummary = summary
        ? {
            targetInstances: summary.targetInstances,
            unhealthyInstances: summary.unhealthyInstances,
            state: summary.state,
            disk: summary.disk === 0 ? 0 : parseFloat(summary.disk.toFixed(2)),
            cpu: summary.cpu,
            mem: this.convertMegaByteToGigabyte(summary.mem),
            lastDeployed: summary.lastDeployed,
          }
        : {
            targetInstances: 0,
            unhealthyInstances: 0,
            state: STATUS.ABNORMAL,
            disk: 0,
            cpu: 0,
            mem: 0,
            lastDeployed: 0,
          }
      return {
        ...rest,
        summary: validSummary,
      }
    })

    let newSources = sduWithSummary
    if (searchBy) {
      const searchByList = ListQuery.parseFilterBy(searchBy)
      newSources = ListQuery.getFilteredData(FILTER_TYPE.SEARCH_BY, searchByList, sduWithSummary)
    }
    if (sduFilterBy) {
      const filterList = ListQuery.parseFilterBy(sduFilterBy)
      newSources = ListQuery.getFilteredData(FILTER_TYPE.FILTER_BY, filterList, newSources)
    }

    const currentOrderBy = orderBy ?? 'summary.targetInstances desc'
    newSources = newSources.sort(ListQuery.getCompareFunction(currentOrderBy))

    const totalItemCount = newSources.length
    const totalOfInstances = newSources.reduce((acc, curr) => acc + curr.summary.targetInstances, 0)

    const end = Number(offset) + Number(limit)
    newSources = newSources.slice(offset, end)
    const sdus = newSources.map((item) => item.sdu)

    const [deployments, deploymentsError] = await tryCatchWithAuth<
      BulkGetDeployments,
      CustomException
    >(
      this.fetchService.cmdbFetch['POST/ecpapi/v2/services/{serviceName}/bulk_get_deployments']({
        serviceName,
        sdus,
      }),
    )
    if (deploymentsError) {
      logger.error('OpenApi request deployments errors:', deploymentsError)
    }
    let newDeploymentSources = (deployments?.items || []).map((item) => {
      const { summary } = item
      const { state, unknownInstances } = summary || {}
      if (state === STATUS.HEALTHY) {
        return {
          ...item,
          summary: {
            ...summary,
            state:
              unknownInstances > 0
                ? RUNNING_STATUS.RUNNING_UNKNOWN
                : RUNNING_STATUS.RUNNING_HEALTHY,
          },
        }
      }
      return item
    })
    if (filterBy) {
      const filterList = ListQuery.parseFilterBy(filterBy)
      newDeploymentSources = ListQuery.getFilteredData(
        FILTER_TYPE.FILTER_BY,
        filterList,
        newDeploymentSources,
      )
    }
    newDeploymentSources = newDeploymentSources.sort(ListQuery.getCompareFunction(currentOrderBy))
    const groupByDeployments = groupBy(newDeploymentSources, (item) => item.sduName)
    const sduWithDeployments = newSources.map((sduData) => {
      const { sdu, summary } = sduData
      const deployments = groupByDeployments?.[sdu] || []
      const formattedDeployments = deployments.map((deployment) => {
        const { deployId, sduName, azV1, cluster, componentType, status, summary, deployEngine } =
          deployment
        const { containers, orchestrator, reason } = status
        const {
          targetInstances,
          unhealthyInstances,
          unknownInstances,
          state,
          disk,
          cpu,
          mem,
          lastDeployed,
        } = summary
        const monitoringClusterName = promConfig?.find(
          (item) => item.Name === cluster,
        )?.MonitoringName

        return {
          deployId,
          sduName,
          azV1,
          cluster,
          monitoringClusterName,
          deployEngine,
          componentType,
          status: {
            containers,
            orchestrator,
            reason,
          },
          summary: {
            targetInstances,
            unhealthyInstances,
            unknownInstances,
            state,
            disk: disk === 0 ? 0 : parseFloat(disk.toFixed(2)),
            cpu,
            mem: this.convertMegaByteToGigabyte(mem),
            lastDeployed,
          },
        }
      })

      return {
        ...sduData,
        summary,
        deployments: formattedDeployments,
      }
    })

    return {
      items: sduWithDeployments,
      total: totalItemCount,
      totalOfInstances,
    }
  }

  async listSDUHpaEnabledAZs(param: ListSDUHpaEnabledAZsParam) {
    const { sduName } = param
    const [sduHpas, error] = await tryCatchWithAuth<
      ListlistSDUHpaEnabledAZsModels,
      CustomException
    >(this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/hpas']({ sduName }))
    if (error) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(error?.response?.data)
      logger.error(`get sdu ${sduName} hpa error: ${errorMessage}`)
      throwError({
        status,
        message: format(message, errorMessage),
        data: error?.response?.message,
      })
    }
    const { items } = sduHpas
    const azs = items?.map((item) => item?.meta?.az)

    return {
      azs,
    }
  }

  async getEnabledSduAutoScale(
    _param: GetEnabledSduAutoScalerParam,
    query: GetEnabledSduAutoScalerQuery,
  ) {
    const { project, module } = query
    const [data, error] = await tryCatchWithAuth<GetEnabledAutoScaleModels, CustomException>(
      this.fetchService.spaceFetch['GET/apis/autoscaler/v1/service/acknowledgement_status']({
        project,
        module,
      }),
    )
    if (error) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(error?.response?.data, 'error_detailed')
      logger.error(`get ${project}/${module} auto scaler error: ${errorMessage}`)
      throwError({
        status,
        message: format(message, errorMessage),
        data: error?.response?.message,
      })
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { toggle_state } = data
    return {
      enabledAutoScale: toggle_state === 1,
    }
  }

  async scaleSDU(param: ScaleSDUParam, body: ScaleSDUBody) {
    const { sduName } = param
    const { deployments } = body

    const errors: string[] = []
    await BPromise.resolve(Object.entries(deployments)).map(async ([deployId, data]) => {
      const { instances } = data
      const [_, error] = await tryCatchWithAuth<SaleDeplomentModels, CustomException>(
        this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale']({
          sduName,
          deployId,
          ...instances,
        }),
      )

      if (error) {
        const { meta } = data
        const { az, componentType } = meta
        const errorMessage = tryGetMessage(error?.response?.data)
        const deploymentMeta = `${sduName}/${az}/${componentType}`
        logger.error(`scale deployment ${deploymentMeta} error: ${errorMessage}`)
        errors.push(`deployment name ${deploymentMeta}: ${errorMessage}`)
      }
    })
    if (errors.length) {
      throwError({
        status: ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR.status,
        message: `scale deployments ${
          errors.length === Object.entries(deployments).length ? 'all failed' : 'partial failed'
        }: ${errors.join(',')}`,
        data: {},
      })
    }

    return {}
  }

  async getUnboundSDUs(query: GetUnboundSDUsQuery) {
    const { sduPrefix } = query
    const [data, error] = await tryCatchWithAuth<GetUnboundSDUsModels, CustomException>(
      this.fetchService.spaceFetch['GET/apis/cmdb/v2/service/get_unbounded_sdus']({
        resource_type: 'CONTAINER',
      }),
    )
    if (error) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(error?.response?.data, 'error_detailed')
      logger.error(`get unbound sdus error: ${errorMessage}`)
      throwError({
        status,
        message: format(message, errorMessage),
        data: error?.response?.message,
      })
    }
    const { sdus: sduList = [] } = data
    if (sduPrefix) {
      const availlableSDUs = sduList
        .filter((d): boolean => d?.sdu?.startsWith(sduPrefix))
        .map((item) => item?.sdu)
      return {
        sdus: availlableSDUs,
      }
    }

    const sdus = sduList.map((item) => item.sdu)

    return { sdus }
  }

  async bindSDUs(param: BindSDUsParam, body: BindSDUsBody) {
    const { serviceName } = param
    const { sdus, force } = body

    const errors: string[] = []
    await BPromise.resolve(sdus).map(async (sdu) => {
      const [_, error] = await tryCatchWithAuth<BindSDUModels, CustomException>(
        this.fetchService.spaceFetch['POST/apis/cmdb/v2/service/bind_sdu']({
          service_name: serviceName,
          sdu,
          resource_type: 'CONTAINER',
          force,
        }),
      )

      if (error) {
        const errorMessage = tryGetMessage(error?.response?.data, 'error_detailed')
        logger.error(`bind sdu ${sdu} error: ${errorMessage}`)
        errors.push(`bind sdu ${sdu}: ${errorMessage}`)
      }
    })
    if (errors.length) {
      throwError({
        status: ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR.status,
        message: `kill pods ${
          errors.length === sdus.length ? 'all failed' : 'partial failed'
        }: ${errors.join(',')}`,
        data: {},
      })
    }

    return {}
  }

  async unbindSDU(param: UnbindSDUParam) {
    const { serviceName, sduName } = param
    const [, error] = await tryCatchWithAuth<UnbindSDUModels, CustomException>(
      this.fetchService.spaceFetch['POST/apis/cmdb/v2/service/unbind_sdu']({
        service_name: serviceName,
        resource_type: 'CONTAINER',
        sdu: sduName,
      }),
    )

    if (error) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(error?.response?.data, 'error_detailed')
      logger.error(`unbind sdu error: ${errorMessage}`)
      throwError({
        status,
        message: format(message, errorMessage),
        data: error?.response?.message,
      })
    }

    return
  }

  async restartSDU(param: RestartSDUParam, body: RestartSDUBody) {
    const { sduName } = param
    const { deployRestarts } = body

    const errors: string[] = []
    await BPromise.resolve(deployRestarts).map(async (deployRestart) => {
      const { deployId, phases } = deployRestart
      const [_, error] = await tryCatchWithAuth<RestartSDUModels, CustomException>(
        this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart']({
          sduName,
          deployId,
          phases,
        }),
      )
      if (error) {
        const errorMessage = tryGetMessage(error?.response?.data)
        const deployRestartMeta = `${sduName}-${deployId}`
        logger.error(`restart deployment ${deployRestartMeta} error: ${errorMessage}`)
        errors.push(`restart deployment ${deployRestartMeta}: ${errorMessage}`)
      }
    })
    if (errors.length) {
      throwError({
        status: ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR.status,
        message: `restart deployments ${
          errors.length === deployRestarts.length ? 'all failed' : 'partial failed'
        }: ${errors.join(',')}`,
        data: {},
      })
    }

    return {}
  }

  async suspendSDU(param: SuspendSDUParam, body: SuspendSDUBody) {
    const { sduName } = param
    const { deployIds } = body

    const errors: string[] = []
    await BPromise.resolve(deployIds).map(async (deployId) => {
      const [_, error] = await tryCatchWithAuth<SuspendSDUModels, CustomException>(
        this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend']({
          sduName,
          deployId,
        }),
      )
      if (error) {
        const errorMessage = tryGetMessage(error?.response?.data)
        const deploySuspendMeta = `${sduName}-${deployId}`
        logger.error(`suspend deployment ${deploySuspendMeta} error: ${errorMessage}`)
        errors.push(`suspend deployment ${deploySuspendMeta}: ${errorMessage}`)
      }
    })
    if (errors.length) {
      throwError({
        status: ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR.status,
        message: `suspend deployments ${
          errors.length === deployIds.length ? 'all failed' : 'partial failed'
        }: ${errors.join(',')}`,
        data: {},
      })
    }

    return {}
  }

  async stoptSDU(param: StopSDUParam, body: StopSDUBody) {
    const { sduName } = param
    const { deployIds } = body

    const errors: string[] = []
    await BPromise.resolve(deployIds).map(async (deployId) => {
      const [_, error] = await tryCatchWithAuth<StopSDUModels, CustomException>(
        this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop']({
          sduName,
          deployId,
        }),
      )
      if (error) {
        const errorMessage = tryGetMessage(error?.response?.data)
        const deployStopMeta = `${sduName}-${deployId}`
        logger.error(`stop deployment ${deployStopMeta} error: ${errorMessage}`)
        errors.push(`stop deployment ${deployStopMeta}: ${errorMessage}`)
      }
    })
    if (errors.length) {
      throwError({
        status: ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR.status,
        message: `stop deployments ${
          errors.length === deployIds.length ? 'all failed' : 'partial failed'
        }: ${errors.join(',')}`,
        data: {},
      })
    }

    return {}
  }

  async listBromoDeployments(sdu: string) {
    const [deploymentsData, listDeploymentsError] = await tryCatchWithAuth<
      ListDeployments,
      CustomException
    >(this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/svcdeploys']({ sduName: sdu }))
    if (listDeploymentsError) {
      const { message, ...others } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(listDeploymentsError?.response?.data)

      throwError({
        ...others,
        message: format(message, errorMessage),
      })
    }
    const { items: deployments = [] } = deploymentsData || {}
    const filteredDeployments = deployments.filter(
      (deployment) => deployment?.deployEngine === 'Bromo',
    )
    const rollbackableDeployments = filteredDeployments.map((deployment) => {
      const { deployId } = deployment
      return deployId
    })
    return rollbackableDeployments
  }

  async listRollbackableSDU(param: ListRollbackableSDUParam, query: ListRollbackableSDUQuery) {
    const { serviceName } = param
    const { env } = query
    const [data, listSDUError] = await tryCatchWithAuth<ListSduModels, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/services/{serviceName}/sdus']({
        serviceName,
        filterBy: `env==${env}`,
      }),
    )
    if (listSDUError) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(listSDUError?.response?.data)
      throwError({
        status,
        message: format(message, errorMessage),
        data: listSDUError?.response?.message,
      })
    }
    const { items } = data
    const sdus = items.map((item) => item.sdu)

    return {
      items: sdus,
      total: sdus.length,
    }
  }

  async rollbackSDUs(body: RollbackSDUsBody) {
    const { rollbackSDUsData } = body

    const errors: string[] = []
    await BPromise.resolve(rollbackSDUsData).map(async (rollbackData) => {
      const { sdu, deployments } = rollbackData
      await BPromise.resolve(deployments).map(async (deployment) => {
        const { deploymentId, targetDeploymentId } = deployment
        const [_, error] = await tryCatchWithAuth<RollbackDeploymentModels, CustomException>(
          this.fetchService.cmdbFetch[
            'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:rollback'
          ]({
            sduName: sdu,
            deployId: deploymentId,
            deploymentId: targetDeploymentId,
          }),
        )
        if (error) {
          const errorMessage = tryGetMessage(error?.response?.data)
          const rollbackDeployMeta = `${sdu}/${deploymentId}`
          logger.error(`rollback deployment ${rollbackDeployMeta} error: ${errorMessage}`)
          errors.push(`rollback deployment ${rollbackDeployMeta}: ${errorMessage}`)
        }
      })
    })
    if (errors.length) {
      const deploymentLength = rollbackSDUsData.reduce(
        (prev: DeploymentRollbackHistory[], curr) => {
          const { deployments } = curr
          return deployments.concat(prev)
        },
        [],
      )
      throwError({
        status: ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR.status,
        message: `rollback deployments ${
          errors.length === deploymentLength.length ? 'all failed' : 'partial failed'
        }: ${errors.join(',')}`,
        data: {},
      })
    }

    return {}
  }

  private sortDeploymentHisroty = (history: DeploymentHistory[]) =>
    history.sort((a, b) => b.lastDeployed - a.lastDeployed)

  private getBromoRollbackableDeploymenyHistory = async (sdu: string, deployment: string) => {
    const [deploymentHistoryData, getDeploymentHistoryError] = await tryCatchWithAuth<
      GetDeploymentHistoryModels,
      CustomException
    >(
      this.fetchService.cmdbFetch[
        'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/deploy_history'
      ]({
        sduName: sdu,
        deployId: deployment,
      }),
    )
    if (getDeploymentHistoryError) {
      const { message, ...others } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(getDeploymentHistoryError?.response?.data)
      throwError({
        ...others,
        message: format(message, errorMessage),
      })
    }
    const { list: deploymentHistory = [] } = deploymentHistoryData
    const filterdDeploymentHistory = deploymentHistory?.filter(
      (item) =>
        item.state !== 'Running' &&
        item.state !== 'Deploying' &&
        !item.containers?.[0]?.phase.startsWith('CANARY_'),
    )

    return this.sortDeploymentHisroty(filterdDeploymentHistory)
  }

  async listSDUsHistory(sdus: string[]) {
    const sdusDeploymentsHistoriesData = await BPromise.resolve(sdus).map(async (sdu) => {
      const bromoDeployments = await this.listBromoDeployments(sdu)
      const sduDeploymentsHistoriesData = await BPromise.resolve(bromoDeployments).map(
        async (deployment) => {
          const deploymentHistory = await this.getBromoRollbackableDeploymenyHistory(
            sdu,
            deployment,
          )
          const uniqedDeploymentHistory = uniqBy(
            deploymentHistory,
            (item) => item?.containers?.[0]?.tag,
          )
          if (uniqedDeploymentHistory.length === 0) return null
          const formattedDeploymentHistory = uniqedDeploymentHistory.map((item) => {
            const { deploymentId, lastDeployed, containers } = item
            return {
              deploymentId,
              lastDeployed,
              containers,
            }
          })
          return formattedDeploymentHistory
        },
      )
      const filteredSDUDeploymentsHistoriesData = sduDeploymentsHistoriesData.filter(
        (item): item is DeploymentHistory[] => item !== null,
      )
      const flatSDUDeploymentsHistoriesData = filteredSDUDeploymentsHistoriesData.reduce(
        (prev: DeploymentHistory[], curr) => curr.concat(prev),
        [],
      )
      return flatSDUDeploymentsHistoriesData
    })

    const sdusDeploymentsHistories = sdusDeploymentsHistoriesData.reduce(
      (prev: DeploymentHistory[], curr) => curr.concat(prev),
      [],
    )
    const uniqedSDUsDeploymentsHistories = uniqBy(
      this.sortDeploymentHisroty(sdusDeploymentsHistories),
      (item) => item?.containers?.[0]?.tag,
    )
    const tags = uniqedSDUsDeploymentsHistories.map((item) => item?.containers?.[0].tag)

    return {
      items: uniq(tags),
      total: tags.length,
    }
  }

  async getSDUsRollbackPreview(targetTag: string, sdus: string[]) {
    const sdusRollbackPreview = await BPromise.resolve(sdus).map(async (sdu) => {
      const bromoDeployments = await this.listBromoDeployments(sdu)
      const deploymentsPreview = await BPromise.resolve(bromoDeployments).map(
        async (deployment) => {
          const deploymentHistory = await this.getBromoRollbackableDeploymenyHistory(
            sdu,
            deployment,
          )
          const targetDeployment = deploymentHistory.find(
            (item) => item.containers?.[0]?.tag === targetTag,
          )
          if (!targetDeployment) return
          const [deploymentPreview, getDeploymentPreviewError] = await tryCatchWithAuth<
            GetDeploymentPreviewModels,
            CustomException
          >(
            this.fetchService.cmdbFetch[
              'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/deploy_preview'
            ]({
              sduName: sdu,
              deployId: deployment,
              deploymentId: targetDeployment.deploymentId,
            }),
          )
          if (getDeploymentPreviewError) return null
          const { old: current, new: target } = deploymentPreview

          return {
            deployId: deployment,
            targetDeploymentId: targetDeployment.deploymentId,
            az: current?.az,
            currentTag: current?.tag,
            currentInstances: current?.totalInstances,
            targetTag: target?.tag,
            targetInstances: target?.totalInstances,
          }
        },
      )
      const filteredDeploymentsPreview = deploymentsPreview.filter(
        Boolean,
      ) as DeploymentRollbackPreview[]
      return {
        sdu,
        previews: filteredDeploymentsPreview,
      }
    })

    return {
      items: sdusRollbackPreview,
      total: sdusRollbackPreview.length,
    }
  }
}
