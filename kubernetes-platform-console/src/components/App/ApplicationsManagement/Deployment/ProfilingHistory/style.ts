import styled from 'styled-components'
import { Button } from 'infrad'
import { Table } from 'common-styles/table'

export const Root = styled.div`
  padding: 24px;
  background-color: #ffffff;
`

export const Title = styled.div`
  color: #333333;
  font-size: 22px;
  font-weight: 500;
`

export const SearchWrapper = styled.div`
  margin: 24px 0;
`

export const styledButton: any = styled(Button)`
  display: block;
  padding: 0;
`

export const FailedReason = styled.div`
  color: #999999;
  font-size: 14px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const StyledTable = styled(Table)`
  .ant-table {
    z-index: 0;
  }
`
