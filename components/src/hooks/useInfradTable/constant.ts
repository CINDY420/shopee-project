import { TablePaginationConfig } from 'infrad'

export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

export const DEFAULT_TABLE_PAGINATION: Pick<
  TablePaginationConfig,
  'pageSizeOptions' | 'showSizeChanger' | 'size' | 'showTotal'
> = {
  pageSizeOptions: ROWS_PER_PAGE_OPTIONS,
  showSizeChanger: true,
  size: 'small',
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Items`,
}
