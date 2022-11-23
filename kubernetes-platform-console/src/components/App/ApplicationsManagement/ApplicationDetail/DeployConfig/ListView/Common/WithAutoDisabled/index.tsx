import { InputNumber, Radio, Switch } from 'infrad'
import withAutoDisable from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled/withAutoDisable'
import {
  StyledSelect,
  StyledInput
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled/style'

export const AutoDisabledInput = withAutoDisable(StyledInput)
export const AutoDisabledInputNumber = withAutoDisable(InputNumber)
export const AutoDisabledRadioGroup = withAutoDisable(Radio.Group)
export const AutoDisabledSwitch = withAutoDisable(Switch)
export const AutoDisabledSelect = withAutoDisable(StyledSelect)
