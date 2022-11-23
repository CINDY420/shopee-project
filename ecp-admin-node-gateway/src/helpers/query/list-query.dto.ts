import { IsString, IsOptional, IsNumberString } from 'class-validator'
import { throwError } from '@infra-node-kit/exception'
import { SYSTEM_ERROR } from '@/constants/error'
import { ApiProperty } from '@nestjs/swagger'

/**
 * @see https://confluence.shopee.io/pages/viewpage.action?pageId=609075996#APIGuideline-orderBy
 */

interface IRecursiveRecord {
  [key: string]: IRecursiveRecord
}
type IInputValue = IRecursiveRecord | string | number | string[]
interface IFilterItem {
  keyPath: string
  operator: string
  value: string
}
type IOrItemList = IFilterItem[]
type IAndItemList = IOrItemList[]

export class ListQuery {
  @ApiProperty({ required: false, default: '0', type: 'string' })
  @IsOptional()
  @IsNumberString()
  offset = '0'

  @ApiProperty({ required: false, default: '10', type: 'string' })
  @IsOptional()
  @IsNumberString()
  limit = '10'

  @IsOptional()
  @IsString()
  orderBy?: string

  @IsOptional()
  @IsString()
  filterBy?: string

  @IsOptional()
  @IsString()
  searchBy?: string

  private static parseFilter(filter: string) {
    const supportedFilterCharacter =
      /^([0-9a-zA-Z-_.]+)(>|<|<=|>=|==|!=|=@|!@|^=|\$=|=~|!~)([^=]+)$/
    const match = filter.match(supportedFilterCharacter)
    if (!match) {
      throwError({ ...SYSTEM_ERROR.LIST_QUERY_ERROR, message: `unsupported list query: ${filter}` })
    }
    const [_ignored, keyPath, operator, value] = match
    return {
      keyPath,
      operator,
      value,
    }
  }

  static parseFilterBy(filterBy?: string): IFilterItem[][] | undefined {
    if (!filterBy?.length) {
      return undefined
    }

    const SPLIT_CHAR = {
      AND: ';',
      OR: ',',
    }
    return filterBy.split(SPLIT_CHAR.AND).map((mustCondition) => {
      const optionalConditions = mustCondition.split(SPLIT_CHAR.OR)
      return optionalConditions.map(ListQuery.parseFilter)
    })
  }

  static getFilteredData(
    mustItems?: IAndItemList,
    sources: IRecursiveRecord[] = [],
  ): IRecursiveRecord[] {
    if (!mustItems) {
      return sources
    }
    return sources.filter((source) =>
      mustItems.every((mustItem) =>
        mustItem.some((optionalItem) => ListQuery.matchOptionalCondition(source, optionalItem)),
      ),
    )
  }

  static getSearchData(
    mustItems?: IAndItemList,
    sources: IRecursiveRecord[] = [],
  ): IRecursiveRecord[] {
    if (!mustItems) {
      return sources
    }
    return sources.filter((source) =>
      mustItems.every((mustItem) =>
        mustItem.some((optionalItem) => ListQuery.testEachSearchBy(source, optionalItem)),
      ),
    )
  }

  private static testEachSearchBy<T extends IRecursiveRecord>(
    source: T,
    optionalItem: IFilterItem,
  ) {
    const { keyPath, value } = optionalItem
    const searchRegexp = new RegExp(`.*${value}.*`)
    const dataToBeTested = this.getSourceValue(keyPath, source)
    if (typeof dataToBeTested !== 'number' && typeof dataToBeTested !== 'string') return false
    return searchRegexp.test(dataToBeTested.toString())
  }

  private static matchOptionalCondition(source: IRecursiveRecord, optionalItem: IFilterItem) {
    const { keyPath, operator, value } = optionalItem

    const sourceValue = this.getSourceValue(keyPath, source)

    if (Array.isArray(sourceValue) || (typeof sourceValue === 'string' && operator === '=@')) {
      return sourceValue.indexOf(value) > -1
    }
    if (typeof sourceValue === 'string' || typeof sourceValue === 'number') {
      return sourceValue === value
    }
    return false
  }

  /**
   * get compare function for sorting
   * @param orderBy
   */
  static getCompareFunction(orderBy: string) {
    const [keyPath, desc] = orderBy.split(' ')

    return (left: IRecursiveRecord, right: IRecursiveRecord) => {
      const leftValue = this.getSourceValue(keyPath, left)
      const rightValue = this.getSourceValue(keyPath, right)
      if (leftValue < rightValue) {
        return desc ? 1 : -1
      }
      return desc ? -1 : 1
    }
  }

  private static getSourceValue(keyPath: string, source: IRecursiveRecord) {
    const pathArray = keyPath.split('.')
    return pathArray.reduce((accumulator: IInputValue, current: string) => {
      if (typeof accumulator !== 'object' || Array.isArray(accumulator)) {
        return accumulator
      }
      return accumulator[current]
    }, source)
  }

  static parseEqualFilters(filterBy?: string): Record<string, string[]> {
    // A==1,A==2;B==1,B==2 means (A==1||(A==2) && (B==1)||B==2)
    if (!filterBy) {
      return {}
    }

    const map: Record<string, string[]> = {}
    const items = filterBy.split(';')

    items.forEach((item: string) => {
      const subItems = item.split(',')

      subItems
        .filter((item) => item.length > 0)
        .forEach((subItem) => {
          const { keyPath, value } = this.parseFilter(subItem)
          if (map[keyPath]) {
            map[keyPath].push(value)
          } else {
            map[keyPath] = [value]
          }
        })
    })

    return map
  }

  // return [orderKey, orderValue]
  static parseOrderBy(orderBy?: string): { key: string; order: string } | undefined {
    if (!orderBy) return
    const orderByItems = orderBy.trim().split(' ')
    if (orderByItems.length === 2) {
      return { key: orderByItems[0], order: orderByItems[1] }
    }
    return
  }
}
