import React from 'react'
import { DetailLayout } from 'src/components/Common/DetailLayout'
import { ITab } from 'src/components/Common/DetailLayout/Tabs'
import { Models } from 'src/rapper'
import { Space, Breadcrumb } from 'infrad'
import {
  Title,
  TitleStatus,
  MonitoringLink,
  PodUnitWrapper,
} from 'src/components/App/Cluster/ClusterDetail/style'
import NodeTable from 'src/components/App/Cluster/ClusterDetail/NodeTable'
import { Link } from 'react-router-dom'
import { CLUSTER } from 'src/constants/routes/routes'

type ClusterDetail = Models['GET/ecpadmin/clusters/{clusterId}']['Res']

const ClusterDetail: React.FC<ClusterDetail> = ({
  clusterId,
  podCount,
  status,
  displayName,
  observabilityLink,
}) => {
  const breadCrumb = (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to={CLUSTER}>Cluster List</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>Cluster: {displayName}</Breadcrumb.Item>
    </Breadcrumb>
  )
  const title = (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Title>
          <TitleStatus>[{status}]</TitleStatus> Cluster: {displayName}
        </Title>
        <MonitoringLink href={observabilityLink} target="_black">
          Monitoring
        </MonitoringLink>
      </div>
      <div>
        Pod: {podCount} <PodUnitWrapper>Pods</PodUnitWrapper>
      </div>
    </Space>
  )
  const tabs: ITab[] = [
    {
      Component: NodeTable,
      props: {
        clusterId,
      },
      name: 'Nodes',
    },
  ]

  return <DetailLayout breadCrumb={breadCrumb} title={title} tabs={tabs} />
}

export default ClusterDetail
