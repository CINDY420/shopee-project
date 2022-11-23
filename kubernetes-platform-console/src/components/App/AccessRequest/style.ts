import styled from 'styled-components'

import { CenterWrapper } from 'common-styles/flexWrapper'

import accessRequestImage from 'assets/access_request.png'

export const AccessRequestBackground = styled(CenterWrapper)`
  background-image: url(${accessRequestImage});
  background-repeat: no-repeat;
`

export const WelcomeWrapper = styled.div`
  background-color: #fff;
  width: 480px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  padding: 48px 24px;
`

export const TitleWrapper = styled.h1`
  color: #2673dd;
  font-size: 24px;
  display: flex;
  justify-content: center;
`
export const DescriptionWrapper = styled.div`
  margin-top: 8px;
  color: #333333;
  font-size: 14px;
  display: flex;
  justify-content: center;
  text-align: center;
`

export const ButtonWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: left;
  > div {
    margin: 0 20px 20px 20px;
  }
`

export const StyledSpan = styled.span`
  color: #2673dd;
`
