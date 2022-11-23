export const PAGE = 1
export const PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100
export const ROWS_PER_PAGE_OPTIONS = ['10', '20', '50', '100']

export enum PAGINATION_SIZE {
  SMALL = 'small',
  DEFAULT = 'default'
}

export const TABLE_PAGINATION_OPTION = {
  pageSizeOptions: ROWS_PER_PAGE_OPTIONS,
  showSizeChanger: true,
  size: PAGINATION_SIZE.SMALL,
  showTotal: (total: number, range: [number, number]) => `Total: ${total}`
}

export const ORDER = {
  ASC: 'ascend',
  DESC: 'descend'
}

export const PAGINATION_ACTION_TYPE = {
  NEXT_PAGE: 'NEXT_PAGE',
  PREVIOUS_PAGE: 'PREVIOUS_PAGE',
  UPDATE_DATA: 'UPDATE_DATA'
}
