import { TablePaginationConfig } from 'infrad'
import { SorterResult } from 'infrad/lib/table/interface'

export const trim = (str: string) => {
  if (typeof str === 'string') {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }
  return str
}

/**
 * query filter types
 */
export enum FilterTypes {
  CONTAIN = ' contain',
  EQUAL = 'equal',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  REGEXP = 'regexp',
}
/**
 * map query filter types to symbols
 */
const filterTypeSymbolMap = {
  [FilterTypes.CONTAIN]: '=@',
  [FilterTypes.EQUAL]: '==',
  [FilterTypes.STARTS_WITH]: '^=',
  [FilterTypes.ENDS_WITH]: '$=',
  [FilterTypes.REGEXP]: '=~',
}

export type FilterValue = (React.Key | boolean)[] | null | string | number

export interface IFilterItem {
  key: string
  value: FilterValue
  type: FilterTypes
}
/**
 * create query url string, eg: '?a==15&b=~'a''
 */
interface IOptions {
  or?: boolean
  and?: boolean
}

export interface IFilterParams {
  [key: string]: IFilterItem
}

export const getFilterUrlParam = (params: IFilterParams, options: IOptions = { OR: false }) => {
  const { or = false } = options
  const filters: Array<string | IFilterItem> = []

  for (const paramKey of Object.keys(params)) {
    if (typeof params[paramKey] === 'string') {
      filters.push(params[paramKey])
      continue
    }

    const { value, key, type } = params[paramKey]

    if (!value || (Array.isArray(value) && !value.length)) {
      continue
    }

    const connector = filterTypeSymbolMap[type]
    const transformValue = Array.isArray(value) ? value : [value]
    filters.push(
      `${transformValue
        .map((item) => {
          let parserItem = item
          if (typeof item === 'string') {
            parserItem = trim(item)
          }
          return `${key}${connector}${parserItem}`
        })
        .join(',')}`,
    )
  }

  const filter = filters.join(or ? ',' : ';')
  return filter || undefined
}

export const PAGE = 1
export const PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100
export const ORDER = {
  ASC: 'ascend',
  DESC: 'descend',
}

export const PAGINATION_ACTION_TYPE = {
  NEXT_PAGE: 'NEXT_PAGE',
  PREVIOUS_PAGE: 'PREVIOUS_PAGE',
  UPDATE_DATA: 'UPDATE_DATA',
}

/**
 * Get offset by page and pageSize.
 * @param page Page
 * @param pageSize Page size
 */
export const getOffset = (page: number = PAGE, pageSize: number = PAGE_SIZE) =>
  page && pageSize ? (page - 1) * pageSize : 0

/**
 * Format offset and limit by pagination object.
 * @param pagination infrad Table pagination object
 */
export const formatPagination = (pagination: TablePaginationConfig) => {
  const { current: page = PAGE, pageSize: limit = PAGE_SIZE } = pagination

  const offset = getOffset(page, limit)

  return { offset, limit }
}

const getOrderUrlParam = <T>(
  columnKey: SorterResult<T>['columnKey'],
  order: SorterResult<T>['order'],
): string => {
  if (!columnKey) {
    return ''
  }
  return order === ORDER.DESC ? `${columnKey} desc` : String(columnKey)
}

/**
 * Format orderBy param by sorter object.
 * @param sorter infrad Table sorter object
 */
export const formatSorter = <T>(sorter: SorterResult<T> | SorterResult<T>[]) => {
  let orderBy: string
  if (Array.isArray(sorter)) {
    orderBy = sorter.map(({ columnKey, order }) => getOrderUrlParam<T>(columnKey, order)).join(';')
  } else {
    const { columnKey, order, column } = sorter
    if (!column) return ''
    orderBy = getOrderUrlParam<T>(columnKey, order)
  }

  return orderBy
}
