import { Checkbox } from 'antd'
import styled from 'styled-components'

export const StyledCheckBox: any = styled(Checkbox)`
  & + & {
    margin-left: 0 !important;
  }
`
