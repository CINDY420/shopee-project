import styled from 'styled-components'
import { Input, Form, Select, Col, InputNumber } from 'infrad'

const { Item } = Form

export const StyledFormItem = styled(Item)`
  align-items: center;
  margin-bottom: 16px;
  .ant-input[disabled] {
    all: unset;
  }
  .ant-input-number-disabled .ant-input-number-input {
    background-color: unset;
  }
`

export const StyledInput = styled(Input)`
  border: ${props => (props.disabled ? '0' : '1px solid #d8d8d8')};
  text-align: ${props => (props.disabled ? 'right' : 'left')};
  width: 100px;
`
export const StyledInputNumber = styled(InputNumber)`
  border: ${props => (props.disabled ? '0' : '1px solid #d8d8d8')};
  text-align: ${props => (props.disabled ? 'right' : 'left')};
  width: 100px;
  background-color: ${props => (props.disabled ? 'unset' : null)};
  color: #333333;
`

export const StyledSelect = styled(Select)`
  width: 100px !important;
`

export const StyledTitle = styled(Col)`
  color: #8c8c8c;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 16px;
`
