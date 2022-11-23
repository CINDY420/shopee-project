import { listQuery, pageInMemory } from '@/index'
const { ORDER } = listQuery
const { sort } = pageInMemory

describe('Test sort', () => {
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

  test('sort age ascend', () => {
    const orderBy = {
      keyPath: 'age',
      order: ORDER.ASCEND,
    }
    const sortedItems = sort({ items: mockItems, orderBy })
    const expectedItems = mockItems.sort((cur, next) => cur.age - next.age)
    sortedItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })

  test('sort age descend', () => {
    const orderBy = {
      keyPath: 'age',
      order: ORDER.DESCEND,
    }
    const sortedItems = sort({ items: mockItems, orderBy })
    const expectedItems = mockItems.sort((cur, next) => next.age - cur.age)
    sortedItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })

  test('sort name ascend', () => {
    const orderBy = {
      keyPath: 'name',
      order: ORDER.ASCEND,
    }
    const sortedItems = sort({ items: mockItems, orderBy })
    const expectedItems = mockItems.sort((cur, next) => (cur.name > next.name ? -1 : 1))
    sortedItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })

  test('sort name descend', () => {
    const orderBy = {
      keyPath: 'age',
      order: ORDER.DESCEND,
    }
    const sortedItems = sort({ items: mockItems, orderBy })
    const expectedItems = mockItems.sort((cur, next) => (next.name > cur.name ? -1 : 1))
    sortedItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })
})
