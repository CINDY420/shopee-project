import styled from 'styled-components'
import { Form, Button, Input } from 'infrad'

export const StyledItem = styled(Form.Item)`
  margin-bottom: 0;
`

export const StyledSpan = styled.span`
  color: #999999;
`

export const StyledTable = styled.table`
  border: 1px solid rgba(153, 153, 153, 0.3);
`

export const StyledHead = styled.thead`
  background-color: #f6f6f6;
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
  font-size: 14px;
  color: #666666;
  height: 36px;
`

export const StyledTbody = styled.tbody`
  & tr:not(:last-child) {
    border-bottom: 1px solid rgba(200, 200, 200, 0.3);
  }
`

export const StyledTr = styled.tr`
  height: 64px;
`

export const ButtonWrapper = styled.div`
  margin-top: 24px;
`

export const StyledButton: any = styled(Button)`
  width: 240px;
`

export const StyledInput: any = styled(Input)`
  width: 240px;
`

export const ErrorInfo = styled.div`
  color: #ff4742;
  height: 24px;
`

export const StyledTdKey = styled.td`
  width: 160px;
  font-size: 14px;
  color: #666666;
  font-weight: 500;
  text-align: right;
`

export const StyledTdValue = styled.td`
  font-size: 14px;
  color: #666666;
  font-weight: normal;
`

export const StyledTdValueText = styled.div`
  padding-left: 16px;
`
