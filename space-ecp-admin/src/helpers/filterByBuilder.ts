export const FILTER_CONDITIONS = {
  AND: ';',
  OR: ',',
} as const
export type FilterConditionsType = keyof typeof FILTER_CONDITIONS

export const FILTER_OPERATORS = {
  EQ: '==',
  NEQ: '!=',
  CONTAINS: '=@',
  NOT_CONTAINS: '!@',
  MATCH_REGEX: '=~',
  NOT_MATCH_REGEX: '!~',
} as const
export type FilterOperatorsType = keyof typeof FILTER_OPERATORS

export type FilterValue = string | number | boolean
export type FilterValueDictionary = Record<string, FilterValue | null | undefined>

export class FilterByBuilder {
  private filterBy = ''

  append(
    key: string,
    value: FilterValue,
    options: {
      operatorType?: FilterOperatorsType
      conditionType?: FilterConditionsType
    },
  ) {
    const filterOperator = FILTER_OPERATORS[options.operatorType ?? 'EQ']
    const filterCondition = FILTER_CONDITIONS[options.conditionType ?? 'AND']
    this.filterBy += `${filterCondition}${key}${filterOperator}${value}`
    return this
  }

  appendAnd(
    key: string,
    value: FilterValue,
    options: {
      operatorType?: FilterOperatorsType
    },
  ) {
    return this.append(key, value, {
      operatorType: options.operatorType,
      conditionType: 'AND',
    })
  }

  appendOr(
    key: string,
    value: FilterValue,
    options: {
      operatorType?: FilterOperatorsType
    },
  ) {
    return this.append(key, value, {
      operatorType: options.operatorType,
      conditionType: 'OR',
    })
  }

  appendAndEq(dictionary: FilterValueDictionary): FilterByBuilder
  appendAndEq(key: string, value: FilterValue): FilterByBuilder
  appendAndEq(first: string | FilterValueDictionary, value?: FilterValue) {
    if (typeof first === 'string') {
      return this.appendAnd(first, value!, { operatorType: 'EQ' })
    }

    Object.entries(first).forEach(([key, value]) => {
      if (!value) {
        return
      }
      this.appendAnd(key, value, { operatorType: 'EQ' })
    })
    return this
  }

  build() {
    return this.filterBy.slice(1)
  }
}
