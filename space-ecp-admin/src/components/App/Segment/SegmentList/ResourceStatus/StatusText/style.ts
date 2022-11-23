import styled, { css } from 'styled-components'

export const StyledWrapper = styled.div`
  margin-top: 4px;
`

export const StyledText = styled.div`
  ${(props: { color: string }) => css`
    color: ${props.color};
  `}
`
