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

export const StyledContainer = styled.div`
  background: #fafafa;
  padding: 12px 16px;
`
