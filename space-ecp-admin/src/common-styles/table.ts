import styled from 'styled-components'
import { Table as AntdTable } from 'infrad'

export const Table: typeof AntdTable = styled(AntdTable)`
  background-color: #ffffff;

  .ant-table-container {
    border: 1px solid #f0f0f0;
    overflow-x: auto;
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
    padding: 24px 16px;
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

  .ant-table-filter-dropdown .ant-dropdown-menu {
    max-width: 600px;
    max-height: 190px;
    overflow-x: auto;
  }
`
