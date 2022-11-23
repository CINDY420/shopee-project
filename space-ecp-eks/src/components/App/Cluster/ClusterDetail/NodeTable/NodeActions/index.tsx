import React from 'react'
import LabelAndTaint from 'src/components/App/Cluster/ClusterDetail/NodeTable/NodeActions/LabelAndTaint'
import MoreActions from 'src/components/App/Cluster/ClusterDetail/NodeTable/NodeActions/MoreActions'
import { IEksGetClusterDetailResponse } from 'src/swagger-api/models'

interface INodeActionsProps {
  clusterDetail: IEksGetClusterDetailResponse
}

const NodeActions: React.FC<INodeActionsProps> = ({ clusterDetail }) => (
  <>
    <LabelAndTaint />
    <MoreActions clusterDetail={clusterDetail} />
  </>
)

export default NodeActions
