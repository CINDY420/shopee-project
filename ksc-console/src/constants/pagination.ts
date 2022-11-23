export const PAGE = 1
export const PAGE_SIZE = 10
export const ROWS_PER_PAGE_OPTIONS = ['10', '20', '50', '100']

export const ORDER = {
  ASC: 'ascend',
  DESC: 'descend',
}

export const TABLE_PAGINATION_OPTION = {
  pageSizeOptions: ROWS_PER_PAGE_OPTIONS,
  showSizeChanger: true,
  size: 'small' as const,
  showTotal: (total: number) => `Total: ${total}`,
}
