import * as R from 'ramda'

import { getOrderUrlParam } from 'helpers/queryParams'
import { PAGE_SIZE, PAGE } from 'constants/pagination'

/**
 * Get offset by page and pageSize.
 * @param page Page
 * @param pageSize Page size
 */
export const getOffset = (page = PAGE, pageSize = PAGE_SIZE) =>
  page && pageSize ? (page - 1) * pageSize : 0

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
