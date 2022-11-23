import { TablePaginationConfig } from 'infrad'

export const PAGE = 1
export const PAGE_SIZE = 10
export const ROWS_PER_PAGE_OPTIONS = ['10', '20', '50', '100']

export const TABLE_PAGINATION_OPTION = {
  pageSizeOptions: ROWS_PER_PAGE_OPTIONS,
  showSizeChanger: true,
  size: 'small' as const,
  showTotal: (total: number) => `Total: ${total}`,
}

export const DEFAULT_TABLE_PAGINATION: Pick<
  TablePaginationConfig,
  'pageSizeOptions' | 'showSizeChanger' | 'size' | 'showTotal'
> = {
  pageSizeOptions: ROWS_PER_PAGE_OPTIONS,
  showSizeChanger: true,
  size: 'small',
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Items`,
}
