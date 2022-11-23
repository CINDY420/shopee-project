import { listQueryHOF, IListQueryFn, FilterByOperator } from '@/hooks/useInfradTable/helper'
import { listQuery } from '@infra/utils'

describe('listQueryHOF', () => {
  test('mock request', async () => {
    const mockResponse = { data: 'mock-data' }
    const mockParams = {
      current: 2,
      pageSize: 2,
      sorter: {
        columnKey: 'age',
        field: 'age',
        order: 'ascend',
        column: {
          dataIndex: 'age',
          key: 'age',
          sorter: true,
          title: 'Age',
        },
      },
      filters: {
        address: ['London'],
      },
    }
    const mockRequest: IListQueryFn<any> = jest.fn(() => Promise.resolve(mockResponse))
    const expectedListQueryParams = {
      filterBy: 'address==London',
      limit: '2',
      offset: '2',
      orderBy: 'age ascend',
      filterByBuilder: new listQuery.FilterByBuilder([
        {
          keyPath: 'address',
          operator: FilterByOperator.EQUAL,
          value: 'London',
        },
      ]),
    }

    const listQueryRequest = listQueryHOF(mockRequest)
    const result = await listQueryRequest(mockParams)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith(expectedListQueryParams)
    expect(result).toBe(mockResponse)
  })
})
