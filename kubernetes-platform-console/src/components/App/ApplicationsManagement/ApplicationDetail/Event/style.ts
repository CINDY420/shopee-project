import styled from 'styled-components'

import { DatePicker } from 'infrad'

const { RangePicker } = DatePicker

export const Root = styled.div`
  padding: 24px;
  background-color: #ffffff;
`

export const StyledRangePicker = styled(RangePicker)`
  margin-left: 24px;
`
