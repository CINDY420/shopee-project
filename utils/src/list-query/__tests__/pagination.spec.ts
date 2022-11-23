import { listQuery } from '@/index'
const { paginationToOffsetLimit, offsetLimitToPagination } = listQuery

describe('Test pagination', () => {
  test('paginationToOffsetLimit: normal case', () => {
    const { offset, limit } = paginationToOffsetLimit({ currentPage: 100, pageSize: 10 })
    expect(offset).toBe(990)
    expect(limit).toBe(10)
  })

  test('paginationToOffsetLimit: abnormal case', () => {
    const { offset, limit } = paginationToOffsetLimit({ currentPage: -4, pageSize: 10 })
    expect(offset).toBe(0)
    expect(limit).toBe(10)
  })

  test('offsetLimitToPagination: normal case', () => {
    const { currentPage, pageSize } = offsetLimitToPagination({ offset: 990, limit: 10 })
    expect(currentPage).toBe(100)
    expect(pageSize).toBe(10)
  })

  test('offsetLimitToPagination: abnormal case', () => {
    const { currentPage, pageSize } = offsetLimitToPagination({ offset: 88, limit: 10 })
    expect(currentPage).toBe(9)
    expect(pageSize).toBe(10)
  })
})
