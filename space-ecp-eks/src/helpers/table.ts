import { Params } from 'ahooks/lib/useAntdTable/types'
import { FilterValue, SorterResult } from 'infrad/lib/table/interface'
import { listQuery } from '@infra/utils'
import { IFilterByItem } from '@infra/utils/dist/list-query'

const { paginationToOffsetLimit, FilterByBuilder, FilterByOperator, buildOrderBy, ORDER } =
  listQuery

type AHookTableChangeParam = Params[0]
export interface IAntdTableChangeParam extends AHookTableChangeParam {
  filters: Record<string, FilterValue | null>
  sorter: SorterResult<unknown>
}

interface IListQuery {
  offset?: string
  limit?: string
  filterBy?: string
  orderBy?: string
}
type IListFn<TResponse> = (args: IListQuery) => Promise<TResponse>

const antdOrderMap = {
  ascend: ORDER.ASCEND,
  descend: ORDER.DESCEND,
}

export const listFnWrapper =
  <TResponse = any>(listFn: IListFn<TResponse>) =>
  (param: IAntdTableChangeParam) => {
    const { pageSize, current, filters = {}, sorter = {} } = param
    const { offset, limit } = paginationToOffsetLimit({ currentPage: current, pageSize })

    const filterByItems: IFilterByItem[] = []
    const validFilters = Object.entries(filters).filter(([_, value]) => !!value)
    validFilters.forEach(([keyPath, values]) => {
      values.forEach((value) => {
        filterByItems.push({
          keyPath,
          operator: FilterByOperator.EQUAL,
          value: String(value),
        })
      })
    })

    const filterByBuilder = new FilterByBuilder(filterByItems)
    const filterBy = filterByBuilder.build()

    const { field, order } = sorter
    const orderByKeyPath = Array.isArray(field) ? field[0] : field
    const orderByOrder = antdOrderMap[order]
    const orderBy =
      orderByKeyPath && orderByOrder
        ? buildOrderBy({ keyPath: String(orderByKeyPath), order: orderByOrder })
        : undefined

    return listFn({ offset: String(offset), limit: String(limit), filterBy, orderBy })
  }
