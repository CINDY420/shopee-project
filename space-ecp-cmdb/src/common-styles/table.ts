import styled from 'styled-components'
import { Table as AntdTable } from 'infrad'

export const Table = styled(AntdTable)`
  .ant-table-container {
    border: 1px solid #f0f0f0;
  }
  .ant-table-ping-left:not(.ant-table-has-fix-left) .ant-table-container::before,
  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: unset;
  }

  .ant-table-thead > tr > th {
    padding: 5px 15px;
    font-weight: 400;
    font-size: 12px;
    color: #999;
  }

  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    display: none;
  }

  .ant-table-tbody > tr .ant-table-wrapper:only-child .ant-table {
    margin: 0;

    .ant-table-tbody > tr:last-child > td {
      border-bottom: 1px solid #f0f0f0;
    }
  }

  .ant-table-tbody > tr > td {
    color: #333;
    padding: ${(props: { padding?: string }) => props.padding || '24px 16px'};
  }

  .ant-table-expanded-row > .ant-table-cell {
    background: #fff;
  }

  .ant-table-column-sorters {
    padding: 0;
  }

  .ant-table {
    position: relative;
    z-index: 1;
  }

  .ant-table-tbody > tr:not(.ant-table-row-level-0) {
    background: #fafafa;
  }
`
