import { ListQueryDto } from 'common/dtos/list.dto'
import { filterHandler, generateSortHandler, parseFilters } from './filter'
import { isPaginateParamsCorrect } from './paginate'

export function paginationHandler<T extends any>(
  items: T[],
  query: ListQueryDto,
  defaultOrder = ''
): { items: T[]; total: number } {
  const { filterBy = '', offset = 0, limit = 10 } = query

  const orderBy = !query.orderBy ? defaultOrder || '' : query.orderBy

  if (!isPaginateParamsCorrect(query) || offset < 0 || limit <= 0) {
    return {
      items: [],
      total: 0
    }
  }

  let filterList
  try {
    filterList = parseFilters(filterBy)
  } catch (err) {
    filterList = []
  }

  let total = items.length
  const filteredItems = filterHandler(filterList, items)
  total = filteredItems.length

  const sortHandler = generateSortHandler(orderBy)
  const sortedItems = filteredItems.sort(sortHandler)

  const start = Number(offset)
  const end = Number(start) + Number(limit)
  const paginatedItems = sortedItems.slice(start, end)

  return {
    items: paginatedItems,
    total
  }
}
