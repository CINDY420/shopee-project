import styled from 'styled-components'
import { Col, Progress } from 'infrad'

interface IStyledSpan {
  fontSize?: number
}

export const StyledRoot = styled.div`
  padding: 24px;
  border: 1px solid #eeeeee;
  background: #fff;
`

export const StyledTitleCol = styled(Col)`
  font-size: 20px;
  font-weight: 500;
  color: #333333;
`

export const StyledStatusDiv = styled.div`
  position: relative;
  margin-right: 48px;
  &:before {
    content: '';
    position: absolute;
    left: -12px;
    top: calc(50% - 3px);
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => props.color || 'none'};
  }
  &:last-child {
    margin-right: 0;
    margin-left: 48px;
  }
  &:last-child:before {
    content: '';
    position: absolute;
    top: 50%;
    left: -48px;
    transform: translateY(-50%);
    width: 1px;
    height: 22px;
    border-radius: 1px;
    background: #f0f0f0;
  }
`

export const StyledSpan = styled.span<IStyledSpan>`
  font-size: ${(props) => props.fontSize || 12}px;
  margin: 0 4px;
`

export const StyledProgress = styled(Progress)`
  height: 16px;
  .ant-progress-inner,
  .ant-progress-success-bg,
  .ant-progress-bg {
    border-radius: 0 !important;
    height: 15px !important;
  }

  .ant-progress-inner {
    background-color: #d9f7be;
  }

  .ant-progress-bg {
    background-color: #ff4d4f;
  }
`
