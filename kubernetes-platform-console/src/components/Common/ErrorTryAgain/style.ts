import styled from 'styled-components'
import { Button } from 'infrad'

export const Root = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1em 0;
`

export const Text = styled.div`
  flex: auto;
  margin-right: 1em;
`

export const StyledButton: any = styled(Button)`
  width: 8em;
`
