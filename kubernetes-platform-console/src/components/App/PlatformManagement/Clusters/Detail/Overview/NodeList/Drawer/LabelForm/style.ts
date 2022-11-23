import styled from 'styled-components'
import { Form, Button } from 'infrad'

export const StyledButton: any = styled(Button)`
  width: 100%;
  color: #2673dd;
  border-color: #2673dd;
`

export const StyledLabel: any = styled.label`
  font-size: 16px !important;
  font-weight: 500;
  display: inline-block;
  padding: 0 0 8px;
  line-height: 1.5715;
  color: #000000d9;
`

export const StyledForm: any = styled(Form)`
  .formGroup {
    background: #f6f6f6;
    padding: 16px;
    padding-bottom: 0px;
    position: relative;

    .ant-form-item {
      margin-bottom: 16px;
    }

    .ant-form-item-label {
      width: 40px;
      margin-right: 16px;
    }

    label::after {
      display: none;
    }

    input {
      width: 320px;
    }

    .deleteBtn {
      position: absolute;
      top: 25px;
      left: 400px;
    }
  }
`
