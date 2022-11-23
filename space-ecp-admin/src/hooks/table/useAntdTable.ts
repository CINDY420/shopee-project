import React from 'react'
import { TableProps, TablePaginationConfig } from 'infrad/lib/table'
import { PaginationProps } from 'infrad/lib/pagination'

import {
  FilterTypes,
  IFilterItem,
  getFilterUrlParam,
  formatPagination,
  formatSorter,
  PAGE,
  PAGE_SIZE,
} from 'src/hooks/table/helper'

export interface IAntdTableProps {
  fetchFn: (args: any) => Promise<any> | any
  filterTypeLookup?: Record<string, FilterTypes>
  orderDefault?: string
  shouldFetchOnMounted?: boolean
}

type IAntdTableOnChange<TRecordType> = NonNullable<TableProps<TRecordType>['onChange']>

export interface IAntdTableResult<TRecordType> {
  pagination: TablePaginationConfig
  handleTableChange: IAntdTableOnChange<TRecordType>
  refresh: (fromBeginning?: boolean, targetPagination?: PaginationProps) => void
}

/**
 * useAntdTable handle the data fetching of the infrad table when table change
 * @param fetchFn function for data fetching
 * @param filterTypeLookup map from filter name to filter type
 * @returns handleTableChange this function is used to be the event listener of table onChange event
 * @returns refresh this function is used to fetch the table from beginning with filters and orderBy persisted
 * @returns pagination contains the pagination information of the table
 */
const useAntdTable = <TRecordType = any>({
  fetchFn,
  filterTypeLookup = {},
  orderDefault = '',
  shouldFetchOnMounted = true,
}: IAntdTableProps): IAntdTableResult<TRecordType> => {
  const [filterBy, setFilterBy] = React.useState('')
  const [orderBy, setOrderBy] = React.useState(orderDefault)
  const [paginationState, setPaginationState] = React.useState<PaginationProps>({
    current: PAGE,
    pageSize: PAGE_SIZE,
  })
  const upToDateStore = React.useRef({
    filterBy,
    orderBy,
    paginationState,
    fetchFn,
    filterTypeLookup,
  })
  // make sure every re-render will update the ref value to the latest one
  upToDateStore.current = {
    filterBy,
    orderBy,
    paginationState,
    fetchFn,
    filterTypeLookup,
  }

  const handleTableChange = React.useCallback<IAntdTableOnChange<TRecordType>>(
    (pagination, filters, sorter) => {
      const { fetchFn, filterTypeLookup } = upToDateStore.current

      const filterParams: Record<string, IFilterItem> = {}

      Object.entries(filters).forEach(([key, value]) => {
        const filterType = filterTypeLookup[key] || FilterTypes.EQUAL
        filterParams[key] = { key, value, type: filterType }
      })
      const filterBy = getFilterUrlParam(filterParams) || ''
      const orderBy = formatSorter<TRecordType>(sorter) || ''
      const { offset, limit } = formatPagination(pagination)

      setFilterBy(filterBy)
      setOrderBy(orderBy)
      setPaginationState(pagination)

      fetchFn({
        filterBy,
        orderBy,
        offset,
        limit,
      })
    },
    [],
  )

  React.useEffect(() => {
    if (shouldFetchOnMounted) {
      const { fetchFn, paginationState } = upToDateStore.current
      const { offset, limit } = formatPagination(paginationState)

      fetchFn({
        offset,
        limit,
      })
    }
  }, [shouldFetchOnMounted])

  const refresh = React.useCallback((fromBeginning = true, targetPagination = {}) => {
    const { fetchFn, paginationState, filterBy, orderBy } = upToDateStore.current
    let newPagination = { ...paginationState, ...targetPagination }

    if (fromBeginning) {
      newPagination = {
        ...paginationState,
        current: 1,
      }
    }

    setPaginationState(newPagination)

    const { offset, limit } = formatPagination(newPagination)

    fetchFn({
      filterBy,
      orderBy,
      offset,
      limit,
    })
  }, [])

  return {
    pagination: paginationState,
    handleTableChange,
    refresh,
  }
}

export default useAntdTable
export * from 'src/hooks/table/helper'
