export const removeQuery = (history: any, queryKey: string) => {
  const { search } = history.location
  const queryParams = new URLSearchParams(search)
  if (queryParams.has(queryKey)) {
    queryParams.delete(queryKey)
    history.replace({
      search: queryParams.toString()
    })
  }
}

export const addQuery = (history: any, queryKey: string, queryValue: string) => {
  const { search } = history.location
  const queryParams = new URLSearchParams(search)
  if (!queryParams.has(queryKey)) {
    queryParams.append(queryKey, queryValue)
    history.replace({
      search: queryParams.toString()
    })
  }
}
