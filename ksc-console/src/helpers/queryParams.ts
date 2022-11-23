import { ORDER } from 'constants/pagination'

/**
 * query filter types
 */
enum FILTER_TYPES {
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
  [FILTER_TYPES.CONTAIN]: '=@',
  [FILTER_TYPES.EQUAL]: '==',
  [FILTER_TYPES.STARTS_WITH]: '^=',
  [FILTER_TYPES.ENDS_WITH]: '$=',
  [FILTER_TYPES.REGEXP]: '=~',
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

const getFilterUrlParam = (
  params: Record<string, IFilterItem>,
  options: IOptions = { or: false },
) => {
  const { or: isFilterByOr = false } = options
  const filters: Array<string | IFilterItem> = []

  for (const paramKey of Object.keys(params)) {
    if (typeof params[paramKey] === 'string') {
      filters.push(params[paramKey])
      continue
    }

    const { value, key, type } = params[paramKey]

    if (!value || !value.length) continue

    const connector = filterTypeSymbolMap[type]
    const transformValues = Array.isArray(value) ? value : [value]
    filters.push(`${transformValues.map((item) => `${key}${connector}${item.trim()}`).join(',')}`)
  }

  const filter = filters.join(isFilterByOr ? ',' : ';')
  return filter || undefined
}

const getOrderUrlParam = (columnKey: string, order: string) => {
  if (!columnKey) return

  return order === ORDER.DESC ? `${columnKey} desc` : columnKey
}

export { FILTER_TYPES, getFilterItem, getFilterUrlParam, getOrderUrlParam }
