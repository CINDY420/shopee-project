import styled from 'styled-components'
import { Table } from 'infrad'

export const StyledTable = styled(Table)`
  .ant-table-small .ant-table-thead > tr > th,
  .ant-table-thead > tr > th {
    background: #f6f6f6;
    font-weight: 400;
  }

  .ant-table-tbody > tr > td {
    box-sizing: content-box;
    vertical-align: top;
  }

  .ant-table-tbody > tr {
    td:first-child,
    td:last-child {
      padding: 16px;
    }
  }

  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    display: none;
  }

  .ant-table.ant-table-small .ant-table-title,
  .ant-table.ant-table-small .ant-table-footer,
  .ant-table.ant-table-small .ant-table-thead > tr > th,
  .ant-table.ant-table-small .ant-table-tbody > tr > td,
  .ant-table.ant-table-small tfoot > tr > th,
  .ant-table.ant-table-small tfoot > tr > td {
    padding: 8px 0 8px 8px;
  }

  .ant-table-tbody > tr:hover:not(.ant-table-expand-row) > td,
  .ant-table-body .ant-table-row-hover,
  .ant-table-body .ant-table-row-hover > td {
    background: transparent !important;
  }

  .ant-form-item {
    margin-bottom: 0;
  }
`

export const CountTableAzWrapper = styled.div`
  margin-right: 16px;
`
