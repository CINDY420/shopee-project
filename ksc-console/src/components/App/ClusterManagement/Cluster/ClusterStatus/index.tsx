import React from 'react'
import StatusBar, { IStatus } from 'components/Common/StatusBar'
import { CommonStyledCard } from 'common-styles/card'
import { clusterControllerGetClusterOverview } from 'swagger-api/apis/Cluster'

const USELESS_STATUS_NAME = 'total'
const ClusterStatus = () => {
  const [status, setStatus] = React.useState<IStatus[]>([])

  const getStatusData = async () => {
    const data = await clusterControllerGetClusterOverview()
    const status = Object.keys(data ?? {})
      .filter((key) => key !== USELESS_STATUS_NAME)
      .sort((a, b) => b.length - a.length)
      .map((key) => ({
        statusName: key,
        unit: 'Clusters',
        account: Number(data[key]),
      }))
    setStatus(status)
  }

  React.useEffect(() => {
    getStatusData()
  }, [])

  return (
    <CommonStyledCard bordered={false}>
      <StatusBar title="Cluster Status" status={status} />
    </CommonStyledCard>
  )
}

export default ClusterStatus
