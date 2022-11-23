import { Button } from 'infrad'
import styled from 'styled-components'

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`

export const StyledButton = styled(Button)`
  margin-right: 16px;
  svg { 
    display: inline-block
    vertical-align: baseline
  }
`
