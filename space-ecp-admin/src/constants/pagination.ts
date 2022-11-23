import { TablePaginationConfig } from 'infrad'

const DEFAULT_PAGE_SIZE_OPTIONS = ['10', '20', '50', '100']

export const DEFAULT_TABLE_PAGINATION: Pick<
  TablePaginationConfig,
  'pageSizeOptions' | 'showSizeChanger' | 'size' | 'showTotal'
> = {
  pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
  showSizeChanger: true,
  size: 'small',
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Items`,
}
