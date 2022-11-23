import styled from 'styled-components'
import { Collapse } from 'infrad'
import { Table } from 'src/common-styles/table'

export const SDUCollapse = styled(Collapse)`
  .ant-collapse-header {
    font-weight: 500;
    border-bottom: 1px solid #eeeeee;
  }

  .ant-collapse-ghost > .ant-collapse-item > .ant-collapse-content {
    background: #fafafa;
    border-bottom: 1px solid #d8d8d8;
  }

  .ant-collapse-content > .ant-collapse-content-box {
    padding: 24px 40px !important;
    border-bottom: 1px solid #d8d8d8;
    background: #fafafa;
  }
`

export const CollapseTale = styled(Table)`
  .ant-table-container {
    border: 1px solid #d8d8d8;
  }

  .ant-table-thead > tr > th {
    color: #8c8c8c;
    background: #f6f6f6;
    border-bottom: 1px solid #d8d8d8;

    &:not(:last-child) {
      border-right: 1px solid #eeeeee;
    }
  }

  .ant-table.ant-table-small .ant-table-thead > tr > th,
  .ant-table.ant-table-small .ant-table-tbody > tr > td {
    padding-left: 16px;
  }

  .ant-table-tbody > tr > td {
    &:not(:last-child) {
      border-right: 1px solid #eeeeee;
    }
  }

  .ant-table-tbody > tr:not(.ant-table-row-level-0) {
    background: #ffffff;
  }
`
