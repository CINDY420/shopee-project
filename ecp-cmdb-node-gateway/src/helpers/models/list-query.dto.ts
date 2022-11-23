import { IsString, IsOptional, IsNumber, Matches } from 'class-validator'
import { Type } from 'class-transformer'
import { ERROR } from '@/helpers/constants/error'
import { throwError } from '@infra-node-kit/exception'
import { HttpStatus } from '@nestjs/common'

/**
 * @see https://confluence.shopee.io/pages/viewpage.action?pageId=609075996#APIGuideline-orderBy
 */

interface IRecursiveRecord {
  [key: string]: any
}

interface IFilterItem {
  keyPath: string
  operator: string
  value: string
}
type IOrItemList = IFilterItem[]
type IAndItemList = IOrItemList[]
type IKeyValuesMap = Record<string, string[]>

export enum FILTER_TYPE {
  FILTER_BY,
  SEARCH_BY,
}

export class ListQuery {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number

  @IsOptional()
  @IsString()
  @Matches(/^[\w$_.]+( desc)?$/)
  orderBy?: string

  @IsOptional()
  @IsString()
  filterBy?: string

  @IsOptional()
  @IsString()
  searchBy?: string

  static parseFilter(filter: string) {
    const supportedFilterCharacter =
      /^([0-9a-zA-Z-_.]+)(>|<|<=|>=|==|!=|=@|!@|^=|\$=|=~|!~)([^=]+)$/
    const match = filter.match(supportedFilterCharacter)
    if (!match) {
      throwError(
        `unsupported list query: ${filter}`,
        ERROR.SYSTEM_ERROR.COMMON.LIST_QUERY_ERROR.code,
        HttpStatus.BAD_REQUEST,
      )
    }
    const [_ignored, keyPath, operator, value] = match
    return {
      keyPath,
      operator,
      value,
    }
  }

  /**
   * 将filterBy转换为一个二元数组，第一层是and条件 第二层是or条件
   * @param filterBy
   */
  static parseFilterBy(filterBy?: string) {
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

  static parseMustFiltersToKeyValuesMap(filterBy?: string): IKeyValuesMap {
    // A==1,A==2;B==1,B==2 means (A==1||(A==2) && (B==1)||B==2)
    if (!filterBy || filterBy === '') {
      return {}
    }

    const map: IKeyValuesMap = {}
    const items = filterBy.split(';')

    items.forEach((item: string) => {
      const subItems = item.split(',')

      subItems.forEach((subItem) => {
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

  /**
   * 转换一下orderBy，把空格换成. 并且补全一下后缀
   * @param orderBy
   * @example createTime => createTime.asc
   *          createTime desc => createTime.desc
   */
  static convertOrderByWithDot(orderBy?: string) {
    if (!orderBy) {
      return undefined
    }
    if (/^[\w$_.]+( desc)$/.test(orderBy)) {
      return orderBy.replace(' ', '.')
    }
    return `${orderBy}.asc`
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

  /**
   * 将符合条件的data筛选出来
   * @param mustItems
   * @param sources
   */
  static getFilteredData<T extends IRecursiveRecord>(
    type: FILTER_TYPE,
    mustItems?: IAndItemList,
    sources: T[] = [],
  ) {
    if (!mustItems) {
      return sources
    }
    return sources.filter((source) =>
      mustItems.every((mustItem) =>
        mustItem.some((optionalItem) =>
          type === FILTER_TYPE.FILTER_BY
            ? ListQuery.matchOptionalCondition(source, optionalItem)
            : ListQuery.testEachSearchBy(source, optionalItem),
        ),
      ),
    )
  }

  private static isStringArray(array: string[] | Record<string, string>[]): array is string[] {
    return typeof array[0] === 'string'
  }
  private static matchOptionalCondition<T extends IRecursiveRecord>(
    source: T,
    optionalItem: IFilterItem,
  ) {
    const { keyPath, operator, value } = optionalItem

    const sourceValue = this.getSourceValue(keyPath, source)

    // sourceValue is array of object
    if (Array.isArray(sourceValue) && !ListQuery.isStringArray(sourceValue)) {
      return sourceValue[0] && Object.values(sourceValue[0]).includes(value)
    }
    // sourceValue is array of string or ....
    if (Array.isArray(sourceValue) || (typeof sourceValue === 'string' && operator === '=@')) {
      return sourceValue.indexOf(value) > -1
    }
    // sourceValue is string or number
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

  private static getSourceValue<T extends IRecursiveRecord>(keyPath: string, source: T) {
    const pathArray = keyPath.split('.')
    return pathArray.reduce((accumulator: any, current: string) => {
      if (typeof accumulator !== 'object' || Array.isArray(accumulator)) {
        return accumulator
      }
      return accumulator[current]
    }, source)
  }
}
