import styled from 'styled-components'
import { Form } from 'infrad'

const { Item } = Form

export const StyledItem = styled(Item)`
  display: block;

  label {
    width: 100%;
    display: inline-block;
    white-space: normal;
    height: auto;
    padding-bottom: 8px;
    color: #333;
    font-size: 14px;
    line-height: 1;
  }
`

export const StyledContainerItem = styled(Item)`
  & > .ant-form-item-control {
    padding: 24px;
    padding-bottom: 0;
    background: #f6f6f6;
  }
`
