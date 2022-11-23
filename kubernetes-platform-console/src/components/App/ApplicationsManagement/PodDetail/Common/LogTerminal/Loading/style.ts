import styled from 'styled-components'

import ContainerLogin from 'assets/container_login.svg'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8em;
  width: 100%;
  height: 100%;
  background-color: #000000;
  position: absolute;
  top: 0;
  z-index: 1000;
`

export const LoadingImage = styled.div`
  width: 15em;
  height: 15em;
  background-image: url(${ContainerLogin});
  background-repeat: no-repeat;
`

export const LoadingText = styled.span`
  position: relative;
  top: -2.5em;
  font-size: 1.5em;
  color: #00b9c8;
`
