import styled from 'styled-components'
import { Button } from 'infrad'
import DatePicker from 'components/Common/DatePicker'

const { RangePicker } = DatePicker
export const StyledDatePicker = styled(RangePicker)`
  margin: 8px 0 24px;
`
export const StyledButton = styled(Button)`
  &:first-child {
    padding-left: 0;
  }
`
