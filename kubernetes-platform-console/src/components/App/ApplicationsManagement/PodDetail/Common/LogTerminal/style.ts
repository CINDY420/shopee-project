import styled from 'styled-components'

export const Root = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`

export const Content = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: content-box;

  .xterm .xterm-viewport {
    overflow-y: auto;
  }
`
