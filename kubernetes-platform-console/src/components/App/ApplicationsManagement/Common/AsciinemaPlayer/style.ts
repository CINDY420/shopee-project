import styled from 'styled-components'
import { Spin } from 'infrad'

export const StyledDiv = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export const StyledSpin = styled(Spin)`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
`

export const StyledPlayer = styled.div`
  width: 100%;
  height: 100%;

  .asciinema-player-wrapper,
  .asciinema-player {
    width: 100%;
    height: 100%;

    .asciinema-terminal {
      width: 100% !important;
      height: 100% !important;
    }
  }
`
