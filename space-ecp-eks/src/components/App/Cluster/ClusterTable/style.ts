import styled from 'styled-components'
import { Card, Badge } from 'infrad'
import { Table } from 'src/common-styles/table'

export const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const BorderedLink = styled.a`
  display: inline-block;
  line-height: 32px;
  text-align: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
`
export const StyledCard = styled(Card)`
  margin: 24px;
  overflow: auto;
`
export const StyledTable = styled(Table)`
  span.ant-dropdown-menu-title-content {
    white-space: nowrap;
  }
`
export const StyledBadge = styled(Badge)`
  white-space: nowrap;
`
