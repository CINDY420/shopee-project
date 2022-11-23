import useAntdTable, { IAntdTableProps, IAntdTableResult } from '../useAntdTable'
import * as queryParams from 'helpers/queryParams'
import * as helpersPagination from 'helpers/pagination'
import { renderHook, RenderHookResult, act } from '@testing-library/react-hooks'
import { TablePaginationConfig } from 'infrad/lib/table'
import { SorterResult, TableCurrentDataSource } from 'infrad/lib/table/interface'

let fetchFn: jest.Mock<any>
let hook: RenderHookResult<IAntdTableProps, IAntdTableResult<any>>
// mocking dependencies
let getFilterUrlParamMock: jest.SpyInstance
let formatSorterMock: jest.SpyInstance
let formatPaginationMock: jest.SpyInstance

// mock data
const pagination: TablePaginationConfig = {
  current: 1,
  pageSize: 10,
}
const filters = { name: ['a'] }
const sorters: SorterResult<any>[] = [
  { column: { title: 'Time', dataIndex: 'time', key: 'name' }, order: 'descend' },
]
const extra: TableCurrentDataSource<any> = { currentDataSource: [], action: 'filter' }

const filterUrlParam = 'name==a'
const sorterUrlParam = 'time desc'
const paginationUrlParam = { offset: 0, limit: pagination.pageSize }

beforeEach(() => {
  // setup hook for each test case
  fetchFn = jest.fn()
  hook = renderHook(() => useAntdTable({ fetchFn }))

  // dependencies mocking
  getFilterUrlParamMock = jest.spyOn(queryParams, 'getFilterUrlParam')
  formatSorterMock = jest.spyOn(helpersPagination, 'formatSorter')
  formatPaginationMock = jest.spyOn(helpersPagination, 'formatPagination')

  getFilterUrlParamMock.mockReturnValue(filterUrlParam)
  formatSorterMock.mockReturnValue(sorterUrlParam)
  formatPaginationMock.mockReturnValue(paginationUrlParam)
})

afterEach(() => {
  // dependencies un-mock
  getFilterUrlParamMock.mockRestore()
  formatSorterMock.mockRestore()
  formatPaginationMock.mockRestore()
})

describe('fetchFn', () => {
  it('should be invoked with initial pagination info at first render', () => {
    const initialPaginationInfo = { offset: 0, limit: pagination.pageSize }

    expect(fetchFn.mock.calls.length).toEqual(1)
    expect(fetchFn.mock.calls[0][0]).toEqual(initialPaginationInfo)
  })

  it('should be only invoked once after several re-renders', () => {
    const { rerender } = hook

    rerender()
    rerender()

    expect(fetchFn.mock.calls.length).toEqual(1)
  })
})

describe('filterTypeLookup', () => {
  const nameUrlParams = {
    key: 'name',
    type: queryParams.FILTER_TYPES.EQUAL,
    value: ['a'],
  }

  it('default filter type should be filterTypes.equal if filterTypeLookup is not provided', () => {
    const { handleTableChange } = hook.result.current
    act(() => handleTableChange(pagination, filters, sorters, extra))

    expect(getFilterUrlParamMock).toBeCalledWith({
      name: nameUrlParams,
    })
  })

  it('filter type should be taken from provided filterTypeLookup if provided', () => {
    fetchFn = jest.fn()
    hook = renderHook(() =>
      useAntdTable({ fetchFn, filterTypeLookup: { name: queryParams.FILTER_TYPES.CONTAIN } }),
    )

    const { handleTableChange } = hook.result.current
    act(() => handleTableChange(pagination, filters, sorters, extra))

    expect(getFilterUrlParamMock).toBeCalledWith({
      name: {
        ...nameUrlParams,
        type: queryParams.FILTER_TYPES.CONTAIN,
      },
    })
  })
})

