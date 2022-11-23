import styled from 'styled-components'

interface IWrapperProps {
  collapsed: boolean
  height: string
}

export const Wrapper = styled.div<IWrapperProps>`
  height: ${props => (props.collapsed ? props.height : 'auto')};
  transition: height 0.5s ease-out;
  overflow: hidden;
  button {
    padding-left: 0px;
  }
`

interface IPanelProps {
  collapsed: boolean
}

export const Panel = styled.div<IPanelProps>`
  height: ${props => (props.collapsed ? '65px' : 'auto')};
  transition: height 0.5s ease-out;
  overflow: hidden;
`
