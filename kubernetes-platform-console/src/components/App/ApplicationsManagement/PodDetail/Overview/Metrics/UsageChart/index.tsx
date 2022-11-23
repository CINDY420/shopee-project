import * as React from 'react'

import { formatAreaChartData } from 'helpers/chart'
import { primary, grey } from 'constants/colors'

import Count from 'components/App/PlatformManagement/Clusters/Common/QuotasCard/Count'
import AreaChart from 'components/App/ApplicationsManagement/PodDetail/Common/Charts/Area'
import { StyledCard, CountWrapper, ProcessWrapper, StyledProgress } from './style'

interface IUsagePoint {
  x: string
  y: number
}

interface IChartParams {
  title?: string
  unit?: string
  metrics: {
    capacity: number
    used: number
    status: string
    graph: IUsagePoint[]
    rss_used?: number
  }
  formatDataFn?: any
  formatChartDataFn?: any
  yAxisName?: string
  showRssUsage?: boolean
}

const getPercent = (metrics: any) => Math.round((metrics.used / metrics.capacity) * 100)
const getRssPercent = (metrics: any) => Math.round((metrics.rss_used / metrics.capacity) * 100)

const UsageChart = ({
  title,
  unit,
  metrics,
  formatDataFn,
  formatChartDataFn,
  yAxisName,
  showRssUsage = false
}: IChartParams) => {
  const isNoLimited = metrics.capacity < metrics.used

  return (
    <StyledCard title={title}>
      <ProcessWrapper>
        <StyledProgress
          percent={getPercent(metrics)}
          success={showRssUsage ? { percent: getRssPercent(metrics) } : {}}
          strokeColor={primary}
          strokeLinecap='square'
          showInfo={false}
        />
      </ProcessWrapper>
      <CountWrapper>
        {showRssUsage && <Count color='#52c41a' name='Rss_Used' unit={unit} count={formatDataFn(metrics.rss_used)} />}
        <Count color={primary} name='Used' unit={unit} count={formatDataFn(metrics.used)} />
        {!isNoLimited && <Count color={grey} name='Applied' unit={unit} count={formatDataFn(metrics.capacity)} />}
        {isNoLimited && <Count color={grey} name='Applied' isNoLimited />}
      </CountWrapper>
      {metrics.graph && (
        <AreaChart
          empty={!metrics.graph.length}
          dataMap={formatAreaChartData(metrics.graph, formatChartDataFn)}
          wrapperMinWidth='20em'
          yAxisName={yAxisName}
        />
      )}
    </StyledCard>
  )
}

export default UsageChart
