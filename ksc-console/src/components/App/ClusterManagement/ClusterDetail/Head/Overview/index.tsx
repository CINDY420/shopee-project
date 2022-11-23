import React from 'react'
import StatusBar, { IStatus } from 'components/Common/StatusBar'
import { useParams } from 'react-router'
import { nodeControllerGetNodeOverview } from 'swagger-api/apis/Node'
import Usage from 'components/App/ClusterManagement/ClusterDetail/Head/Overview/Usage'
import { metricsControllerGetClusterMetrics } from 'swagger-api/apis/Metrics'
import { IGetProjectMetricsResponse } from 'swagger-api/models'

const USELESS_STATUS_NAME = 'total'
const Overview = () => {
  const { clusterId } = useParams()
  const [status, setStatus] = React.useState<IStatus[]>()
  const [metrics, setMetrics] = React.useState<IGetProjectMetricsResponse>()
  const [isLoading, setIsLoading] = React.useState(false)

  const getStatusData = React.useCallback(async () => {
    if (clusterId) {
      const data = await nodeControllerGetNodeOverview({ clusterId })
      const status = Object.keys(data ?? {})
        .filter((key) => key !== USELESS_STATUS_NAME)
        .sort((a, b) => b.length - a.length)
        .map((key) => ({
          statusName: key,
          unit: 'Nodes',
          account: Number(data[key]),
        }))
      setStatus(status)
    }
  }, [clusterId])

  const getClusterMetrics = React.useCallback(async () => {
    if (clusterId) {
      setIsLoading(true)
      try {
        const res = await metricsControllerGetClusterMetrics({ clusterId })
        setMetrics(res)
      } finally {
        setIsLoading(false)
      }
    }
  }, [clusterId])

  React.useEffect(() => {
    getStatusData()
    getClusterMetrics()
  }, [getStatusData, getClusterMetrics])

  return (
    <>
      <Usage isLoading={isLoading} metrics={metrics} />
      <StatusBar title="Node Status" status={status} />
    </>
  )
}

export default Overview
