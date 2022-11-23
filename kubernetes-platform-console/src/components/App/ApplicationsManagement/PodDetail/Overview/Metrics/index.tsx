import * as React from 'react'
import UsageChart from './UsageChart'

import { Col, Row } from 'infrad'
import { IPod } from 'api/types/application/pod'
import { formatFloat, formatDataFromByteToGib } from 'helpers/format'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { podsControllerGetPodDetail } from 'swagger-api/v3/apis/Pods'

interface IMetricsProps {
  pod: IPod
}

const Metrics: React.FC<IMetricsProps> = ({ pod }) => {
  const fetchFn = React.useCallback(
    args => {
      return podsControllerGetPodDetail({
        tenantId: pod.tenantId,
        projectName: pod.projectName,
        appName: pod.appName,
        clusterId: pod.clusterId,
        podName: pod.name,
        ...args
      })
    },
    [pod]
  )

  const [, getPodFn] = useAsyncIntervalFn(fetchFn, { enableIntervalCallback: true })

  React.useEffect(() => {
    getPodFn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { cpu, memory, filesystem, memRss } = pod

  return (
    <Row gutter={16}>
      <Col span={8}>
        <UsageChart
          title='CPU Usage'
          unit='Cores'
          metrics={cpu}
          formatDataFn={formatFloat}
          formatChartDataFn={formatFloat}
          yAxisName='%'
        />
      </Col>
      <Col span={8}>
        <UsageChart
          title='Memory Usage'
          unit='GiB'
          metrics={{
            ...memory,
            rss_used: memRss.used
          }}
          formatDataFn={formatDataFromByteToGib}
          formatChartDataFn={formatFloat}
          yAxisName='%'
          showRssUsage={true}
        />
      </Col>
      <Col span={8}>
        <UsageChart
          title='File System Usage'
          unit='GiB'
          metrics={filesystem}
          formatDataFn={formatDataFromByteToGib}
          formatChartDataFn={formatDataFromByteToGib}
          yAxisName='GiB'
        />
      </Col>
    </Row>
  )
}

export default Metrics
