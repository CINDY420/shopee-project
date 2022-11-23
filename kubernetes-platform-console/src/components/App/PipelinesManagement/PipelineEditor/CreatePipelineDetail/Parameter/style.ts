import styled from 'styled-components'
import { Form, Typography, Input, Select } from 'infrad'

export const StyledInput: any = styled(Input)`
  :disabled {
    background-color: #ffffff;
    color: #333333;
  }
`
export const StyledSelect: any = styled(Select)`
  .ant-select-selector {
    background-color: #ffffff !important;
    color: #333333 !important;
  }
`

export const StyledForm: any = styled(Form)`
  width: 100%;
  .ant-form-item-label label {
    font-size: 16px;
    /* font-weight: 500; */
  }

  .ant-form-item-extra {
    font-size: 12px;
  }

  .none-resize {
    resize: none;
  }

  .ant-form-item {
    margin-bottom: 32px;
    margin-right: 32px;
  }
  .ant-btn-icon-only {
    border-radius: 50%;
  }
`
const { Title } = Typography

export const StyledTitle = styled(Title)`
  margin-bottom: 24px !important;
  font-size: 22px !important;
`

export const ParametersWrapper = styled('div')`
  border-bottom: 1px solid #e5e5e5;
  border-top: 1px solid #e5e5e5;
  padding-top: 32px;
  padding-bottom: 32px;
  margin-bottom: 32px;
`
