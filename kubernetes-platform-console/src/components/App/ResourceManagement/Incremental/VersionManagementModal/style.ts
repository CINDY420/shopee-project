import { Table } from 'common-styles/table'
import { Button, Popconfirm } from 'infrad'
import styled from 'styled-components'

export const StyledTable = styled(Table)`
  .ant-table-expanded-row > .ant-table-cell {
    background: #fafafa;
    padding: 0;
  }
`

export const StyledButton: any = styled(Button)`
  font-weight: normal;
  padding: 0;
  margin-top: 24px;
  color: #2673dd;
`

export const Compaign = styled.div`
  color: #bfbfbf;
  font-weight: 400;
  font-size: 12px;
`

export const StyledPopconfirm = styled(Popconfirm)`
  .ant-popover-inner {
    width: 280px;
  }
`
