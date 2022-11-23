import styled from 'styled-components'
import { Table } from 'infrad'

export const StyledTable: typeof Table = styled(Table)`
  .ant-table,
  .ant-table-summary {
    background-color: transparent;
  }

  .ant-table table {
    border-spacing: 8px 0;
  }

  .ant-table-placeholder {
    display: none;
  }

  .ant-table-thead > tr > th {
    background-color: transparent !important;
    color: inherit;
    font: inherit;
    padding: 11px 0;
    border: none;
  }

  .ant-table-thead > tr > th:last-child {
    width: 32px;
  }

  .ant-table-tbody > tr > td {
    padding: 0;
    border: none;
  }

  .ant-table-summary > tr > td {
    padding: 0 0 16px 0;
    border: none;
  }

  .ant-table-cell::before {
    display: none;
  }
`
