import { PaginationProps } from 'infrad/lib/pagination'

import { PAGE_SIZE, ORDER } from 'constants/pagination'

import { trim } from './format'

/**
 * query filter types
 */
enum filterTypes {
  contain = ' contain',
  equal = 'equal',
  startsWith = 'startsWith',
  endsWith = 'endsWith',
  regexp = 'regexp'
}

/**
 * map query filter types to symbols
 */
const filterTypeSymbolMap = {
  [filterTypes.contain]: '=@',
  [filterTypes.equal]: '==',
  [filterTypes.startsWith]: '^=',
  [filterTypes.endsWith]: '$=',
  [filterTypes.regexp]: '=~'
}

interface IFilterItem {
  key: string
  value: any
  type: string
}

/**
 * create filter items
 */
const getFilterItem = (key: string, value: any, type: string) => ({ key, value, type })

/**
 * create query url string, eg: '?a==15&b=~'a''
 */
interface IOptions {
  or?: boolean
  and?: boolean
}

const getFilterUrlParam = (params: { [key: string]: IFilterItem }, options: IOptions = { or: false }) => {
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
    filters.push(`${transformValue.map(item => `${key}${connector}${trim(item)}`).join(',')}`)
  }

  const filter = filters.join(or ? ',' : ';')
  return filter || undefined
}

const getSearchUrlParam = (searchItem: string[] = []) => {
  return searchItem.join(':')
}

const getOrderUrlParam = (columnKey: string, order: string) => {
  if (!columnKey) {
    return
  }
  return order === ORDER.DESC ? `${columnKey} desc` : columnKey
}

/**
 * @return { offset, limit } {current page number of table, total page number of table}
 */
const formatPagination = (pagination: PaginationProps = {}) => {
  const { current: page = 1, pageSize: limit = PAGE_SIZE } = pagination
  const offset = (page - 1) * limit
  return { offset, limit }
}

const parseSearchMap = (search: string): { [key: string]: string } => {
  const map = {}
  if (!search) {
    return map
  }

  const searchStr = search.split('?')[1]
  const searchItems = searchStr.split('&')
  searchItems.forEach(item => {
    const arr = item.split('=')
    map[arr[0]] = arr[1]
  })

  return map
}

const getFilterParameters = (filterBy: string | undefined, extraFilterBy: string | undefined): string => {
  if (filterBy) {
    if (extraFilterBy) {
      return `${filterBy};${extraFilterBy}`
    } else {
      return `${filterBy}`
    }
  } else {
    return extraFilterBy ?? ''
  }
}

export {
  filterTypes,
  getFilterItem,
  getFilterUrlParam,
  getOrderUrlParam,
  formatPagination,
  getSearchUrlParam,
  parseSearchMap,
  getFilterParameters
}
