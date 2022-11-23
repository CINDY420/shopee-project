import { FilterByParser, parseOrderBy } from '@/list-query'
import { filter } from '@/page-in-memory/filter'
import { sort } from '@/page-in-memory/sort'
import { paginate } from '@/page-in-memory/paginate'

interface IListQuery {
  offset?: string | number
  limit?: string | number
  filterBy?: string
  orderBy?: string
}

interface IPageByQueryResponse<TITem> {
  items: TITem[]
  total: number
}

interface IPageByQueryArgs<TITem> {
  items: TITem[]
  query: IListQuery
}

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 10
const DEFAULT_FILTER_BY = ''
const DEFAULT_ORDERBY = ''

// filter, sort and page items by query
export const pageByQuery = <TITem extends Record<string, unknown> = any>({
  items,
  query,
}: IPageByQueryArgs<TITem>): IPageByQueryResponse<TITem> => {
  const {
    offset = DEFAULT_OFFSET,
    limit = DEFAULT_LIMIT,
    filterBy = DEFAULT_FILTER_BY,
    orderBy = DEFAULT_ORDERBY,
  } = query
  const filterByParser = new FilterByParser(filterBy)
  // filter
  const filterByItems = filterByParser.parse()
  const filteredItems = filter<TITem>({ items, filterByItems })

  // sort
  const parsedOrderBy = parseOrderBy(orderBy)
  const sortedItems = parsedOrderBy
    ? sort<TITem>({ items: filteredItems, orderBy: parsedOrderBy })
    : filteredItems

  // page
  const paginatedItems = paginate({ items: sortedItems, offset, limit })
  return { items: paginatedItems, total: filteredItems.length }
}

export * from '@/page-in-memory/filter'
export * from '@/page-in-memory/sort'
export * from '@/page-in-memory/paginate'
