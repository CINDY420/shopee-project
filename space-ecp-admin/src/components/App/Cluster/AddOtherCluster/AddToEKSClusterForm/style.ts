import { Form, Input } from 'infrad'
import styled from 'styled-components'

export const StyledForm = styled(Form)`
  overflow: auto;
`

export const ETCDWrapper = styled.div`
  padding: 24px;
  background: #fafafa;
  margin-bottom: 24px;
  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`

export const Title = styled.div`
  font-weight: 500;
  margin-bottom: 16px;
`

export const StyledTextArea = styled(Input.TextArea)`
  && {
    min-height: 200px;
  }
`
