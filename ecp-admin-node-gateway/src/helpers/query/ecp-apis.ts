interface IEcpApisQuery {
  pageNum: number
  pageSize: number
}

export const convertEcpApiQueryPagination = (offset?: string, limit?: string): IEcpApisQuery => {
  const pageSize = Number(limit)
  const pageNum = Number(offset) / pageSize + 1
  return {
    pageNum,
    pageSize,
  }
}

// return like: segment_key==value1,value2;key2==a,b
export const convertEcpApiFilterBy = (filterMap?: Record<string, string[]>): string | undefined => {
  if (!filterMap) return
  const parsedFilterBy = Object.entries(filterMap)
    .filter(([_, items]) => items.length > 0)
    .map(([key, items]) => {
      const filterValue = items.join(',')
      return `${key}==${filterValue}`
    })
    .join(';')

  return parsedFilterBy
}

export const convertEcpApiOrderBy = (orderKey: string, order: string) => `${orderKey} ${order}`
