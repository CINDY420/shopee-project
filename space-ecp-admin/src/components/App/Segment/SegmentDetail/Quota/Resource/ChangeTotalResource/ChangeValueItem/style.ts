import styled from 'styled-components'
import { Form } from 'infrad'

export const ResultText = styled.div`
  font-size: 12px;
  color: #00000073;
  padding: 0 11px;
  position: absolute;
  white-space: nowrap;
`

export const ErrorText = styled.div`
  font-size: 12px;
  color: #ff4d4f;
  position: absolute;
  white-space: nowrap;
`

export const UnitText = styled.span`
  color: #bfbfbf;
`

export const ValueText = styled.span`
  font-size: 16px;
  padding-right: 8px;
`

export const StyledFormItem = styled(Form.Item)`
  margin-bottom: 0;
`

export const EditableItem = styled.td`
  &&& {
    display: flex;
    gap: 8px;
    padding-bottom: 0;
  }
`

export const UnitWrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.45);
  margin-left: 4px;
`
