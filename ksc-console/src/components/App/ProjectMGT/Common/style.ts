import styled from 'styled-components'
import { ButtonProps } from 'infrad/lib/button'

interface IStyledButtonProps extends ButtonProps {
  color: string
  backgroundcolor: string
  bordercolor: string
}

export const StyledStatusButton = styled.div`
  width: 80px;
  padding: 5px;
  font-size: 12px;
  text-align: center;
  color: ${(props: IStyledButtonProps) => props.color || '#000000'};
  background: ${(props: IStyledButtonProps) => props.backgroundcolor || '#ffffff'};
  border: ${(props: IStyledButtonProps) =>
    props.bordercolor ? `1px solid ${props.bordercolor}` : 'none'};
`
