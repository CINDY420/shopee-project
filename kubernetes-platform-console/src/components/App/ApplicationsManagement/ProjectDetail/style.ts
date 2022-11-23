import styled from 'styled-components'
import { Button } from 'infrad'

export const Root = styled.div`
  height: calc(100% - 8em);
  overflow: auto;
`

export const Operation: any = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 24px;
`

export const StyledButton: any = styled(Button)`
  padding: 0;
`
