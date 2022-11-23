import styled from 'styled-components'
import { Checkbox } from 'infrad'

export const StyledCheckboxGroup = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;
  background: #fafafa;
  padding: 16px 40px;

  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0;
  }
`
