import { Injectable } from '@nestjs/common'
import { EksApisService } from '@/shared/eks-apis/eks-apis.service'
import { listQuery } from '@infra/utils'
import {
  EksListPvcParams,
  EksListPvcQuery,
  EksGetPvcNamespaceParam,
  EksGetPvcNamespaceQuery,
} from '@/modules/eks-pvc/dto/eks-pvc.dto'
import { pvcListFilterMap } from '@/constants/eksPvc'

const { FilterByParser, FilterByOperator, offsetLimitToPagination } = listQuery

@Injectable()
export class EksPvcService {
  constructor(private readonly eksApisService: EksApisService) {}

  private buildPvcListFilters = (
    filterBy: string | undefined,
  ): { namespace: string | undefined; fieldSelector: string | undefined } => {
    if (filterBy === undefined) {
      return {
        namespace: undefined,
        fieldSelector: undefined,
      }
    }

    const filterByParser = new FilterByParser(filterBy)

    const equalKeyPathValuesMap = filterByParser.parseByOperator(FilterByOperator.EQUAL)

    const { namespace: namespaceFilters, ...restFilter } = equalKeyPathValuesMap || {}

    const fieldSelector = Object.entries(restFilter)
      .map(
        ([key, values]) => `${pvcListFilterMap[key]}${FilterByOperator.EQUAL}${values.join(',')}`,
      )
      .join(';')
    return { namespace: namespaceFilters?.[0], fieldSelector }
  }

  async listPvcs(params: EksListPvcParams, query: EksListPvcQuery) {
    const { clusterId } = params
    const { filterBy, searchBy, offset, limit } = query
    const { currentPage, pageSize } = offsetLimitToPagination({
      offset: Number(offset),
      limit: Number(limit),
    })

    const { fieldSelector, namespace } = this.buildPvcListFilters(filterBy)

    const data = await this.eksApisService.getApis().listPVCs(
      { id: clusterId },
      {
        namespace,
        fieldSelector,
        fuzzySearch: searchBy,
        pageNo: currentPage,
        pageSize,
      },
    )

    const { total = 0, items = [] } = data
    const pvList = items?.map((item) => {
      const {
        pvcname: pvcName = '',
        status = '',
        storage = '',
        accessmodes: accessModes = [],
        pvname: pvName = '',
        labels = {},
        creationtimestamp: updateTime = '',
      } = item

      const pvLabels = Object.entries(labels)?.map(([key, value]) => ({
        key,
        value,
      }))

      return {
        pvName,
        status,
        storage,
        accessModes,
        pvcName,
        labels: pvLabels,
        updateTime,
      }
    })

    const { items: statusList = [] } = await this.eksApisService.getApis().listPVCStatus()
    const { items: accessModeList = [] } = await this.eksApisService.getApis().listPVCAccessModes()

    return {
      items: pvList,
      total,
      statusList,
      accessModeList,
    }
  }

  async getPvcNameSpace(params: EksGetPvcNamespaceParam, query: EksGetPvcNamespaceQuery) {
    const { clusterId } = params
    const { searchBy } = query
    const { items: namespaceList = [] } = await this.eksApisService
      .getApis()
      .listPVCNamespaces({ id: clusterId }, { fuzzySearch: searchBy })

    return {
      namespaceList,
    }
  }
}
