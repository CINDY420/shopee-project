import styled from 'styled-components'
import { Table as AntdTable, Input, DatePicker } from 'infrad'

const { RangePicker } = DatePicker

export const Table: any = styled(AntdTable)`
  .ant-table-container {
    border: 1px solid #f0f0f0;
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
    padding: ${(props: any) => props.padding || '24px 16px'};
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
`

export const IPAddress = styled.div`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
`

export const IPLabel = styled.span`
  color: #b7b7b7;
`

export const StyledInput = styled(Input)`
  width: 480px;
`

export const StyledRangePicker = styled(RangePicker)`
  margin-left: 24px;
`

export const Header = styled.div`
  display: flex;
  margin-bottom: 24px;
`
