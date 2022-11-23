import { InputNumber, Radio, Switch } from 'infrad'
import withAutoDisable from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled/withAutoDisabled'
import {
  StyledSelect,
  StyledInput,
} from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled/style'

export const AutoDisabledInput = withAutoDisable(StyledInput)
export const AutoDisabledPassword = withAutoDisable(StyledInput.Password)
export const AutoDisabledTextarea = withAutoDisable(StyledInput.TextArea)
export const AutoDisabledInputNumber = withAutoDisable(InputNumber)
export const AutoDisabledRadioGroup = withAutoDisable(Radio.Group)
export const AutoDisabledSwitch = withAutoDisable(Switch)
export const AutoDisabledSelect = withAutoDisable(StyledSelect)
