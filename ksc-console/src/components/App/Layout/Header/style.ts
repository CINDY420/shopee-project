import styled from 'styled-components'
import LogoImg from 'assets/shopee_logo.svg'
import { Button } from 'infrad'

export const HorizonCenterWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const HeaderWrapper = styled(HorizonCenterWrapper)`
  height: 100%;
  background-color: #272d37;
  color: rgba(255, 255, 255, 1);
  padding: 0 16px;
  justify-content: space-between;
`
export const TitleWrapper = styled(HorizonCenterWrapper)`
  flex-grow: 0;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 1);
`
interface IProps {
  size?: string
  color?: string
}

export const TitleIcon = styled.div`
  width: 32px;
  height: 32px;
  background-image: url(${LogoImg});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`
export const HorizontalDivider = styled.div<IProps>`
  display: inline-block;
  width: ${(props) => props.size || '8px'};
  height: 100%;
`

export const Title = styled.p`
  height: 32px;
  font-size: 20px;
  line-height: 32px;
  margin: 0;
`
export const LogoWrapper = styled.div`
  /* width:20px; */
`
export const ActionWrapper = styled.div`
  display: flex;
`
export const HubButton = styled(Button)`
  background-color: inherit;
  color: rgba(255, 255, 255, 0.5);

  :hover {
    background-color: inherit;
    border: 1px solid rgba(220, 220, 224, 1);
    color: rgba(255, 255, 255, 1);
  }
`
