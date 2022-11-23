import styled from 'styled-components'

interface IProps {
  size?: string
  color?: string
  backgroundColor?: string
}

export const HorizontalDivider = styled.div<IProps>`
  display: inline-block;
  width: ${(props) => props.size || '8px'};
  height: 100%;
`

export const VerticalDivider = styled.div<IProps>`
  width: 100%;
  height: ${(props) => props.size || '8px'};
  background-color: ${(props) => props.backgroundColor || 'unset'};
`

export const HorizontalLine = styled.div<IProps>`
  display: inline-block;
  height: 100%;
  border-left-color: ${(props) => props.color || '#E9E9E9'};
  border-left-width: ${(props) => props.size || '1px'};
  border-left-style: solid;
`

export const VerticalLine = styled.div<IProps>`
  width: 100%;
  border-bottom-color: ${(props) => props.color || '#E9E9E9'};
  border-bottom-width: ${(props) => props.size || '1px'};
  border-bottom-style: solid;
`
