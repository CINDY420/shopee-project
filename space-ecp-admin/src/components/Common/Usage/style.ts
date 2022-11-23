import { Card, Progress, Tag } from 'infrad'
import styled, { css } from 'styled-components'

export const StyledProgress: any = styled(Progress)`
  .ant-progress-inner,
  .ant-progress-success-bg,
  .ant-progress-bg {
    border-radius: 0 !important;
    height: 15px !important;
  }
`

export const StyledCard = styled(Card)`
  flex-grow: 1;
`

export const Cricle = styled.span`
  width: 12px;
  height: 12px;
  display: inline-block;
  border-radius: 50%;
  margin-top: 4px;
  margin-right: 4px;
  ${(props: { color: string }) => css`
    background-color: ${props.color};
  `}
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`

export const Title = styled.div`
  color: #333333;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
`

export const StyledTag = styled(Tag)`
  height: 22px;
`

export const Statistics = styled.div`
  display: flex;
  margin-top: 24px;
`

export const Statistic = styled.div`
  display: flex;
  flex: 1;
`

export const Info = styled.div``

export const CountNumber = styled.span`
  width: 52px;
  height: 28px;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
`

export const CountText = styled.span`
  margin-left: 7px;
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.45);
`
