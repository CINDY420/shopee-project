import { BadRequestException } from '@nestjs/common'

// FilterItem for key oper value
interface IFilterItem {
  key: string
  operator: string
  value: string
}

// OrItemList is A || B || C
type IOrItemList = IFilterItem[]

// AndItemList is A && B && C
type IAndItemList = IOrItemList[]

export const generateSortHandler = (orderBy: string) => {
  const [propertyName, desc] = orderBy.split(' ')

  return (a, b) => {
    if (a[propertyName] < b[propertyName]) {
      return desc ? 1 : -1
    }

    if (b[propertyName] < a[propertyName]) {
      return desc ? -1 : 1
    }

    return 0
  }
}

export const filterHandler = (andList: IAndItemList, sources: any[] = []): any[] => {
  if (!andList) {
    return sources
  }
  const result = sources.filter((source) => {
    return isSourceMatch(source, andList)
  })

  return result
}

export const isSourceMatch = (source, andList: IAndItemList) => {
  let res = true
  andList.forEach((andItem) => {
    let filterResult = false
    andItem.forEach((filterItem) => {
      const { key, operator, value } = filterItem
      const target = source[key] || source[`${key}s`]
      let condition = false
      if (target instanceof Array || operator === '=@') {
        condition = target.indexOf(value) > -1
      } else {
        condition = target === value
      }

      if (condition) filterResult = true
    })
    res = res && filterResult
  })
  return res
}

export const parseFilters = (filters: string): IAndItemList => {
  // A==1,A==2;B==1,B==2 means (A==1||(A==2) && (B==1)||B==2)

  if (filters === '') {
    return null
  }

  const items = filters.split(';')

  const andItemList: IOrItemList[] = items.map((item: string) => {
    const subItems = item.split(',')

    const orItemList = subItems.map((subItem) => {
      const filterItem = parseFilter(subItem)
      return filterItem
    })

    return orItemList
  })

  return andItemList
}

export const parseFiltersMap = (filters: string, searchBoxOnly?: boolean): { [key: string]: string[] } => {
  // A==1,A==2;B==1,B==2 means (A==1||(A==2) && (B==1)||B==2)
  if (!filters || filters === '') {
    return {}
  }

  const map = {}
  const items = filters.split(';')

  items.forEach((item: string) => {
    const subItems = item.split(',')

    subItems.forEach((subItem) => {
      const { key, value } = parseFilter(subItem, searchBoxOnly)
      map[key] = map[key] || []
      map[key].push(value)
    })
  })

  return map
}

export const parseFilter = (filter: string, searchBoxOnly?: boolean): IFilterItem => {
  const regexpFilterUnsupportedCharacter = searchBoxOnly
    ? /^([a-zA-Z-_]+)(>|<|<=|>=|==|!=|=@|!@|^=|$=|=~|!~)(.+)$/
    : /^([a-zA-Z-_]+)(>|<|<=|>=|==|!=|=@|!@|^=|$=|=~|!~)([^=]+)$/
  const match = filter.match(regexpFilterUnsupportedCharacter)
  if (!match) {
    throw new BadRequestException(`filter ${filter} is invalid!`)
  }
  const [, key, operator, value] = match
  return {
    key,
    operator,
    value
  }
}
