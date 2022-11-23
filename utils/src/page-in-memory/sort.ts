import { IOrderBy, ORDER } from '@/list-query'

interface ISortArgs<TItem> {
  items: TItem[]
  orderBy: IOrderBy
}
export const sort = <TItem = Record<string, unknown>>({
  items,
  orderBy,
}: ISortArgs<TItem>): TItem[] => {
  const { keyPath, order } = orderBy
  if (!order) return items
  if (items.length === 0) return items
  // ignore not found keyPath
  if (!(keyPath in items[0])) return items

  const sortValue = order === ORDER.ASCEND ? -1 : 1
  return items.sort((current: Record<string, any>, next: Record<string, any>) => {
    const currentValue = current[keyPath]
    const nextValue = next[keyPath]
    if (currentValue < nextValue) {
      return sortValue
    }
    return -sortValue
  })
}
