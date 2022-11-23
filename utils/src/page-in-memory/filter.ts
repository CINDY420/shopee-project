import { IFilterByItem, FilterByOperator } from '@/list-query'

interface IFilterArgs<TItem> {
  items: TItem[]
  filterByItems: IFilterByItem[]
}

export const filter = <TItem extends Record<string, any>>({
  items,
  filterByItems,
}: IFilterArgs<TItem>): TItem[] => {
  const uniqueOperatorFilterByItems = generateUniqueOperatorFilterByItems(filterByItems)
  return items.filter((item) =>
    uniqueOperatorFilterByItems.every(({ keyPath, operator, values }) => {
      if (keyPath in item) {
        const itemKeyPathValue = item[keyPath]
        // ignore invalid value for operating
        if (typeof itemKeyPathValue !== 'string' && typeof itemKeyPathValue !== 'number') {
          return true
        }
        const itemKeyPathValueString = String(itemKeyPathValue)
        const numberValues = values.map((item) => Number(item))
        switch (operator) {
          case FilterByOperator.EQUAL:
            return values.includes(itemKeyPathValueString)
          case FilterByOperator.NOT_EQUAL:
            return !values.includes(itemKeyPathValueString)
          case FilterByOperator.GREATER_THAN:
            return Number(itemKeyPathValueString) > Number(Math.max(...numberValues))
          case FilterByOperator.LESS_THAN:
            return Number(itemKeyPathValueString) < Number(Math.min(...numberValues))
          case FilterByOperator.GREATER_THAN_OR_EQUAL:
            return Number(itemKeyPathValueString) >= Number(Math.max(...numberValues))
          case FilterByOperator.LESS_THAN_OR_EQUAL:
            return Number(itemKeyPathValueString) <= Number(Math.min(...numberValues))
          case FilterByOperator.CONTAINS:
          case FilterByOperator.MATCH_REGEX:
            return values.every((value) => new RegExp(value).test(itemKeyPathValueString))
          case FilterByOperator.NOT_CONTAINS:
          case FilterByOperator.NOT_MATCH_REGEX:
            return !values.some((value) => new RegExp(value).test(itemKeyPathValueString))
          default:
            // ignore not recognized operation
            return true
        }
      }

      // ignore if filter keyPath not found
      return true
    }),
  )
}

interface IUniqueOperatorFilterByItem extends Omit<IFilterByItem, 'value'> {
  values: string[]
}

const generateUniqueOperatorFilterByItems = (
  filterByItems: IFilterByItem[],
): IUniqueOperatorFilterByItem[] => {
  const keyOperatorValuesMap: Record<string, IUniqueOperatorFilterByItem> = {}
  filterByItems.forEach(({ keyPath, operator, value }) => {
    const uniqueKey = `${keyPath}-${operator}`
    if (keyOperatorValuesMap[uniqueKey]) {
      keyOperatorValuesMap[uniqueKey].values.push(value)
    } else {
      keyOperatorValuesMap[uniqueKey] = { keyPath, operator, values: [value] }
    }
  })
  return Object.values(keyOperatorValuesMap)
}
