import styled from 'styled-components'

interface IProps {
  background?: string
  size?: string
}

export const Cycle = styled.div<IProps>`
  display: inline-block;
  width: ${props => props.size || '8px'};
  height: ${props => props.size || '8px'};
  background: ${props => props.background || '#ebecf0'};
  border-radius: 50%;
`
