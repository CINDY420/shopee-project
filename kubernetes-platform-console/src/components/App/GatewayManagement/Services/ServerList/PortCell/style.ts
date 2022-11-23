import styled from 'styled-components'

import { HorizonCenterWrapper } from 'common-styles/flexWrapper'

export const MoreWrapper = styled(HorizonCenterWrapper)`
  cursor: pointer;

  span:first-child {
    color: #1890ff;
    font-size: 14px;
    line-height: 16px;
  }
`

export const PortItem = styled(HorizonCenterWrapper)`
  align-items: flex-start;
`
