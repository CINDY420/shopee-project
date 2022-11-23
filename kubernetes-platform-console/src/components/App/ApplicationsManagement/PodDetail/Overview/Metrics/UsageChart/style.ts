import styled from 'styled-components'

import { Progress } from 'infrad'
import { Statistic } from 'common-styles/statisticWrapper'
import { Card } from 'common-styles/cardWrapper'

export const StyledStatistic = styled(Statistic)`
  display: flex;
  align-items: center;

  .ant-statistic-title {
    color: #555;
    font-size: 1.3em;
    margin-right: 0.5em;
  }
`

export const StyledCard = styled(Card)`
  min-height: 460px;
  .ant-card-head {
    border-bottom: none;
    font-size: 20px;
    font-weight: 600;
    padding: 10px 24px;
  }
  .ant-card-head-title {
    padding: 10px;
    padding-bottom: 0px;
  }
  box-shadow: none;
  .ant-card-body {
    padding: 0px;
  }
`

export const ProcessWrapper = styled.div`
  width: 100%;
  padding: 0px 35px;
`

export const StyledProgress = styled(Progress)`
  .ant-progress-inner,
  .ant-progress-success-bg,
  .ant-progress-bg {
    border-radius: 0 !important;
    height: 15px !important;
  }
`
export const CountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5em;
  height: 70px;
  padding: 0px 35px;
  padding-top: 10px;
`
