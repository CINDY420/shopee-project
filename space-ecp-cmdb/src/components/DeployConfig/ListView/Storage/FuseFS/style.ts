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

export const StyledAutoDisabledInput = styled(AutoDisabledInput)<{ $isEditing: boolean }>`
  .ant-input-wrapper {
    display: flex;
    overflow: hidden;
  }
  .ant-input-affix-wrapper {
    border-left: none;
    padding-left: 8px;
    border-color: #d9d9d9 !important;
    box-shadow: none;
  }
  .ant-input-group-addon {
    max-width: 200px;
    width: auto;
    padding: 4px 0 4px 11px;
    color: rgba(0, 0, 0, 0.45);
    background-color: ${(props) => (props.$isEditing ? 'unset' : '#F5F5F5')};
  }
`

export const StyledExtraMessage = styled.span`
  color: #999999;
  font-size: 12px;
  line-height: 14px;
  margin-left: 16px;
`
