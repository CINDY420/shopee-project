import * as React from 'react'
import styled from 'styled-components'
import { Spin } from 'infrad'

export const StyledSpin = styled(Spin)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Loading = (DecoratedComponent: React.ComponentType, loading: boolean | undefined): React.ComponentType => {
  return loading || loading === undefined ? () => <StyledSpin spinning /> : DecoratedComponent
}

export default Loading
