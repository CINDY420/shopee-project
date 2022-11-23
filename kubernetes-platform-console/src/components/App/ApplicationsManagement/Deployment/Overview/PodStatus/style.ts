import styled from 'styled-components'
import { Divider } from 'infrad'

import { HorizonCenterWrapper } from 'common-styles/flexWrapper'
import { CommonCard } from '../../style'

export const OverviewWrapper = styled(CommonCard)`
  color: #333333;
`

const Title = styled.p`
  font-size: 22px;
  line-height: 24px;
  margin: 0;
`

export const OverviewTitle = styled(Title)`
  font-size: 22px !important;
  font-weight: 600 !important;
`

export const BarWrapper = styled.div``

export const Bars = styled(HorizonCenterWrapper)``

interface IBarItemProps {
  width?: string
  height?: string
  backgroundColor?: string
}

export const BarItem = styled.div<IBarItemProps>`
  width: ${props => props.width || '0%'};
  height: ${props => props.height || '16px'};
  background: ${props => props.backgroundColor || 'inherit'};
  color: #fff;
  font-size: 12px;
  line-height: ${props => props.height || '16px'};
  text-indent: 4px;
  min-width: 32px;
  /* padding-left: 4px; */
`

export const LineWrapper = styled(HorizonCenterWrapper)`
  height: 16px;
`

interface ILineItemProps {
  width?: string
}

export const LineItem = styled(HorizonCenterWrapper)<ILineItemProps>`
  position: relative;
  width: ${props => props.width || '0%'};
  height: 100%;
  min-width: 32px;
`

export const LineText = styled(HorizonCenterWrapper)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999999;
  font-size: 14px;
  line-height: 16px;
  background: #fff;
  padding: 0 8px;
`

export const CustomDivider = styled(Divider)`
  flex-grow: 1;
  margin: 4px 0 16px !important;
`

export const LabelWrapper = styled(HorizonCenterWrapper)``

export const AbnormalLabel = styled(HorizonCenterWrapper)`
  flex-grow: 1;
`

export const NormalLabel = styled(HorizonCenterWrapper)``

export const Label = styled.label`
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
`

export const LableItem = styled(HorizonCenterWrapper)``

export const Status = styled.span`
  font-size: 14px;
  line-height: 16px;
`

export const Number = styled.span`
  color: #151515;
  font-size: 22px;
  line-height: 24px;
  font-weight: 600;
`
