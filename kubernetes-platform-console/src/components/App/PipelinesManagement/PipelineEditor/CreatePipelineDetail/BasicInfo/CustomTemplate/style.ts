import styled from 'styled-components'
import { Form } from 'infrad'

export const StyledForm: any = styled(Form)`
  padding-bottom: 32px;
  margin-bottom: 32px;

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
  }
`
