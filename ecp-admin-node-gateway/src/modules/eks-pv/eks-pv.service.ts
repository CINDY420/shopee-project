import { Injectable } from '@nestjs/common'
import { EksApisService } from '@/shared/eks-apis/eks-apis.service'
import { listQuery } from '@infra/utils'
import { EksListPvParams, EksListPvQuery } from '@/modules/eks-pv/dto/eks-pv.dto'
import { pvListFilterMap } from '@/constants/eksPv'

const { FilterByParser, FilterByOperator, offsetLimitToPagination } = listQuery

@Injectable()
export class EksPvService {
  constructor(private readonly eksApisService: EksApisService) {}

  private buildPvListFilters = (filterBy: string | undefined): string | undefined => {
    if (filterBy === undefined) {
      return undefined
    }

    const filterByParser = new FilterByParser(filterBy)

    const equalKeyPathValuesMap = filterByParser.parseByOperator(FilterByOperator.EQUAL)

    const fieldSelector = Object.entries(equalKeyPathValuesMap)
      .map(([key, values]) => `${pvListFilterMap[key]}${FilterByOperator.EQUAL}${values.join(',')}`)
      .join(';')

    return fieldSelector
  }

  async listPvs(params: EksListPvParams, query: EksListPvQuery) {
    const { clusterId } = params
    const { filterBy, searchBy, offset, limit } = query

    const { currentPage, pageSize } = offsetLimitToPagination({
      offset: Number(offset),
      limit: Number(limit),
    })

    const fieldSelector = this.buildPvListFilters(filterBy)

    const data = await this.eksApisService.getApis().listPVs(
      { id: clusterId },
      {
        fieldSelector,
        fuzzySearch: searchBy,
        pageNo: currentPage,
        pageSize,
      },
    )

    const { total = 0, items = [] } = data
    const pvList = items?.map((item) => {
      const {
        pvname: pvName = '',
        status = '',
        volumemode: volumeMode = '',
        storage = '',
        accessmodes: accessModes = [],
        pvcname: pvcName = '',
        labels = {},
        creationtimestamp: createTime = '',
      } = item
      const pvLabels = Object.entries(labels)?.map(([key, value]) => ({
        key,
        value,
      }))

      return {
        pvName,
        status,
        volumeMode,
        storage,
        accessModes,
        pvcName,
        labels: pvLabels,
        createTime,
      }
    })

    const { items: statusList = [] } = await this.eksApisService.getApis().listPVStatus()
    const { items: accessModeList = [] } = await this.eksApisService.getApis().listPVAccessModes()

    return {
      items: pvList,
      total,
      statusList,
      accessModeList,
    }
  }
}
