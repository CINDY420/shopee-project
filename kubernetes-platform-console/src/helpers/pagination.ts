import * as R from 'ramda'

import { getOrderUrlParam } from 'helpers/queryParams'
import { PAGE_SIZE, PAGE, ORDER } from 'constants/pagination'

/**
 * Get offset by page and pageSize.
 * @param page Page
 * @param pageSize Page size
 */
export const getOffset = (page: number = PAGE, pageSize: number = PAGE_SIZE) => {
  return page && pageSize ? (page - 1) * pageSize : 0
}

/**
 * Format the pagination and order params.
 * @param page Page
 * @param pageSize Page size
 * @param orderBy The key used to order
 * @param order ascend | descend
 */
export const formatPaginationOrderParams = (page: number, pageSize: number, orderBy: string, order: string) => {
  const offset = getOffset(page, pageSize)
  const limit = pageSize || PAGE_SIZE
  const newOrderBy = orderBy ? getOrderUrlParam(orderBy, order) : undefined
  return { offset, limit, orderBy: newOrderBy }
}

/**
 * Format offset and limit by pagination object.
 * @param pagination infrad Table pagination object
 */
export const formatPagination = (pagination: any) => {
  const { current: page = PAGE, pageSize: limit = PAGE_SIZE } = pagination

  const offset = getOffset(page, limit)

  return { offset, limit }
}

/**
 * Format orderBy param by sorter object.
 * @param sorter infrad Table sorter object
 */
export const formatSorter = (sorter: any) => {
  let orderBy

  if (!R.isEmpty(sorter)) {
    const { columnKey, field, order } = sorter
    const sorterKey = columnKey || field
    orderBy = getOrderUrlParam(sorterKey, order)
  }

  return orderBy
}

/**
 * Format orderBy param by sorter object from column name.
 * @param sorter infrad Table sorter object
 */
export const formatSorterFromName = (sorter: any) => {
  let orderBy

  if (!R.isEmpty(sorter)) {
    const { column, order } = sorter
    const { name } = column
    orderBy = getOrderUrlParam(name, order)
  }

  return orderBy
}

/**
 * Enhance column config to add sorter configuration.
 * @param columnConfig Origin column configuration
 * @param order Order variable
 * @param onClickHeadCell Head cell click event callback function with new order as param
 */
export const columnSorterEnhancer = (columnConfig: any, order: any, onClickHeadCell: (order: any) => void) => {
  return {
    ...columnConfig,
    sorter: true,
    sortOrder: order || ORDER.ASC,
    onHeaderCell: (column: { sortOrder: string }) => ({
      onClick: () => {
        const { sortOrder } = column

        if (sortOrder === ORDER.ASC) {
          onClickHeadCell(ORDER.DESC)
        } else {
          onClickHeadCell(ORDER.ASC)
        }
      }
    })
  }
}
