export const generateFilter = (filters: string[]) => filters.filter((item) => item).join(';')

export const getFilterParameters = (filterBy?: string, extraFilterBy?: string): string => {
  if (filterBy) {
    if (extraFilterBy) return `${filterBy};${extraFilterBy}`

    return `${filterBy}`
  }
  return extraFilterBy ?? ''
}
