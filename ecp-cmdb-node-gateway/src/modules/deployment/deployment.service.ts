import { Injectable } from '@nestjs/common'
import { throwError } from '@infra-node-kit/exception'
import { ERROR } from '@/helpers/constants/error'
import { format } from 'util'
import { IModels } from '@/rapper/cmdb/request'
import { CustomException } from '@infra-node-kit/exception/dist/models/custom-exception'
import { tryGetMessage } from '@/helpers/utils/try-get-message'
import { GetDeploymentMetaParam } from '@/modules/deployment/dtos/deployment.dto'
import {
  ListDeploymentsParam,
  ListDeploymentsQuery,
} from '@/modules/deployment/dtos/list-deployments.dto'
import {
  ScaleDeploymentBody,
  ScaleDeploymentParam,
} from '@/modules/deployment/dtos/scale-deployment.dto'
import { FetchService } from '@/modules/fetch/fetch.service'
import { ListWorkloadsQuery } from '@/modules/deployment/dtos/list-workloads.dto'
import {
  RollbackDeploymentBody,
  RollbackDeploymentParam,
} from '@/modules/deployment/dtos/rollback-deployment.dto'
import { GetDeploymentHistoryParam } from '@/modules/deployment/dtos/list-deployment-history.dto'
import { tryCatchWithAuth } from '@/helpers/utils/try-catch-with-auth'
import {
  RestartDeploymentBody,
  RestartDeploymentParam,
} from '@/modules/deployment/dtos/restart-deployment.dto'
import { tryCatch } from '@infra/utils'
import {
  ListDeploymentEventsParam,
  ListDeploymentEventsQuery,
} from '@/modules/deployment/dtos/list-deployment-events.dto'

type GetDeploymentMeta = IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/meta']['Res']
type ListDeploymentsModels = IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys']['Res']
type ScaleDeploymentModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale']['Res']
type ListWorkloadsModels = IModels['GET/ecpapi/v2/workloads']['Res']
type RollbackDeploymentModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:rollback']['Res']
type GetDeploymentHistoryModels =
  IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/deploy_history']['Res']
type GetDeploymentEventsModels =
  IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/events']['Res']
type RetsratDeploymentModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart']['Res']
type FullReleaseDeploymentModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:fullrelease']['Res']
type CancelCanaryDeploymentModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:cancelcanary']['Res']
type SuspendDeploymentModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend']['Res']
type StopDeploymentModels =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop']['Res']

@Injectable()
export class DeploymentService {
  constructor(private readonly fetchService: FetchService) {}

  async getDeploymentMeta(param: GetDeploymentMetaParam) {
    const { sduName, deployId } = param
    const [res, error] = await tryCatchWithAuth<GetDeploymentMeta, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/meta']({
        sduName,
        deployId,
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
    const { deployment } = res
    const {
      project,
      module,
      env,
      cid,
      azV1,
      azV2,
      deployEngine,
      cluster,
      clusterType,
      componentType,
      summary,
      status,
    } = deployment
    const { releaseInstances, canaryInstances } = summary
    const { containers } = status
    return {
      project,
      module,
      env,
      cid,
      azV1,
      azV2,
      deployEngine,
      cluster,
      clusterType,
      componentType,
      releaseInstances,
      canaryInstances,
      containers,
    }
  }

  async listDeployments(param: ListDeploymentsParam, query: ListDeploymentsQuery) {
    const { sduName } = param
    const { withDetail } = query
    const [deployments, error] = await tryCatchWithAuth<ListDeploymentsModels, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/svcdeploys']({
        sduName,
        withdetail: withDetail,
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

    return deployments
  }

  async scaleDeployment(param: ScaleDeploymentParam, body: ScaleDeploymentBody) {
    const { sduName, deployId } = param
    const { releaseReplicas, canaryReplicas, canaryValid } = body

    const [_, error] = await tryCatchWithAuth<ScaleDeploymentModels, CustomException>(
      this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale']({
        sduName,
        deployId,
        releaseReplicas,
        canaryReplicas,
        canaryValid,
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

    return
  }

  async rollbackDeployment(param: RollbackDeploymentParam, body: RollbackDeploymentBody) {
    const [, error] = await tryCatchWithAuth<RollbackDeploymentModels, CustomException>(
      this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:rollback']({
        ...param,
        ...body,
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

    return
  }

  async listWorkloads(query: ListWorkloadsQuery) {
    const { env } = query
    const [workloads, error] = await tryCatch<ListWorkloadsModels, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/workloads']({ env }),
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
    return workloads
  }

  async getDeploymentHistory(param: GetDeploymentHistoryParam) {
    const [result, error] = await tryCatchWithAuth<GetDeploymentHistoryModels, CustomException>(
      this.fetchService.cmdbFetch[
        'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/deploy_history'
      ]({
        ...param,
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

    const { list: deploymentHistory = [] } = result
    const formattedDeploymentHistory = deploymentHistory?.map((item) => {
      const { deploymentId, lastDeployed, containers } = item
      return {
        deploymentId,
        lastDeployed,
        containers,
      }
    })

    return {
      items: formattedDeploymentHistory,
      total: formattedDeploymentHistory.length,
    }
  }

  async listDeploymentEvents(param: ListDeploymentEventsParam, query: ListDeploymentEventsQuery) {
    const { sduName, deployId } = param
    const { offset, limit, filterBy, orderBy = 'createTime desc', startTime, endTime } = query
    const formattedOrderBy = orderBy.split(' ').join('+')
    const pageCount = Number(limit)
    const pageNum = Number(offset) / pageCount + 1
    const [data, error] = await tryCatchWithAuth<GetDeploymentEventsModels, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/events']({
        sduName,
        deployId,
        pageCount,
        pageNum,
        filter: filterBy,
        order: formattedOrderBy,
        startTime,
        endTime,
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

    const { events, kindList, total } = data

    return {
      items: events,
      kindList,
      total,
    }
  }

  async restartDeployment(param: RestartDeploymentParam, body: RestartDeploymentBody) {
    const { sduName, deployId } = param
    const { phases } = body
    const [, error] = await tryCatchWithAuth<RetsratDeploymentModels, CustomException>(
      this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart']({
        sduName,
        deployId,
        phases,
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

    return {}
  }

  async fullReleaseDeployment(param: RestartDeploymentParam) {
    const { sduName, deployId } = param
    const [, error] = await tryCatchWithAuth<FullReleaseDeploymentModels, CustomException>(
      this.fetchService.cmdbFetch[
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:fullrelease'
      ]({
        sduName,
        deployId,
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

    return {}
  }

  async cancelCanaryDeployment(param: RestartDeploymentParam) {
    const { sduName, deployId } = param
    const [, error] = await tryCatchWithAuth<CancelCanaryDeploymentModels, CustomException>(
      this.fetchService.cmdbFetch[
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:cancelcanary'
      ]({
        sduName,
        deployId,
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

    return {}
  }

  async suspendDeployment(param: RestartDeploymentParam) {
    const { sduName, deployId } = param
    const [, error] = await tryCatchWithAuth<SuspendDeploymentModels, CustomException>(
      this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend']({
        sduName,
        deployId,
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

    return {}
  }

  async stopDeployment(param: RestartDeploymentParam) {
    const { sduName, deployId } = param
    const [, error] = await tryCatchWithAuth<StopDeploymentModels, CustomException>(
      this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop']({
        sduName,
        deployId,
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

    return {}
  }
}
