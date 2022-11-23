import { omitBy, isUndefined, isNull, mergeWith, isBoolean } from 'lodash'

/**
 * To remove undefined, null, and empty string from an object with no nested objects
 * @param obj object need to be translate
 */
export function removeEmpty(obj) {
  return omitBy(obj, (value) => isUndefined(value) || isNull(value) || value === '')
}

export function booleanMerge(destinationObject, sourceObject) {
  return mergeWith(destinationObject, sourceObject, (objValue, srcValue) => {
    if (isBoolean(objValue) && isBoolean(srcValue)) {
      return objValue || srcValue
    }
  })
}

// Time complexity: O(n)
export const hasSameKeys = (objectA: Record<string, any>, objectB: Record<string, any>): boolean => {
  const aKeys = Object.keys(objectA)
  const bKeys = Object.keys(objectB)

  const keyMap: Record<string, number> = {}
  aKeys.forEach((item) => {
    keyMap[String(item)] = 1
  })
  bKeys.forEach((item) => {
    keyMap[String(item)]--
  })

  return Object.values(keyMap).every((value) => value === 0)
}
