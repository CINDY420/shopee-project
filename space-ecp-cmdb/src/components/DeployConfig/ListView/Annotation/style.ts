import { AutoDisabledInput } from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import styled from 'styled-components'

export const StyledAutoDisabledInput = styled(AutoDisabledInput)<{ $isEditing: boolean }>`
  .ant-input {
    border-left: none;
    padding-left: 11px;
  }
  .ant-input:hover {
    border-color: #d9d9d9;
  }
  .ant-input:focus {
    border-color: #d9d9d9;
    box-shadow: none;
  }
  .ant-input-group-addon {
    padding: 0 0 0 11px;
    color: rgba(0, 0, 0, 0.45);
    background-color: ${(props) => (props.$isEditing ? 'unset' : '#F5F5F5')};
  }
`
