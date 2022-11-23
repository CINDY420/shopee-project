import styled from 'styled-components'
import { Form, Divider } from 'infrad'

export const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 0;
  }
`

export const StyledTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 14px;
`

export const StyledLabelFilterControl = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledResetButton = styled.div`
  color: rgba(0, 0, 0, 0.25);
  line-height: 32px;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`

export const StyledDivider = styled(Divider)`
  margin: 16px 0 8px -24px;
  width: calc(100% + 48px);
`
