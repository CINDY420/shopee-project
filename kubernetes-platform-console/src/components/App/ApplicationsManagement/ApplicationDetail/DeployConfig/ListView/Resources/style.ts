import styled from 'styled-components'
import { Form } from 'infrad'

export const StyledModalForm = styled(Form)`
  .ant-form-horizontal .ant-form-item-control {
    flex: 0 1 auto;
  }

  .ant-form-item-explain,
  .ant-form-item-extra {
    min-height: unset;
  }
`

export const StyledFormItem = styled(Form.Item)`
  margin-bottom: 16px;
`

export const StyledExtraMessage = styled.span`
  color: #999999;
  font-size: 12px;
  line-height: 14px;
  margin-left: 16px;
`
