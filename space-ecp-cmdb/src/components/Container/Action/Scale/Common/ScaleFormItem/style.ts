import styled from 'styled-components'
import { Form } from 'infrad'

export const StyledFormItem = styled(Form.Item)`
  margin-top: 32px;

  .ant-form-item-control-input-content {
    float: left;
    display: flex;
  }

  &:last-child {
    margin-bottom: 8px;
  }
`

export const FormulContainer = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 345px);
`

export const StyledVersionDiv = styled.div`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 12px;
`
