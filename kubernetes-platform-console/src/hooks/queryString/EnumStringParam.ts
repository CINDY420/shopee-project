/**
 * A function used for creating Enum type for useQueryParam
 * @return EnumStringParam
 */

const EnumStringParamGenerator = (range: Array<string>, defaultValue: string): any => {
  const EnumStringParam = {
    encode: value => {
      if (!range.includes(value)) {
        return defaultValue
      }
      return value
    },

    decode: value => {
      if (!range.includes(value)) {
        return defaultValue
      }
      return value
    }
  }

  return EnumStringParam
}

export default EnumStringParamGenerator
