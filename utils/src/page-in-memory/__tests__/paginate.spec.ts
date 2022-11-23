import { pageInMemory } from '@/index'
const { paginate } = pageInMemory

describe('Test paginate', () => {
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

  test('paginate with offset=0, limit=5', () => {
    const pagedItems = paginate({ items: mockItems, offset: 0, limit: 5 })
    const expectedItems = mockItems.slice(0, 5)
    pagedItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })

  test('paginate with offset=3, limit=5', () => {
    const pagedItems = paginate({ items: mockItems, offset: 3, limit: 5 })
    const expectedItems = mockItems.slice(3)
    pagedItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })

  test('paginate with offset=3, limit=50', () => {
    const pagedItems = paginate({ items: mockItems, offset: 3, limit: 5 })
    const expectedItems = mockItems.slice(3)
    pagedItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })

  test('paginate with offset=10, limit=50', () => {
    const pagedItems = paginate({ items: mockItems, offset: 10, limit: 50 })
    expect(pagedItems.length).toBe(0)
  })

  test('paginate with offset=-10, limit=5', () => {
    const pagedItems = paginate({ items: mockItems, offset: '-10', limit: 5 })
    const expectedItems = mockItems.slice(0, 5)
    pagedItems.forEach((item, index) => {
      expect(item).toEqual(expectedItems[index])
    })
  })

  test('paginate with offset=-10, limit=-50', () => {
    const pagedItems = paginate({ items: mockItems, offset: '-10', limit: '-100' })
    pagedItems.forEach((item, index) => {
      expect(item).toEqual(mockItems[index])
    })
  })
})
