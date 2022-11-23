import React from 'react'
import { Badge, Breadcrumb } from 'infrad'
import DetailLayout from 'src/components/Common/DetailLayout'
import NodeTable from 'src/components/App/Cluster/ClusterDetail/NodeTable'
import ProvisioningHistory from 'src/components/App/Cluster/ClusterDetail/ProvisioningHistory'
import Configuration from 'src/components/App/Cluster/ClusterDetail/Configuration'

import {
  eksClusterController_getClusterDetail,
  eksClusterController_getClusterSummary,
} from 'src/swagger-api/apis/EksCluster'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { CLUSTER } from 'src/constants/routes/routes'
import { Title } from 'src/components/App/Cluster/ClusterDetail/style'
import { healthyStatusColorMap } from 'src/components/App/Cluster/ClusterTable'
import { IEksGetClusterDetailResponse } from 'src/swagger-api/models'
import Storage from 'src/components/App/Cluster/ClusterDetail/Storage'
import { ClusterDetailContext } from 'src/components/App/Cluster/ClusterDetail/context'
import { buildClusterDetailRoute } from 'src/helpers/route'

const ClusterDetail: React.FC = () => {
  const [podCount, setPodCount] = React.useState<number>()
  const [clusterDetail, setClusterDetail] = React.useState<IEksGetClusterDetailResponse>()
  const {
    healthyStatus: clusterHealthyStatus,
    clusterName,
    status: clusterStatus,
    nodeCount,
  } = clusterDetail || {}

  const [selectedTypeNodeCount, setSelectedTypeNodeCount] = React.useState<Record<string, number>>({
    totalCount: 0,
    notReadyCount: 0,
    readyCount: 0,
    unknownCount: 0,
  })

  const contentRef = React.useRef<HTMLDivElement>(null)

  const containerElement = React.useMemo(
    () => (contentRef.current ? contentRef.current.parentElement : null),
    [contentRef.current],
  )

  const { clusterId } = useParams<{
    clusterId: string
  }>()

  const getClusterHealthyStatus = async () => {
    const cluster = await eksClusterController_getClusterDetail({
      clusterId: Number(clusterId),
    })
    setClusterDetail(cluster)
  }

  const getClusterPodCount = async () => {
    const { podCount, totalCount, notReadyCount, readyCount, unknownCount } =
      await eksClusterController_getClusterSummary({ clusterId: Number(clusterId) })
    setPodCount(podCount)
    setSelectedTypeNodeCount({
      totalCount,
      notReadyCount,
      readyCount,
      unknownCount,
    })
  }

  useRequest(() => getClusterHealthyStatus(), {
    refreshDeps: [clusterId],
  })

  useRequest(() => getClusterPodCount(), {
    refreshDeps: [clusterId],
  })

  const tabs = [
    {
      name: 'Nodes',
      Component: NodeTable,
      props: {
        clusterId,
        totalCount: selectedTypeNodeCount.totalCount,
        notReadyCount: selectedTypeNodeCount.notReadyCount,
        readyCount: selectedTypeNodeCount.readyCount,
        unknownCount: selectedTypeNodeCount.unknownCount,
        containerElement,
        operateDisabled: clusterHealthyStatus === 'Unhealthy',
        clusterDetail,
      },
    },
    {
      name: 'Provisioning History',
      Component: ProvisioningHistory,
      props: {
        clusterId,
      },
    },
    {
      name: 'Storage',
      Component: Storage,
      props: {},
    },
    {
      name: 'Configuration',
      Component: Configuration,
      props: {},
    },
  ]

  const breadcrumb = (
    <Breadcrumb>
      <Breadcrumb.Item>
        <a href={CLUSTER}>Cluster List</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <a href={buildClusterDetailRoute({ clusterId })}>Cluster: {clusterName}</a>
      </Breadcrumb.Item>
    </Breadcrumb>
  )

  return (
    <div style={{ height: '100%' }} ref={contentRef}>
      <ClusterDetailContext.Provider value={{ clusterId }}>
        <DetailLayout
          title={
            <span>
              <Title style={{ color: '#1890FF', marginRight: '4px' }}>{`[${clusterStatus}]`}</Title>
              <Title>{`Cluster: ${clusterName}`}</Title>
            </span>
          }
          descriptionItems={[
            {
              label: 'Pod',
              text: podCount,
            },
            {
              label: 'Node',
              text: nodeCount,
            },
            {
              label: 'Health Status',
              text: (
                <div style={{ whiteSpace: 'nowrap' }}>
                  <Badge
                    color={healthyStatusColorMap[clusterHealthyStatus]}
                    text={clusterHealthyStatus}
                  />
                  {/* TODO: wenwen.wu support next version */}
                  {/* <Tooltip
                  title={
                    clusterHealthyStatus === 'Unhealthy' ? (
                      <div style={{ whiteSpace: 'normal', padding: '6px 8px' }}>
                        <div>Galio:</div>
                        <div>
                          error detail error detail error detail error detailerror detail error
                          detail error detail error detail error detail error detail error detail
                          error detail error detail error
                        </div>
                      </div>
                    ) : null
                  }
                >
                  <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 6 }} />
                </Tooltip> */}
                </div>
              ),
            },
          ]}
          tabs={tabs}
          breadcrumb={breadcrumb}
        />
      </ClusterDetailContext.Provider>
    </div>
  )
}

export default ClusterDetail
