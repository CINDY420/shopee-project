import * as R from 'ramda'
import { PaginationProps } from 'infrad/lib/pagination'
import { PAGE, PAGE_SIZE } from 'src/constants/pagination'

// filters
interface IFilterItem {
  key: string
  value: any
  type: FilterTypes
}

interface IOptions {
  or?: boolean
  and?: boolean
}

export enum FilterTypes {
  CONTAIN = ' contain',
  EQUAL = 'equal',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  REGEXP = 'regexp',
}

const filterTypeSymbolMap: Record<FilterTypes, string> = {
  [FilterTypes.CONTAIN]: '=@',
  [FilterTypes.EQUAL]: '==',
  [FilterTypes.STARTS_WITH]: '^=',
  [FilterTypes.ENDS_WITH]: '$=',
  [FilterTypes.REGEXP]: '=~',
}

export const getFilterItem = (key: string, value: any, type: FilterTypes) => ({ key, value, type })

const trim = (str: string) => {
  if (typeof str === 'string') {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }
  return str
}

export const getFilterUrlParam = (
  params: { [key: string]: IFilterItem },
  options: IOptions = { or: false },
) => {
  const { or = false } = options
  const filters: Array<string | IFilterItem> = []

  for (const paramKey of Object.keys(params)) {
    if (typeof params[paramKey] === 'string') {
      filters.push(params[paramKey])
      continue
    }

    const { value, key, type } = params[paramKey]

    if (!value || !value.length) {
      continue
    }

    const connector = filterTypeSymbolMap[type]
    const transformValue = Array.isArray(value) ? value : [value]
    filters.push(`${transformValue.map((item) => `${key}${connector}${trim(item)}`).join(',')}`)
  }

  const filter = filters.join(or ? ',' : ';')
  return filter || undefined
}

export const formatTableFilters = (filters: any) => {
  if (!filters) return undefined
  const filterParams: { [key: string]: IFilterItem } = {}
  Object.entries(filters).forEach(([key, value]) => {
    filterParams[key] = getFilterItem(key, value, FilterTypes.EQUAL)
  })
  const filterBy = getFilterUrlParam(filterParams)

  return filterBy
}

// sorter
export const ORDER = {
  ASC: 'ascend',
  DESC: 'descend',
}

const getOrderUrlParam = (columnKey: string, order: string) => {
  if (!columnKey) {
    return
  }
  return order === ORDER.DESC ? `${columnKey} desc` : columnKey
}

export const formatSorter = (sorter: any) => {
  if (!sorter) return undefined
  let orderBy

  if (!R.isEmpty(sorter)) {
    const { columnKey = '', field, order } = sorter
    const sorterKey = columnKey || field
    orderBy = getOrderUrlParam(sorterKey, order)
  }

  return orderBy
}

// pagination
export const getOffset = (page: number = PAGE, pageSize: number = PAGE_SIZE) =>
  page && pageSize ? (page - 1) * pageSize : 0

export const formatPagination = (pagination: PaginationProps) => {
  const { current: page = PAGE, pageSize: limit = PAGE_SIZE } = pagination

  const offset = getOffset(page, limit)

  return { offset, limit }
}

export const getTableProps = (params: {
  pagination: { current: number; pageSize: number }
  filters: any
  sorter: any
}): {
  offset: number
  limit: number
  filterBy: string
  orderBy: string
} => {
  const { pagination, filters, sorter } = params
  const { current, pageSize } = pagination

  const { offset, limit } = formatPagination({ current, pageSize })
  const filterBy = formatTableFilters(filters)
  const orderBy = formatSorter(sorter)

  return {
    offset,
    limit,
    filterBy,
    orderBy,
  }
}
