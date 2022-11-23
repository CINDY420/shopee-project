import styled from 'styled-components'
import { Select, Form } from 'infrad'

export const StyledSelect = styled(Select)`
  width: 240px !important;
`

interface IStyledFormItem {
  // unit: px
  height: number
}
export const StyledFormItem = styled(Form.Item)<IStyledFormItem>`
  margin-bottom: 0;
  height: ${(props) => props.height}px;
`
