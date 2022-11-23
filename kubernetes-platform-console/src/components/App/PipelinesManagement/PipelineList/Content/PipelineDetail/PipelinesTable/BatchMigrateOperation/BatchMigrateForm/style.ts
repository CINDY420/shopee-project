import styled from 'styled-components'
import { Form } from 'infrad'

export const StyledForm = styled(Form)`
  flex: 1;
  height: 100%;

  .ant-form-item {
    margin: 0;
    margin-top: 24px;
  }

  label {
    margin-right: 16px;

    &::after {
      display: none;
    }
  }
`
