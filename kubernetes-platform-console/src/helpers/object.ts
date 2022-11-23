/**
 * Like Array.prototype.map, but manipulate the object values
 * @param obj obj needed to be manipulated
 * @param mapFunc handle function
 * @returns a new object
 */
export const objectValuesMap = (obj, mapFunc) => {
  obj = { ...obj }
  Object.keys(obj).forEach(key => (obj[key] = mapFunc(obj[key])))
  return obj
}

/**
 * Access nested JavaScript objects with string key
 * @param obj nested object
 * @param path string key: refer to Ant Design Table Column's dataIndex property
 *
 * @returns the value of object property
 */
export const objectDeepFind = (obj: Record<string, any>, path: string): any => {
  const paths = path.split('.')
  let current = obj

  for (let i = 0; i < paths.length; i++) {
    if (current[paths[i]] === undefined) {
      return undefined
    } else {
      current = current[paths[i]]
    }
  }

  return current
}
