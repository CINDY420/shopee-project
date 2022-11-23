import styled from 'styled-components'

import { CheckCircleFilled } from 'infra-design-icons'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const StyledIcon = styled(CheckCircleFilled)`
  color: #55cc77;
  font-size: 48px;
`

export const StyledTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-top: 24px;
  margin-bottom: 8px;
  color: #333333;
`

export const Content = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: #999999;
  width: 100%;
  word-break: break-all;
`

export const Name = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #666666;
`

export const ButtonContainer = styled.div`
  margin-top: 24px;

  & > :first-child {
    margin-right: 16px;
  }
`
