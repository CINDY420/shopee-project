import { StyledViewRow } from 'components/App/Platform/PlatformConfig/style'
import { Col, Statistic } from 'infrad'
import React from 'react'
import { clusterControllerListClustersWithDetail } from 'swagger-api/apis/Cluster'
import { IClusterDetailListItem } from 'swagger-api/models'

const PodOverview = () => {
  const [clusters, setClusters] = React.useState<IClusterDetailListItem[]>([])

  const listClusters = async () => {
    const { items } = await clusterControllerListClustersWithDetail({})
    setClusters(items)
  }

  React.useEffect(() => {
    listClusters()
  }, [])

  return (
    <StyledViewRow justify="space-around">
      {clusters.map((cluster) => (
        <Col key={cluster.clusterId}>
          <Statistic
            title={`${cluster.displayName} -- Pod Schedule`}
            value={cluster.schedulePodPerSecond}
            valueStyle={{
              textAlign: 'center',
            }}
          />
        </Col>
      ))}
    </StyledViewRow>
  )
}

export default PodOverview
