import styled from 'styled-components'
import { Button } from 'infrad'

import LogoImg from 'assets/shopee_logo.svg'

export const LoginWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    background-color: #fff;
    border-radius: 12px;
    padding: 56px;
    border: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

export const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 42px;

  > div {
    width: 36px;
    height: 36px;
    background-image: url(${LogoImg});
    background-repeat: no-repeat;
    background-size: contain;
    margin: 0 12px;
  }
  > h1 {
    margin: 0;
  }
`

export const LoginButton = styled(Button)`
  color: #3b91f7;
  height: 56px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 25px;
`
