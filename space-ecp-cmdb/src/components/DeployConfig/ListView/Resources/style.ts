import styled from 'styled-components'
import { Form, Input } from 'infrad'
import { AutoDisabledInput } from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'

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
  margin-bottom: 24px !important;
`

export const StyledInput = styled(Input)`
  margin-left: -10px;
`

export const StyledExtraMessage = styled.span`
  color: #999999;
  font-size: 12px;
  line-height: 14px;
  margin-left: 16px;
`

export const StyledAutoDisabledInput = styled(AutoDisabledInput).attrs(
  (props: { $isEditing: boolean }) => props,
)`
  .ant-input-group-addon {
    background-color: ${(props) => (props.$isEditing ? 'unset' : '#f5f5f5')};
  }
`
