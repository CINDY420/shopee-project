import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import {
  ListTasksParams,
  ListTasksQuery,
  ListDeploymentHistoryParams,
  ListDeploymentHistoryQuery,
  GetDeploymentParams,
  GetDeploymentQuery,
} from '@/features/deployment/dto/deployment.dto'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'

@Injectable()
export class DeploymentService {
  constructor(private readonly openApiService: OpenApiService) {}

  async listTasks(listTasksParams: ListTasksParams, listTasksQuery: ListTasksQuery) {
    const { filterBy } = listTasksQuery
    const filters = ListQuery.parseMustFiltersToKeyValuesMap(filterBy)
    const { searchValue: searchValues = [], az: azs = [], status: statusFilters = [] } = filters

    if (azs.length === 0) {
      throwError(ERROR.SYSTEM_ERROR.DEPLOYMENT_ERROR.REQUEST_ERROR, 'az must not be empty')
    }
    const allTasks = await this.openApiService.listAllTasks(listTasksParams, azs[0])

    const filteredByStatusTasks =
      statusFilters.length === 0 ? allTasks : allTasks.filter((task) => task.status === statusFilters[0])

    const searchRegexp = new RegExp(`.*${searchValues[0]}.*`)
    const filteredTasks =
      searchValues.length === 0
        ? filteredByStatusTasks
        : filteredByStatusTasks.filter(
            (task) =>
              searchRegexp.test(task.id) ||
              searchRegexp.test(task.address) ||
              searchRegexp.test(task.host) ||
              searchRegexp.test(task.containerId) ||
              searchRegexp.test(task.deploymentId),
          )

    const statusList = filteredTasks.map((task) => task.status)
    const set = new Set(statusList)
    const deduplicatedStatusList = [...set]
    return { totalCount: filteredTasks.length, items: filteredTasks, statusList: deduplicatedStatusList }
  }

  async listDeploymentHistory(
    listDeploymentHistoryParams: ListDeploymentHistoryParams,
    listDeploymentHistoryQuery: ListDeploymentHistoryQuery,
  ) {
    const { filterBy } = listDeploymentHistoryQuery
    const filters = ListQuery.parseMustFiltersToKeyValuesMap(filterBy)
    const { searchValue: searchValues = [], az: azs = [], status: statusFilters = [] } = filters

    if (azs.length === 0) {
      throwError(ERROR.SYSTEM_ERROR.DEPLOYMENT_ERROR.REQUEST_ERROR, 'az must not be empty')
    }

    const allDeploymentHistorys = await this.openApiService.listAllDeploymentHistory(
      listDeploymentHistoryParams,
      azs[0],
    )

    const filteredByStatusDeploymentHistorys =
      statusFilters.length === 0
        ? allDeploymentHistorys
        : allDeploymentHistorys.filter((deploymentHistorys) => deploymentHistorys.status === statusFilters[0])

    const searchRegexp = new RegExp(`.*${searchValues[0]}.*`)
    const filteredDeploymentHistorys =
      searchValues.length === 0
        ? filteredByStatusDeploymentHistorys
        : filteredByStatusDeploymentHistorys.filter(
            (deploymentHistorys) =>
              searchRegexp.test(deploymentHistorys.deploymentId) || searchRegexp.test(deploymentHistorys.phase),
          )

    const statusList = filteredDeploymentHistorys.map((deploymentHistory) => deploymentHistory.status)

    const set = new Set(statusList)
    const deduplicatedStatusList = [...set]

    return {
      totalCount: filteredDeploymentHistorys.length,
      items: filteredDeploymentHistorys,
      statusList: deduplicatedStatusList,
    }
  }

  async getDeployment(params: GetDeploymentParams, query: GetDeploymentQuery) {
    return this.openApiService.getDeploymentDetail({
      ...params,
      ...query,
    })
  }
}
