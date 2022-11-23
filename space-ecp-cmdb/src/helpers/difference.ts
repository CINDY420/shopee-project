import { reduce, isEqual, isObject } from 'lodash'

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
const difference = (object: any, base: any) =>
  reduce(
    object,
    (result: any, value, key) => {
      if (!isEqual(value, base?.[key])) {
        result[key] =
          isObject(value) && isObject(base?.[key]) ? difference(value, base?.[key]) : value
      }
      return result
    },
    {},
  )

export default difference
