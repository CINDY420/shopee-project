import * as React from 'react'
import Metrics from 'components/App/ProjectMGT/Common/Metrics'

export interface IClusterProps {
  clusterId: string
  clusterName: string
}
interface IOverviewProps {
  tenantName: string
  clusterItems: IClusterProps[]
  envs: string[]
}

const Overview: React.FC<IOverviewProps> = ({ tenantName, clusterItems, envs }) => (
  <Metrics tenantName={tenantName} clusterItems={clusterItems} envs={envs} isTenantOverview />
)
export default Overview
