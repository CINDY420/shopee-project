import styled from 'styled-components'
import { Typography, Card, Progress, Button, Tag } from 'infrad'

import { primary } from 'constants/colors'

export const StatusWrapper: any = styled.div`
  display: flex;
  align-items: center;

  span {
    color: ${props => props.color};
    font-size: 16px;
  }
`

export const PodListWrapper = styled(Card)`
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  overflow: auto;
`

interface ITitleProps {
  size?: string
  fontWeight?: number
}

export const Title = styled.div<ITitleProps>`
  color: #333;
  font-size: ${props => props.size || '14px'};
  font-weight: ${props => props.fontWeight || 400};
`

export const Text = styled(Typography.Text)`
  font-size: 12px;
`

export const IPText = styled(Typography.Text)`
  display: block;
  cursor: pointer;

  .ant-typography {
    margin-bottom: 0;
    display: inline-block;
  }

  .anticon-copy {
    opacity: 0;
    margin-left: 0.2em;
    transition: 0.5s;
    color: ${primary};
  }

  &:hover .anticon-copy {
    opacity: 1;
  }
`

export const StyledProgress = styled(Progress)`
  .ant-progress-bg {
    background-color: ${primary} !important;
  }

  .ant-progress-text {
    color: rgba(0, 0, 0, 0.45) !important;
  }
`

export const StyledButton = styled(Button)`
  padding: 0;
`
export const StyledTag = styled(Tag)`
  margin: 4px 0;
  display: inline-block;
`
