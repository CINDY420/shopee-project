import styled from 'styled-components'
import { Table } from 'common-styles/table'
import { Input } from 'infrad'

export const StyledTable = styled(Table)`
  margin: 24px;
`
export const StyledInput = styled(Input)`
  width: 90px;
  margin-left: 8px;
  &.ant-input-affix-wrapper-disabled {
    background: inherit;
    cursor: text;
    border: none;
  }
  .ant-input-suffix {
    color: #999999;
  }
  .ant-input[disabled] {
    color: #333333;
    cursor: text;
  }
`
