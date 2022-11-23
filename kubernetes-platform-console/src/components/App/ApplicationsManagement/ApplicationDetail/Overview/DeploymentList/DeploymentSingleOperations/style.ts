import styled from 'styled-components'
import { Form } from 'infrad'

const { Item } = Form

interface IProps {
  width?: string
  margin?: string
}

export const InlineFormItem = styled(Item)<IProps>`
  display: inline-block;
  width: ${props => (props.width ? props.width : '120px')};
  margin: ${props => (props.margin ? props.margin : '0 0 32px 0')};
  .ant-form-item-control-input-content {
    display: flex;
    align-items: flex-start;
  }
`

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
`

export const DrawerNoticeWrapper = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: #666666;
  line-height: 18px;
`
