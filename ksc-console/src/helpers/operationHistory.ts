export interface ISearchValue {
  category?: string
  description?: string
}
export const formatSearchBy = (searchValue?: ISearchValue) => {
  if (!searchValue) return undefined
  return Object.entries(searchValue).reduce(
    (result, [key, value]) => `${result}${key}==${value};`,
    '',
  )
}
