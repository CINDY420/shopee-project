import styled from 'styled-components'
import { Input } from 'infrad'

export const StyledResource = styled.div`
  display: flex;
`

export const StyledInput = styled(Input)`
  width: 165px;
  margin-left: 8px;
  &:first-child {
    margin-left: 0;
  }
  .ant-input-affix-wrapper-disabled {
    background: #ffffff;
    cursor: text;
  }
  .ant-input-suffix {
    color: #999999;
  }
  .ant-input[disabled] {
    color: #333333;
    cursor: text;
  }
`
