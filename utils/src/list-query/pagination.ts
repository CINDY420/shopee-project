export interface IPagination {
  currentPage: number
  pageSize: number
}
export interface IOffsetLimit {
  offset: number
  limit: number
}

export const paginationToOffsetLimit = (pagination: IPagination): IOffsetLimit => {
  const { currentPage, pageSize } = pagination
  const offset = currentPage > 1 ? (currentPage - 1) * pageSize : 0
  return { offset, limit: pageSize }
}

export const offsetLimitToPagination = (offsetLimit: IOffsetLimit): IPagination => {
  const { offset, limit } = offsetLimit
  const currentPage = Math.floor(offset / limit) + 1
  return { currentPage, pageSize: limit }
}
