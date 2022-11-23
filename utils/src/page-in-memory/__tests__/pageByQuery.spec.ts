import { pageInMemory, listQuery } from '@/index'
const { ORDER } = listQuery
const { pageByQuery } = pageInMemory

describe('Test pageByQuery', () => {
  const mockItems = [
    { name: 'lily', age: 13, country: 'China' },
    { name: 'jack', age: 30, country: 'USA' },
    { name: 'mary', age: 25, country: 'USA' },
    { name: 'kangkang', age: 10, country: 'USA' },
    { name: 'lisi', age: 30, country: 'USA' },
    { name: 'mark', age: 44, country: 'China' },
  ]

  test('filter one keyPath', () => {
    const mockQuery = {
      offset: 1,
      limit: 3,
      filterBy: 'country==USA;age>10',
      orderBy: `name ${ORDER.DESCEND}`,
    }
    const { items: pagedItems, total } = pageByQuery({ items: mockItems, query: mockQuery })
    expect(total).toBe(3)

    const expectedItems = [
      { name: 'lisi', age: 30, country: 'USA' },
      { name: 'jack', age: 30, country: 'USA' },
    ]
    pagedItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })
})
