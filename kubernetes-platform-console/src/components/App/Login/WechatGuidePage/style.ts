import styled from 'styled-components'

import LogoImg from 'assets/k8s_logo.svg'
import { CenterWrapper } from 'common-styles/flexWrapper'

export const Content = styled.div`
  width: 100%;
`

export const Line = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`

export const Root = styled(CenterWrapper)`
  flex-direction: column;
`

export const Guide = styled.div`
  > .ant-typography {
    font-size: 18px;
  }
  > img {
    margin: 0 4px;
  }
`

export const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;

  > div {
    width: 36px;
    height: 36px;
    background-image: url(${LogoImg});
    background-repeat: no-repeat;
    background-size: contain;
    margin: 0 12px;
  }
  > h3 {
    margin: 0;
  }
`
