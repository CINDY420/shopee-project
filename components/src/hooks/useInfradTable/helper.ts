import { Data, Params } from 'ahooks/lib/useAntdTable/types'
import { FilterValue, SorterResult } from 'infrad/lib/table/interface'
import { listQuery } from '@infra/utils'
import { IFilterByItem, FilterByBuilder as FilterByBuilderType } from '@infra/utils/dist/list-query'

const { paginationToOffsetLimit, FilterByBuilder, FilterByOperator, buildOrderBy, ORDER } =
  listQuery

// Type guards
const isAntdTableSorter = (sorter: any): sorter is SorterResult<unknown> =>
  'field' in sorter && 'order' in sorter

const isAntdTableFilters = (filters: any): filters is Record<string, FilterValue | null> =>
  typeof filters === 'object' && Object.keys(filters).every((key) => typeof key === 'string')

export interface IListQuery {
  offset?: string
  limit?: string
  filterBy?: string
  orderBy?: string
  filterByBuilder: FilterByBuilderType
}

export type IListQueryFn<TResponse> = (args: IListQuery) => Promise<TResponse>

const antdOrderMap = {
  ascend: ORDER.ASCEND,
  descend: ORDER.DESCEND,
}

/**
 * High Order Function for transforming infrad Table params to listQuery object, you can
 * refer to https://confluence.shopee.io/pages/viewpage.action?pageId=609075996#APIGuideline-%E6%A0%87%E5%87%86%E5%AD%97%E6%AE%B5
 * to have an understanding of "listQuery"
 * @param listQueryFn
 * @returns response of listQueryFn
 */
export const listQueryHOF =
  <TData extends Data, TParams extends Params>(listQueryFn: IListQueryFn<TData>) =>
  (...params: TParams) => {
    if (params.length === 0) {
      console.error("Can't get params, please checkout your infrad version")
    }
    const param = params[0]
    const { pageSize, current, filters = {}, sorter = {} } = param || {}

    // Generate offset and limit
    const { offset, limit } = paginationToOffsetLimit({ currentPage: current, pageSize })

    // Generate filterBy
    let filterBy
    const filterByBuilder = new FilterByBuilder([])

    const filterByItems: IFilterByItem[] = []
    if (isAntdTableFilters(filters)) {
      const validFilters = Object.entries(filters).filter(([_, value]) => !!value)
      validFilters.forEach(([keyPath, values]) => {
        values?.forEach((value) => {
          filterByItems.push({
            keyPath,
            operator: FilterByOperator.EQUAL,
            value: String(value),
          })
        })
      })
      if (filterByItems.length > 0) {
        filterByBuilder.append(filterByItems)
        filterBy = filterByBuilder.build()
      }
    }

    // Generate orderBy
    let orderBy
    if (isAntdTableSorter(sorter)) {
      const { field, order } = sorter
      const orderByKeyPath = Array.isArray(field) ? field[0] : field
      const orderByOrder = typeof order === 'string' ? antdOrderMap[order] : undefined
      orderBy =
        orderByKeyPath && orderByOrder
          ? buildOrderBy({ keyPath: String(orderByKeyPath), order: orderByOrder })
          : undefined
    }

    return listQueryFn({
      offset: String(offset),
      limit: String(limit),
      filterBy,
      orderBy,
      filterByBuilder,
    })
  }

export { FilterByOperator }
