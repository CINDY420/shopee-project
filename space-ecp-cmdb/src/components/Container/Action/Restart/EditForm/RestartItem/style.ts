import styled from 'styled-components'
import { Checkbox } from 'infrad'
const CheckboxGroup = Checkbox.Group

export const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox {
    top: -0.2em;
  }
`

export const StyledCheckboxGroup = styled(CheckboxGroup)`
  margin-top: 4px;
  margin-left: 24px;
  display: flex;
  flex-direction: column;

  label.ant-checkbox-wrapper.ant-checkbox-wrapper-in-form-item.ant-checkbox-group-item {
    margin-top: 6px;
  }
`
