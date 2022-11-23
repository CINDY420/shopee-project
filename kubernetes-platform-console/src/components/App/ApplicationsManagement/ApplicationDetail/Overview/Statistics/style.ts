import styled from 'styled-components'

interface IProps {
  count: number
}

export const Root = styled.div<IProps>`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: ${props => (props.count <= 6 ? 'space-around' : 'flex-start')};
`
