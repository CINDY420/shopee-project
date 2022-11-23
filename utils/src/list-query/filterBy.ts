// ListQuery specification refers to https://confluence.shopee.io/pages/viewpage.action?pageId=609075996#APIGuideline-filterBy
import { uniqWith, isEqual, cloneDeep } from 'lodash'

export enum FilterByOperator {
  EQUAL = '==',
  NOT_EQUAL = '!=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',
  CONTAINS = '=@',
  NOT_CONTAINS = '!@',
  MATCH_REGEX = '=~',
  NOT_MATCH_REGEX = '!~',
}

enum LOGIC_OPERATOR {
  AND = ';',
  OR = ',',
}

export interface IFilterByItem {
  keyPath: string
  operator: FilterByOperator
  value: string
}

export class FilterByBuilder {
  private filterByItems: IFilterByItem[]
  constructor(filterByItems: IFilterByItem[]) {
    this.filterByItems = cloneDeep(filterByItems)
  }

  append(filterByItems: IFilterByItem[] | IFilterByItem) {
    if (Array.isArray(filterByItems)) {
      this.filterByItems.push(...filterByItems)
    } else {
      this.filterByItems.push(filterByItems)
    }

    return this
  }

  /**
   * @returns returned filterBy is a string, like "name==jack,name==mary,name=~xxx;age<60,age>10"
   * each filterByItem in the string is an expression like "name==jack",
   * the item with same keyPath are will be put together and split by ",", like "name==jack,name==mary", as logical operator "OR"
   * the item with different keyPath will be split by ";", like "name==jack;age<60,age>10", as logical operator "AND"
   */
  build(): string {
    // deduplicate
    const uniqueItems = uniqWith(this.filterByItems, isEqual)
    /*
     * collect same keyPath items and transform to string query, like
     * {
     *   name: ['name==jack', 'name==mary'],
     *   age: ['age>10', 'age<3']
     * }
     */
    const keyPathItemMap: Record<string, string[]> = {}
    uniqueItems.forEach((item) => {
      if (!keyPathItemMap[item.keyPath]) keyPathItemMap[item.keyPath] = []
      const { keyPath, operator, value } = item
      const convertedItem = `${keyPath}${operator}${value}`
      keyPathItemMap[item.keyPath].push(convertedItem)
    })
    // Add 'OR' logical operator ',', like: ['name==jack,name==mary', 'age<60,age>10']
    const ORItems = Object.values(keyPathItemMap).map((convertedItem) =>
      convertedItem.join(LOGIC_OPERATOR.OR),
    )
    // Add 'AND' logical operator ';', like "name==jack,name==mary;age<60,age>10"
    return ORItems.join(LOGIC_OPERATOR.AND)
  }
}

export class FilterByParser {
  private readonly filterByItems: IFilterByItem[] = []
  // Valid filterBy is like "name==jack,name==mary;age<60,age>10"
  constructor(filterBy: string) {
    if (filterBy.length === 0) return
    // Parse 'AND', return like ['name==jack,name==mary', 'age<60,age>10']
    const ANDItems = filterBy.split(LOGIC_OPERATOR.AND)
    // Parse 'OR', return like [['name==jack', 'name==mary'], ['age>10', 'age<3']]
    const ORItems = ANDItems.map((item) => item.split(LOGIC_OPERATOR.OR))

    /*
     * Parse IFilterByItem, return like:
     * [
     *   { keyPath: 'name', operator: '===', value: 'jack' },
     *   { keyPath: 'name', operator: '===', value: 'mary' },
     *    { keyPath: 'age', operator: '>', value: '12' }
     * ]
     */
    ORItems.forEach((ANDItems) => {
      const uniqueANDItem = new Set(ANDItems)
      uniqueANDItem.forEach((ANDItem) => {
        const filterItem = this.parseANDItem(ANDItem)
        this.filterByItems.push(filterItem)
      })
    })
  }

  // eslint-disable-next-line class-methods-use-this
  private parseANDItem(filter: string): IFilterByItem {
    const supportedFilterCharacter = /^([a-zA-Z-_.]+)(>|<|<=|>=|==|!=|=@|!@|^=|\$=|=~|!~)([^=]+)$/
    const match = filter.match(supportedFilterCharacter)
    if (!match) {
      throw new Error(`Invalid filterBy item: ${filter}!`)
    }
    const [_ignored, keyPath, operator, value] = match
    return {
      keyPath,
      operator: operator as FilterByOperator,
      value,
    }
  }

  parse(): IFilterByItem[] {
    return this.filterByItems
  }

  /*
   * return keyPathValuesMap, such as,
   * if operator is "==", return like
   * {
   *   name: ['jack', 'mary'],
   * }
   * if operator is ">", return like
   * {
   *   age: ['18'],
   * }
   */
  parseByOperator(operator: FilterByOperator): { [keyPath: string]: string[] } {
    const keyPathValuesMap: Record<string, string[]> = {}
    this.filterByItems
      .filter((item) => item.operator === operator)
      .forEach(({ keyPath, value }) => {
        if (!keyPathValuesMap[keyPath]) {
          keyPathValuesMap[keyPath] = []
        }
        // avoid reduplicative value
        if (!keyPathValuesMap[keyPath].includes(value)) {
          keyPathValuesMap[keyPath].push(value)
        }
      })
    return keyPathValuesMap
  }

  /*
   * return operatorValuesMap, such,
   * if keyPath is "name", return like
   * {
   *   "==": ['jack', 'mary'],
   *   ">": []
   * }
   * if keyPath is "age", return like
   * {
   *   ">": ['18'],
   *   "==": []
   * }
   */
  parseByKeyPath(keyPath: string): Record<FilterByOperator, string[]> {
    const operatorValuesMap: Record<string, string[]> = {}
    this.filterByItems
      .filter((item) => item.keyPath === keyPath)
      .forEach(({ operator, value }) => {
        if (!operatorValuesMap[operator]) {
          operatorValuesMap[operator] = []
        }
        // avoid reduplicative value
        if (!operatorValuesMap[operator].includes(value)) {
          operatorValuesMap[operator].push(value)
        }
      })
    return operatorValuesMap
  }
}
