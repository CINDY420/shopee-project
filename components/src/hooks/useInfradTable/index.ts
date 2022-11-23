import { useEffect, useState } from 'react'
import { useAntdTable, useInterval } from 'ahooks'
import { Data, Params, AntdTableOptions, Service } from 'ahooks/lib/useAntdTable/types'
import { TableProps } from 'infrad/lib/table'
import { DEFAULT_TABLE_PAGINATION, ROWS_PER_PAGE_OPTIONS } from '@/hooks/useInfradTable/constant'
import { TablePaginationConfig } from 'infrad'
import {
  listQueryHOF,
  IListQuery,
  IListQueryFn,
  FilterByOperator,
} from '@/hooks/useInfradTable/helper'

export interface IUseInfradTableOptions<TData extends Data, TParams extends Params>
  extends Omit<AntdTableOptions<TData, TParams>, 'defaultPageSize'> {
  /**
   * Pass a number(ms) if you want to refresh the table at intervals
   */
  refreshInterval?: number
  /**
   * The same as pagination prop of Antd Table
   */
  pagination?: TablePaginationConfig
}

export const useInfradTable = <TData extends Data, TParams extends Params>(
  service: Service<TData, TParams>,
  options?: IUseInfradTableOptions<TData, TParams>,
) => {
  const { refreshInterval, pagination: customPagination, ...restOptions } = options || {}
  const { refreshDeps } = restOptions
  const [shouldLoading, setShouldLoading] = useState(true)

  const { tableProps, loading, refreshAsync, refresh, run, runAsync, ...others } = useAntdTable(
    service,
    {
      ...options,
      defaultPageSize: customPagination?.defaultPageSize ?? ROWS_PER_PAGE_OPTIONS[0],
    },
  )
  const { onChange, pagination, ...otherTableProps } = tableProps

  // enable loading if trigger 'run' callbacks
  const handleRefreshAsync = async () => {
    setShouldLoading(true)
    return await refreshAsync()
  }
  const handleRefresh = () => {
    setShouldLoading(true)
    return refresh()
  }
  const handleRun = (...params: TParams) => {
    setShouldLoading(true)
    return run(...params)
  }
  const handleRunAsync = async (...params: TParams) => {
    setShouldLoading(true)
    return await runAsync(...params)
  }

  // disable loading if run 'refresh' at intervals
  useInterval(() => {
    if (!loading) {
      refresh()
      setShouldLoading(false)
    }
  }, refreshInterval)

  // enable loading if refreshDeps change
  useEffect(() => {
    setShouldLoading(true)
  }, refreshDeps)

  // enable loading if user page, filter or sort
  const handleTableChange: TableProps<any>['onChange'] = (pagination, filters, sorter) => {
    setShouldLoading(true)
    onChange(pagination, filters, sorter)
  }

  return {
    ...others,
    refreshAsync: handleRefreshAsync,
    refresh: handleRefresh,
    run: handleRun,
    runAsync: handleRunAsync,
    tableProps: {
      ...otherTableProps,
      pagination: {
        ...DEFAULT_TABLE_PAGINATION,
        ...customPagination,
        ...pagination,
      },
      onChange: handleTableChange,
      loading: shouldLoading && loading,
    },
    loading: shouldLoading && loading,
  }
}

/**
 * Extends from useInfradTable, it add listQueryHOF to transform infrad Table params to listQuery object,
 * so users can pass their listQueryFn directly
 */

export const useListQueryTable = <TData extends Data, TParams extends Params>(
  service: (args: IListQuery) => Promise<TData>,
  options?: IUseInfradTableOptions<TData, TParams>,
) => useInfradTable<TData, TParams>(listQueryHOF<TData, TParams>(service), options)

export { FilterByOperator, IListQuery, IListQueryFn }
