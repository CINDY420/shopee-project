import * as React from 'react'
import { IClusterProps } from 'components/App/ProjectMGT/TenantDetail/Overview'
import Metrics from 'components/App/ProjectMGT/Common/Metrics'
import { ProjectDetailContext } from 'components/App/ProjectMGT/ProjectDetail'

interface IOverviewProps {
  clusterItems: IClusterProps[]
  envs: string[]
}

const Overview: React.FC<IOverviewProps> = ({ clusterItems, envs }) => {
  const { tenantName, projectName, tenantCmdbName } = React.useContext(ProjectDetailContext) ?? {}
  return (
    <Metrics
      tenantName={tenantCmdbName || tenantName}
      projectName={projectName}
      clusterItems={clusterItems}
      envs={envs}
    />
  )
}
export default Overview
