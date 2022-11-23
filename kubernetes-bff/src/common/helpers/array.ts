export const dedup = <T>(arr) => [...new Set<T>(arr)]

export const checkIsSubsetArray = <T>(subSetArray: T[], parentArray: T[]): boolean => {
  return subSetArray.every((val) => parentArray.includes(val))
}

export const sortResource = (resourceList: any[], key = 'name') =>
  resourceList.sort((a, b) => (a[key] > b[key] ? 1 : -1))
