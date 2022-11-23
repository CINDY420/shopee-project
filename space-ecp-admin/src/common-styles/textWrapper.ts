import styled from 'styled-components'
import { Tag } from 'infrad'

export const CapitalizeTag = styled(Tag)`
  text-transform: capitalize;
`

interface ICapitalizeStatusProps {
  pointColor?: string
}
export const CapitalizeStatus = styled.span<ICapitalizeStatusProps>`
  text-transform: capitalize;
  white-space: nowrap;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 8px;
    border-radius: 50%;
    background-color: ${(props) => props.pointColor || 'red'};
  }
`
