import { listQuery } from '@/index'

describe('Test filterBy', () => {
  const mockFilterItems = [
    { keyPath: 'name', operator: listQuery.FilterByOperator.EQUAL, value: 'jack' },
    { keyPath: 'age', operator: listQuery.FilterByOperator.GREATER_THAN, value: '13' },
    { keyPath: 'name', operator: listQuery.FilterByOperator.EQUAL, value: 'mary' },
  ]
  const mockFilterBy = 'name==jack,name==mary;age>13'
  test('filterByBuilder', () => {
    const filterBy = new listQuery.FilterByBuilder(mockFilterItems)
    filterBy.append({ keyPath: 'age', operator: listQuery.FilterByOperator.LESS_THAN, value: '50' })
    const filterString = filterBy.build()
    expect(filterString).toBe(`${mockFilterBy},age<50`)
  })

  test('FilterByParser parse', () => {
    const filterByParser = new listQuery.FilterByParser(mockFilterBy)
    const parsedFilterItems = filterByParser.parse()
    expect(parsedFilterItems.length).toBe(mockFilterItems.length)
    parsedFilterItems.forEach((item) => {
      expect(mockFilterItems).toContainEqual(item)
    })
  })

  test('FilterByParser parse empty string', () => {
    const filterByParser = new listQuery.FilterByParser('')
    const parsedFilterItems = filterByParser.parse()
    expect(parsedFilterItems.length).toBe(0)
  })

  test('FilterByParser parse one keyPath with multiple items', () => {
    const filterByParser = new listQuery.FilterByParser('name==jack,name==mary')
    const parsedFilterItems = filterByParser.parse()
    expect(parsedFilterItems.length).toBe(2)
    const mockFilterItems = [
      { keyPath: 'name', operator: listQuery.FilterByOperator.EQUAL, value: 'jack' },
      { keyPath: 'name', operator: listQuery.FilterByOperator.EQUAL, value: 'mary' },
    ]
    parsedFilterItems.forEach((item) => {
      expect(mockFilterItems).toContainEqual(item)
    })
  })

  test('FilterByParser parse one keyPath with one item', () => {
    const filterByParser = new listQuery.FilterByParser('name==jack')
    const parsedFilterItems = filterByParser.parse()
    expect(parsedFilterItems.length).toBe(1)
    const mockFilterItems = [
      { keyPath: 'name', operator: listQuery.FilterByOperator.EQUAL, value: 'jack' },
    ]
    parsedFilterItems.forEach((item) => {
      expect(mockFilterItems).toContainEqual(item)
    })
  })

  test('FilterByParser parseByOperator', () => {
    const filterByParser = new listQuery.FilterByParser(`${mockFilterBy};name==lily`)
    const equalKeyPathValuesMap = filterByParser.parseByOperator(listQuery.FilterByOperator.EQUAL)
    const { name } = equalKeyPathValuesMap
    expect(name).toStrictEqual(['jack', 'mary', 'lily'])
  })

  test('FilterByParser parseByKeyPath', () => {
    const filterByParser = new listQuery.FilterByParser(mockFilterBy)
    const nameOperatorValuesMap = filterByParser.parseByKeyPath('name')
    expect(nameOperatorValuesMap[listQuery.FilterByOperator.EQUAL]).toStrictEqual(['jack', 'mary'])
    expect(nameOperatorValuesMap[listQuery.FilterByOperator.GREATER_THAN]).toBeUndefined()

    const ageOperatorValuesMap = filterByParser.parseByKeyPath('age')
    expect(ageOperatorValuesMap[listQuery.FilterByOperator.EQUAL]).toBeUndefined()
    expect(ageOperatorValuesMap[listQuery.FilterByOperator.GREATER_THAN]).toStrictEqual(['13'])
  })
})