describe('orderDefault', () => {
  it('order type should be "" if orderDefault is not provided', () => {
    fetchFn = jest.fn()
    hook = renderHook(() => useAntdTable({ fetchFn }))

    const { refresh } = hook.result.current
    act(() => refresh())

    expect(fetchFn).toHaveBeenNthCalledWith(1, paginationUrlParam)
    expect(fetchFn).toHaveBeenNthCalledWith(2, {
      filterBy: '',
      orderBy: '',
      offset: paginationUrlParam.offset,
      limit: paginationUrlParam.limit,
    })
  })

  it('order type should be taken from provided orderDefault if provided', () => {
    fetchFn = jest.fn()
    hook = renderHook(() => useAntdTable({ fetchFn, orderDefault: sorterUrlParam }))

    const { refresh } = hook.result.current
    act(() => refresh())

    expect(fetchFn).toHaveBeenNthCalledWith(1, paginationUrlParam)
    expect(fetchFn).toHaveBeenNthCalledWith(2, {
      orderBy: sorterUrlParam,
      filterBy: '',
      offset: paginationUrlParam.offset,
      limit: paginationUrlParam.limit,
    })
  })
})

describe('shouldFetchOnMounted', () => {
  it('default shouldFetchOnMounted is true, it should call fetchFn when component is mounted', () => {
    fetchFn = jest.fn()
    hook = renderHook(() => useAntdTable({ fetchFn }))

    expect(fetchFn).toHaveBeenCalledTimes(1)
  })
  it('if shouldFetchOnMounted is false, it should not call fetchFn when component is mounted', () => {
    fetchFn = jest.fn()
    hook = renderHook(() => useAntdTable({ fetchFn, shouldFetchOnMounted: false }))

    expect(fetchFn).toHaveBeenCalledTimes(0)
  })
})

describe('handleTableChange', () => {
  it('should call fetchFn with updated table change information', () => {
    const { handleTableChange } = hook.result.current

    act(() => handleTableChange(pagination, filters, sorters, extra))

    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(fetchFn).toHaveBeenLastCalledWith({
      filterBy: filterUrlParam,
      orderBy: sorterUrlParam,
      offset: paginationUrlParam.offset,
      limit: paginationUrlParam.limit,
    })
  })

  it('should update pagination state after pagination info change', () => {
    const { handleTableChange } = hook.result.current

    act(() => handleTableChange(pagination, filters, sorters, extra))

    expect(hook.result.current.pagination).toEqual(pagination)
  })
})

describe('refresh', () => {
  const nextPagination: TablePaginationConfig = { pageSize: 20, current: 2 }
  const nextPaginationUrlParam = { offset: 1, limit: nextPagination.pageSize }

  beforeEach(() => {
    const { handleTableChange } = hook.result.current
    formatPaginationMock.mockReturnValue(nextPaginationUrlParam)

    act(() => handleTableChange(nextPagination, filters, sorters, extra))
  })

  it('should persist filters and sorter info but with reset pagination info when fromBeginning is true', () => {
    const { refresh } = hook.result.current
    const resetPagination: TablePaginationConfig = { current: 1, pageSize: nextPagination.pageSize }
    const resetPaginationUrlParam = { offset: 0, limit: nextPagination.pageSize }
    formatPaginationMock.mockReturnValue(resetPaginationUrlParam)

    act(() => refresh())

    expect(formatPaginationMock).toBeCalledWith(resetPagination)
    expect(hook.result.current.pagination).toEqual(resetPagination)
    expect(fetchFn).toHaveBeenCalledWith({
      offset: resetPaginationUrlParam.offset,
      limit: resetPaginationUrlParam.limit,
      orderBy: sorterUrlParam,
      filterBy: filterUrlParam,
    })
  })

  it('should persist filters, sorter info and pagination info when fromBeginning is false', () => {
    const { refresh } = hook.result.current

    act(() => refresh(false))
    expect(formatPaginationMock).toHaveBeenCalledWith(nextPagination)
    expect(fetchFn).toHaveBeenCalledWith({
      offset: nextPaginationUrlParam.offset,
      limit: nextPaginationUrlParam.limit,
      orderBy: sorterUrlParam,
      filterBy: filterUrlParam,
    })
  })
})
