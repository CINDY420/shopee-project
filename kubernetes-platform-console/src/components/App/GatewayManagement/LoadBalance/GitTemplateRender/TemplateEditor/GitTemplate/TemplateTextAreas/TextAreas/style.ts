import styled from 'styled-components'
import { Input, Button, Tooltip } from 'infrad'

const { TextArea } = Input

export const Wrapper = styled.div`
  width: 100%;
`

export const Title = styled.div`
  font-size: 12px;
  color: #b7b7b7;
  margin-bottom: 8px;
`

export const Action = styled.div`
  margin: 16px 0;
  float: right;
  ::after {
    content: '';
    display: block;
  }
`

export const StyledTextArea = styled(TextArea)`
  resize: none;
  font-size: 14px;
  line-height: 16px;
  border: none;
  background: transparent;
`

export const StyledButton: any = styled(Button)`
  border: none;
  box-shadow: none;
  color: #1890ff;
  font-size: 14px;
  align-items: center;
  display: flex;
  background: transparent;
  padding: 0;
  :hover,
  :focus,
  :active {
    background: transparent;
  }
  &[disabled],
  &[disabled]:hover {
    background: transparent;
  }
`
export const StyledTooltip = styled(Tooltip)`
  .ant-tooltip-inner {
    color: black;
  }
`
