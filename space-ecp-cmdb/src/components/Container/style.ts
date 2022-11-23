import styled from 'styled-components'

interface IStyledContainerProps {
  padding?: string
}

export const StyledContainer = styled.div<IStyledContainerProps>`
  background: #fff;
  margin-bottom: 10px;
  padding: ${(props) => props.padding ?? '10px'};
`
