import { renderHook } from '@testing-library/react-hooks'
import { render, waitFor } from '@testing-library/react'

import { useInfradTable, useListQueryTable } from '@/hooks'
import { StyledTable } from '@/commonStyles/StyledTable'
import { DEFAULT_TABLE_PAGINATION } from '@/hooks/useInfradTable/constant'

const mockResponse = { list: [{ name: 'mock-data1' }, { name: 'mock-data2' }], total: 2 }
const mockFetchData = () => Promise.resolve(mockResponse)

describe('useInfradTable', () => {
  test('Basic Usage', async () => {
    const mockRequest = jest.fn(mockFetchData)
    const { result, waitForNextUpdate } = renderHook(() => useInfradTable(mockRequest))

    await waitForNextUpdate()

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(result.current.tableProps.loading).toBe(false)
    expect(result.current.tableProps.pagination.current).toBe(1)
    expect(result.current.tableProps.pagination.pageSize).toBe(10)
    expect(result.current.tableProps.pagination.total).toBe(mockResponse.total)
    expect(result.current.tableProps.pagination.pageSizeOptions).toBe(
      DEFAULT_TABLE_PAGINATION.pageSizeOptions,
    )
    expect(result.current.tableProps.pagination.showSizeChanger).toBe(
      DEFAULT_TABLE_PAGINATION.showSizeChanger,
    )
    expect(result.current.tableProps.pagination.size).toBe(DEFAULT_TABLE_PAGINATION.size)
    expect(result.current.tableProps.pagination.showTotal).toBe(DEFAULT_TABLE_PAGINATION.showTotal)
    expect(result.current.tableProps.dataSource).toBe(mockResponse.list)
  })

  test('Refresh At Intervals', async () => {
    const mockRequest = jest.fn(mockFetchData)
    const TestComponent = () => {
      const { tableProps } = useInfradTable(mockRequest, { refreshInterval: 200 })
      return (
        <StyledTable
          columns={[{ title: 'Name', dataIndex: 'name', key: 'name' }]}
          {...tableProps}
        />
      )
    }
    const { getByText } = render(<TestComponent />)

    await waitFor(() => {
      expect(getByText('mock-data1')).toBeInTheDocument()
    })

    expect(mockRequest).toHaveBeenCalledTimes(1)
    await new Promise((resolve) => setTimeout(resolve, 600))
    expect(mockRequest).toHaveBeenCalledTimes(4)
  })

  test('Custom Pagination', async () => {
    const mockRequest = jest.fn(mockFetchData)
    const mockPagination = {
      pageSizeOptions: [2, 4, 6],
      defaultPageSize: 2,
    }
    const { result, waitForNextUpdate } = renderHook(() =>
      useInfradTable(mockRequest, {
        pagination: mockPagination,
      }),
    )

    await waitForNextUpdate()

    expect(result.current.tableProps.pagination.pageSize).toBe(mockPagination.defaultPageSize)
    expect(result.current.tableProps.pagination.pageSizeOptions).toBe(
      mockPagination.pageSizeOptions,
    )
  })

  test('useListQueryTable Usage', async () => {
    const mockResponse = { list: [{ name: 'mock-data1' }, { name: 'mock-data2' }], total: 2 }
    const mockListQueryApi = () => Promise.resolve(mockResponse)
    const mockRequest = jest.fn(mockListQueryApi)

    const { result, waitForNextUpdate } = renderHook(() => useListQueryTable(mockRequest))

    await waitForNextUpdate()

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(result.current.tableProps.loading).toBe(false)
    expect(result.current.tableProps.pagination.total).toBe(mockResponse.total)
    expect(result.current.tableProps.dataSource).toBe(mockResponse.list)
  })
})
