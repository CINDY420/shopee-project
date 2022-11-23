interface IPaginateParams {
  offset: number
  limit: number
  orderBy: string
  filterBy: string
}

export const isStringOrNull = (value: string | null) => {
  if (!value) return true
  if (parseInt(value)) return false
  if (typeof value === 'string') return true
  return false
}

export const isIntOrNull = (value: number | null) => {
  if (!value) return true
  if (value % 1 === 0) return true
  return false
}

export const isPaginateParamsCorrect = (params: IPaginateParams) => {
  const { offset, limit, orderBy, filterBy } = params
  if (!isStringOrNull(orderBy) || !isStringOrNull(filterBy)) return false
  if (!isIntOrNull(offset) || !isIntOrNull(limit)) return false
  return true
}
