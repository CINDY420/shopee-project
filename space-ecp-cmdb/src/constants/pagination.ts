export const PAGE = 1
export const PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100
export const ROWS_PER_PAGE_OPTIONS = ['10', '20', '50', '100']

export enum PaginationSize {
  SMALL = 'small',
  DEFAULT = 'default',
}

export const TABLE_PAGINATION_OPTION = {
  pageSizeOptions: ROWS_PER_PAGE_OPTIONS,
  showSizeChanger: true,
  size: PaginationSize.SMALL,
  showTotal: (total: number, range: number[]) => `${range[0]}-${range[1]} of ${total} items`,
}
