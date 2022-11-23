import styled from 'styled-components'
import { Input, Button } from 'infrad'

export const StyledInput = styled(Input)`
  width: 320px;
  height: 32px;
`
interface IStyledButtonProps {
  width?: string
}

export const StyledButton = styled(Button)<IStyledButtonProps>`
  padding: 0;
  width: ${(props: IStyledButtonProps) => props.width};
`
