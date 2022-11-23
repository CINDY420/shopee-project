import * as React from 'react'
import { filterTypes, getFilterItem, getFilterUrlParam } from 'helpers/queryParams'
import { TableProps, TablePaginationConfig } from 'infrad/lib/table'
import { PaginationProps } from 'infrad/lib/pagination'

import { formatPagination, formatSorter } from 'helpers/pagination'
import { PAGE, PAGE_SIZE } from 'constants/pagination'

export interface IAntdTableProps {
  fetchFn: any
  filterTypeLookup?: Record<string, filterTypes>
  orderDefault?: string
  shouldFetchOnMounted?: boolean
}

type IAntdTableOnChange<RecordType> = TableProps<RecordType>['onChange']

export interface IAntdTableResult<RecordType> {
  pagination: TablePaginationConfig
  handleTableChange: IAntdTableOnChange<RecordType>
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
const useAntdTable = <RecordType>({
  fetchFn,
  filterTypeLookup = {},
  orderDefault = '',
  shouldFetchOnMounted = true
}: IAntdTableProps): IAntdTableResult<RecordType> => {
  const [filterBy, setFilterBy] = React.useState('')
  const [orderBy, setOrderBy] = React.useState(orderDefault)
  const [paginationState, setPaginationState] = React.useState<PaginationProps>({ current: PAGE, pageSize: PAGE_SIZE })
  const upToDateStore = React.useRef({
    filterBy,
    orderBy,
    paginationState,
    fetchFn,
    filterTypeLookup
  })
  // make sure every re-render will update the ref value to the latest one
  upToDateStore.current = {
    filterBy,
    orderBy,
    paginationState,
    fetchFn,
    filterTypeLookup
  }

  const handleTableChange = React.useCallback<IAntdTableOnChange<RecordType>>((pagination, filters = {}, sorter) => {
    const { fetchFn, filterTypeLookup } = upToDateStore.current

    const filterParams = {}

    Object.entries(filters).forEach(([key, value]) => {
      const filterType = filterTypeLookup[key] || filterTypes.equal
      filterParams[key] = getFilterItem(key, value, filterType)
    })
    const filterBy = getFilterUrlParam(filterParams)
    const orderBy = formatSorter(sorter)
    const { offset, limit } = formatPagination(pagination)

    setFilterBy(filterBy)
    setOrderBy(orderBy)
    setPaginationState(pagination)

    fetchFn({
      filterBy,
      orderBy,
      offset,
      limit
    })
  }, [])

  React.useEffect(() => {
    if (shouldFetchOnMounted) {
      const { fetchFn, paginationState } = upToDateStore.current
      const { offset, limit } = formatPagination(paginationState)

      fetchFn({
        offset,
        limit
      })
    }
  }, [shouldFetchOnMounted])

  const refresh = React.useCallback((fromBeginning = true, targetPagination = {}) => {
    const { fetchFn, paginationState, filterBy, orderBy } = upToDateStore.current
    let newPagination = { ...paginationState, ...targetPagination }

    if (fromBeginning) {
      newPagination = {
        ...paginationState,
        current: 1
      }
    }

    setPaginationState(newPagination)

    const { offset, limit } = formatPagination(newPagination)

    fetchFn({
      filterBy,
      orderBy,
      offset,
      limit
    })
  }, [])

  return {
    pagination: paginationState,
    handleTableChange,
    refresh
  }
}

export default useAntdTable
