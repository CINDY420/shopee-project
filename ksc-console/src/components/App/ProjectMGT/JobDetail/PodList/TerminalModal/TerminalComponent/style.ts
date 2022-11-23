import styled from 'styled-components'

export const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  box-sizing: content-box;
  overflow-x: hidden;

  .xterm .xterm-viewport {
    overflow-y: auto;
  }
  .xterm-viewport {
    width: 100% !important;
  }
`

export const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`
