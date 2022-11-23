import styled from 'styled-components'
import { Button, Form, Input } from 'infrad'

const { Item } = Form

export const Name = styled.div`
  width: 150px;
  font-weight: 500;
  word-break: break-word;
`

export const MetricsWrapper = styled.div`
  width: calc(100% + 32px);
  margin-left: -16px;

  > span {
    display: inline-block;
    width: 33%;
    text-align: center;
    font-weight: 600;
  }

  .unit {
    color: #999;
    font-size: 12px;
    font-weight: 400;
  }
`

export const StyledButton: any = styled(Button)`
  border: none;
  box-shadow: none;
  color: #1890ff;
  position: relative;
  font-size: 14px;
  padding: 0 2px;
`

export const ButtonWrap = styled.div`
  display: flex;
`

export const StyledFormItem = styled(Item)`
  margin-bottom: 0;
`

export const StyledInput = styled(Input)`
  input {
    min-width: 4em;
  }

  .ant-input-group-addon {
    background: transparent;
    font-size: 0.8em;
    padding: 0 0.5em;
  }
`
