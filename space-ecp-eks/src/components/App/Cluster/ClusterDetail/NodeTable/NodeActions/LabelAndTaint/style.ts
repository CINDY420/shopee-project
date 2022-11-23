import styled from 'styled-components'
import { Table as AntdTable } from 'infrad'
import { Table } from 'src/common-styles/table'

export const StyleTableCellTitle = styled.div`
  &::before {
    content: '*';
    color: red;
  }
`

export const StyledTitle = styled.div`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
`

export const StyledOperateTable = styled(AntdTable)`
  .equalCol {
    padding: 0;
    text-align: center;
  }
  .ant-table-container {
    border: 0;
  }

  tbody > tr > td {
    padding: 0 16px;

    button {
      margin-top: 12px;
      margin-bottom: 12px;
    }
  }

  tbody > tr {
    td {
      vertical-align: top;
    }
    &:last-child > td {
      border-bottom: 0;
    }
  }

  .ant-table-thead > tr > th {
    padding: 6px 16px;

    &::before {
      display: none;
    }
  }

  .ant-table-summary > tr > td {
    border-bottom: 0;
  }

  .ant-form-item {
    margin: 12px 0;
  }
`

export const StyledNodeTable = styled(Table)`
  .ant-table-container {
    border: 0;
  }
  .ant-table-tbody > tr > td {
    padding: 16px;
  }
`

export const FormHelpMessage = styled.div`
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
  margin-top: -10px;
`
