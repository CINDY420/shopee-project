import styled from 'styled-components'

import { HorizonCenterWrapper } from 'common-styles/flexWrapper'
import { Button } from 'infrad'

export const ServerListWrapper = styled.div`
  position: relative;
  height: calc(100% - 118px);
  background: #fff;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
`

export const HeaderWrapper = styled(HorizonCenterWrapper)`
  justify-content: space-between;
  overflow: hidden;
`

export const LeftWrapper = styled(HorizonCenterWrapper)`
  justify-content: space-between;
`

export const RightWrapper = styled(HorizonCenterWrapper)`
  justify-content: space-between;
`

export const EndpointsWrapper = styled(HorizonCenterWrapper)`
  justify-content: space-between;
`

export const ClusterLabel = styled.label`
  color: #333333;
  font-size: 14px;
  line-height: 16px;
`

export const ClusterSelectWrapper = styled.div`
  width: 480px;
`

export const SearchWrapper = styled.div`
  width: 480px;
`

interface IFont {
  weight?: number
  size?: number
  lineHeight?: number
}

export const Title = styled.p<IFont>`
  color: #333333;
  font-size: ${props => (props.size ? `${props.size}px` : '16px')};
  font-weight: ${props => props.weight || 'normal'};
  line-height: ${props => (props.lineHeight ? `${props.lineHeight}px` : '20px')};
  margin: 0;
  white-space: pre-wrap;
`

export const Text = styled.p<IFont>`
  color: #888888;
  font-size: ${props => (props.size ? `${props.size}px` : '12px')};
  font-weight: ${props => props.weight || 'normal'};
  line-height: ${props => (props.lineHeight ? `${props.lineHeight}px` : '14px')};
  margin: 0;
  white-space: pre-wrap;
`

export const StyledButton: any = styled(Button)`
  padding: 0;
`
