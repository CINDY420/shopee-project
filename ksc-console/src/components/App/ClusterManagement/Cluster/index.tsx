import DetailLayout from 'components/Common/DetailLayout'
import ClusterList from 'components/App/ClusterManagement/Cluster/ClusterList'
import ClusterStatus from 'components/App/ClusterManagement/Cluster/ClusterStatus'
import React from 'react'

const Cluster: React.FC = () => (
  <DetailLayout
    title="Cluster Management"
    isHeaderWithBottomLine
    isHeaderWithBreadcrumbs={false}
    body={
      <>
        <ClusterStatus />
        <ClusterList />
      </>
    }
  />
)

export default Cluster
