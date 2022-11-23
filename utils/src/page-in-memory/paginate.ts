interface IPageArgs<TItem> {
  items: TItem[]
  offset: string | number
  limit: string | number
}

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 10

export const paginate = <TItem = Record<string, unknown>>({
  items,
  offset,
  limit,
}: IPageArgs<TItem>): TItem[] => {
  const numberOffset = Number(offset)
  const start = numberOffset > 0 ? numberOffset : DEFAULT_OFFSET
  const numberLimit = Number(limit)
  const validLimit = numberLimit > 0 ? numberLimit : DEFAULT_LIMIT
  const end = start + validLimit
  const pagedItems = items.slice(start, end)
  return pagedItems
}
