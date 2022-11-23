import styled from 'styled-components'
import { Col } from 'infrad'

export const Header = styled.div`
  height: 36px;
  border-bottom: 1px solid #f0f0f0;
  padding-left: 16px;
`

export const ScaleBehaviorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  width: 380px;
  /* margin-left: 64px;
  margin-top: 24px; */
`
export const StyledCol = styled(Col)`
  padding-left: 16px;
  height: 38px;
  line-height: 38px;
`

export const NotifyFailedWrapper = styled.span`
  color: rgba(0, 0, 0, 0.25);
`
