import { listQuery } from '@/index'

describe('Test orderBy', () => {
  const mockOrderBy = { keyPath: 'time', order: listQuery.ORDER.ASCEND }
  const mockBuildedOrderBy = `time ${listQuery.ORDER.ASCEND}`
  test('buildOrderBy', () => {
    const buildedOrderBy = listQuery.buildOrderBy(mockOrderBy)
    expect(buildedOrderBy).toBe(mockBuildedOrderBy)
  })

  test('parseOrderBy', () => {
    const parsedOrderBy = listQuery.parseOrderBy(mockBuildedOrderBy)
    expect(parsedOrderBy).toEqual(mockOrderBy)
  })
})
