import * as R from 'ramda'

/**
 * Convert any value to an array.
 * @param param any
 */
export const toArray = (param: any) => {
  if (R.isEmpty(param)) {
    return []
  }

  if (!Array.isArray(param)) {
    return [param]
  } else {
    return [...param]
  }
}

type IArrayToMap = <T extends object>(
  items: T[],
  nameKey: string,
  valueKey: string
) => {
  [key: string]: T[keyof T]
}
/**
 * Convert an array of objects to an object.
 * Use a property of the object element as the key of the new object
 * Use a property of the object element as the value of the new object if provided
 *
 * @param items {array} array collections of objects
 * @param nameKey {string} one of the property value of the object element that use as the key of the new obj
 * @param valueKey {string} one of the property value of the object element that use as the value of the new obj property
 *
 * @example
 * arrayToMap([{title: 'apple', data: 'apple 1'}], 'title', 'data')
 * // return {apple: 'apple 1'}
 */
export const arrayToMap: IArrayToMap = (items, nameKey, valueKey) => {
  return items.reduce((obj, item) => {
    return {
      ...obj,
      [item[nameKey]]: item[valueKey]
    }
  }, {})
}

/**
 * swap position of two items in the array
 * @param items items array
 * @param index1 index 1
 * @param index2 index 2
 * @returns return a new items
 */
export const swapItemsInArr = (items, index1, index2) => {
  items = [...items]
  const temp = items[index1]
  items[index1] = items[index2]
  items[index2] = temp
  return items
}

/**
 * replace item of a specific position of an array, a shallow copy will do
 * @param items array of items
 * @param index index of the item needed to be replaced
 * @param item item should be placed
 * @returns return new array
 */
export const replaceItemInArr = (items, index, item) => {
  items = [...items]
  items.splice(index, 1, item)
  return items
}

/**
 * remove item of a specific position from items, a shallow copy will do
 * @param items array of items
 * @param index index of the item should be replaced
 * @returns return new array
 */
export const removeItemInArr = (items, index) => {
  items = [...items]
  items.splice(index, 1)
  return items
}

/**
 * get the first item which value of a key is equal to a specific value from an array of object
 * @param items an array of items
 * @param key object key
 * @param value object value
 */
export const getItemFromArrWithKeyValue = (items, key, value) => {
  return items.find(item => item[key] === value)
}

/**
 * Add a unique key for each element with the given parameters
 * @param items an array of object
 * @param keyName the property name that will assign to object item
 * @param params properties that exit in object
 */
export const setArrayItemKey = (items: any[], keyName: string, ...params) => {
  items.forEach(item => {
    const str = params.reduce((keyValue, currentKey) => {
      return `${keyValue} ${item[currentKey]}`
    }, '')

    item[keyName] = str
  })

  return items
}
