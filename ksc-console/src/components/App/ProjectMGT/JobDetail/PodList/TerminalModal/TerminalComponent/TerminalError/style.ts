import styled from 'styled-components'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8em;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 1000;
  background: #ffffff;
`

export const ErrorText = styled.span`
  margin: 1em 0 1.5em;
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
`
