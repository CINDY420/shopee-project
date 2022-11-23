import { IsString, IsOptional, IsNumberString, Matches } from 'class-validator'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'

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
type IKeyValuesMap = Record<string, string[]>

export class ListQuery {
  @IsOptional()
  @IsNumberString()
  offset?: string = '0'

  @IsOptional()
  @IsNumberString()
  limit?: string = '10'

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

  private static parseFilter(filter: string) {
    const supportedFilterCharacter = /^([a-zA-Z-_.]+)(>|<|<=|>=|==|!=|=@|!@|^=|\$=|=~|!~)([^=]+)$/
    const match = filter.match(supportedFilterCharacter)
    if (!match) {
      throwError(ERROR.SYSTEM_ERROR.COMMON.LIST_QUERY_ERROR, filter)
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
  public static parseFilterBy(filterBy?: string) {
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

  public static parseMustFiltersToKeyValuesMap(filterBy?: string): IKeyValuesMap {
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
  public static convertOrderByWithDot(orderBy?: string) {
    if (!orderBy) {
      return undefined
    }
    if (/^[\w$_.]+( desc)$/.test(orderBy)) {
      return orderBy.replace(' ', '.')
    }
    return `${orderBy}.asc`
  }

  /**
   * 将符合条件的data筛选出来
   * @param mustItems
   * @param sources
   */
  public static getFilteredData(mustItems?: IAndItemList, sources: IRecursiveRecord[] = []) {
    if (!mustItems) {
      return sources
    }
    return sources.filter((source) =>
      mustItems.every((mustItem) =>
        mustItem.some((optionalItem) => ListQuery.matchOptionalCondition(source, optionalItem)),
      ),
    )
  }

  private static matchOptionalCondition(source: IRecursiveRecord, optionalItem: IFilterItem) {
    const { keyPath, operator, value } = optionalItem

    const sourceValue = this.getSourceValue(keyPath, source)

    if (Array.isArray(sourceValue) || (typeof sourceValue === 'string' && operator === '=@')) {
      return sourceValue.indexOf(value) > -1
    } else if (typeof sourceValue === 'string' || typeof sourceValue === 'number') {
      return sourceValue === value
    }
    return false
  }

  /**
   * get compare function for sorting
   * @param orderBy
   */
  public static getCompareFunction(orderBy: string) {
    const [keyPath, desc] = orderBy.split(' ')

    return (left: IRecursiveRecord, right: IRecursiveRecord) => {
      const leftValue = this.getSourceValue(keyPath, left)
      const rightValue = this.getSourceValue(keyPath, right)
      if (leftValue < rightValue) {
        return desc ? 1 : -1
      } else {
        return desc ? -1 : 1
      }
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
}
