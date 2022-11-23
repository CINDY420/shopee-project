import { listQuery, pageInMemory } from '@/index'
const { FilterByOperator } = listQuery
const { filter } = pageInMemory

describe('Test filter', () => {
  const mockItems = [
    {
      name: 'lily',
      age: 13,
      country: 'China',
    },
    {
      name: 'jack',
      age: 30,
      country: 'USA',
    },
    {
      name: 'mary',
      age: 25,
      country: 'USA',
    },
    {
      name: 'kangkang',
      age: 10,
      country: 'China',
    },
    {
      name: 'lisi',
      age: 30,
      country: 'USA',
    },
    {
      name: 'mark',
      age: 44,
      country: 'China',
    },
  ]

  test('filter one keyPath', () => {
    const mockFilterItems = [
      { keyPath: 'name', operator: FilterByOperator.EQUAL, value: 'jack' },
      { keyPath: 'name', operator: FilterByOperator.EQUAL, value: 'mary' },
    ]
    const filteredItems = filter({ items: mockItems, filterByItems: mockFilterItems })
    const expectedItems = [
      { name: 'jack', age: 30, country: 'USA' },
      { name: 'mary', age: 25, country: 'USA' },
    ]
    expect(filteredItems.length).toEqual(expectedItems.length)
    filteredItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })

  test('filter multiple keyPath', () => {
    const mockFilterItems = [
      { keyPath: 'country', operator: FilterByOperator.EQUAL, value: 'China' },
      { keyPath: 'age', operator: FilterByOperator.GREATER_THAN, value: '12' },
    ]
    const filteredItems = filter({ items: mockItems, filterByItems: mockFilterItems })
    const expectedItems = [
      { name: 'lily', age: 13, country: 'China' },
      { name: 'mark', age: 44, country: 'China' },
    ]
    filteredItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })
})
