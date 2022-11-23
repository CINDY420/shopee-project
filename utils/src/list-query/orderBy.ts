export enum ORDER {
  ASCEND = 'ascend',
  DESCEND = 'descend',
}

export interface IOrderBy {
  keyPath: string
  order: ORDER | undefined
}

export const buildOrderBy = (orderBy: IOrderBy) => `${orderBy.keyPath} ${orderBy.order}`
export const parseOrderBy = (orderBy: string): IOrderBy | undefined => {
  if (!orderBy) return

  const orderByItems = orderBy.trim().split(/\s+/)
  if (orderByItems.length > 2) {
    throw new Error(`Invalid orderBy: ${orderBy}`)
  }
  const [keyPath, order] = orderByItems
  return { keyPath, order: order as ORDER }
}
