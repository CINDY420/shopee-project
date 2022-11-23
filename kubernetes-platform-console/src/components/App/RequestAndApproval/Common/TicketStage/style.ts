import styled from 'styled-components'

export const TextWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const Circle = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-right: 5px;
  background-color: ${(props: any) => props.color};
`

export const StyledDiv = styled.div`
  min-width: 90px;
`
