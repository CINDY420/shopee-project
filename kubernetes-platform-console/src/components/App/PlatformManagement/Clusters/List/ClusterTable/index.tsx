/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { Divider, Tag, Spin, Tooltip } from 'infrad'
import { CaretRightOutlined, CaretDownOutlined, InfoCircleOutlined } from 'infra-design-icons'
import { Link } from 'react-router-dom'

import HealthyStatus from 'components/Common/HealthyStatus'
// import ProgressBar from 'components/Common/ProgressBar'
import TenantList from '../TenantList'

import { formatDataFromByteToGib, formatFloat } from 'helpers/format'
import history from 'helpers/history'

import { CLUSTER_STATUS as STATUS } from 'constants/cluster'
import { CLUSTERS } from 'constants/routes/routes'
import { danger } from 'constants/colors'

import { clustersControllerListClustersInfoStatus } from 'swagger-api/v3/apis/Cluster'
import useAsyncFn from 'hooks/useAsyncFn'

import { Table } from 'common-styles/table'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'

// const renderProgress = ({ capacity, assigned, status, unit, formatDataFn }: any, loading?: boolean) => {
//   return (
//     <Spin spinning={loading}>
//       <ProgressBar
//         used={assigned}
//         capacity={capacity}
//         status={status}
//         unit={unit}
//         style={{ width: '12em' }}
//         formatDataFn={formatDataFn}
//       />
//     </Spin>
//   )
// }

const renderProgress = (
  { workerAllocatable = 0, quotaTotal = 0, assigned = 0, status, unit, formatDataFn }: any,
  loading?: boolean
) => {
  const formatter = formatDataFn || formatFloat

  return (
    <Spin spinning={loading}>
      {`${formatter(assigned)}/${formatFloat(quotaTotal)}/${formatFloat(workerAllocatable)} ${unit}`}
    </Spin>
  )
}

const renderTitle = (name: string) => {
  return (
    <Tooltip
      placement='top'
      title={
        <>
          <div>Assigned: Sum of pod limit</div>
          <div>Quota: Sum of tenant quota</div>
          <div>Total: Total resource</div>
        </>
      }
    >
      <div>
        <span style={{ marginRight: '3px' }}>{`Assigned/Quota/Total ${name}`}</span>
        <InfoCircleOutlined />
      </div>
    </Tooltip>
  )
}

const statusFilters = Object.values(STATUS).map(status => ({ text: status, value: status }))

const formatClusters = (clusters, status) => {
  const statusMap = status.reduce((pre, cur) => {
    return {
      ...pre,
      [cur.name]: cur
    }
  }, {})

  return clusters.map(cluster => {
    return {
      ...cluster,
      ...statusMap[cluster.name]
    }
  })
}

interface IClusterTableProps {
  listClustersState: any
  onTableChange: any
  pagination: any
  hasViewPermission: boolean
}

const ClusterTable: React.FC<IClusterTableProps> = ({
  listClustersState = {},
  onTableChange,
  pagination,
  hasViewPermission
}) => {
  const [getClustersStatusState, getClustersStatusFn] = useAsyncFn(clustersControllerListClustersInfoStatus)

  const { value, loading: clustersLoading } = listClustersState
  const { clusters = [], totalCount = 0 } = value || {}

  const { value: statusValue, loading: statusLoading } = getClustersStatusState
  const { clusters: clusterStatus = [] } = statusValue || {}

  React.useEffect(() => {
    if (!clustersLoading && clusters.length) {
      handleFetchClustersStatus()
    }
  }, [clustersLoading])

  const handleFetchClustersStatus = async () => {
    const clusterNames = clusters.map(clusters => clusters.name)
    getClustersStatusFn({ clusters: clusterNames.join('|') })
  }

  const columns = [
    {
      title: 'Cluster',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <a
          style={{ color: '#333', fontWeight: 500 }}
          onClick={() => {
            history.push(`${CLUSTERS}/${name}`)
          }}
        >
          {name}
        </a>
      )
    },
    {
      title: () => renderTitle('CPU'),
      dataIndex: 'metrics',
      key: 'cpu',
      render: (metrics: any, record: any) =>
        renderProgress({ ...metrics.cpu, status: record.status, unit: 'Cores' }, statusLoading)
    },
    {
      title: () => renderTitle('Memory'),
      dataIndex: 'metrics',
      key: 'memory',
      render: (metrics: any, record: any) =>
        renderProgress(
          { ...metrics.memory, status: record.status, unit: 'GiB', formatDataFn: formatDataFromByteToGib },
          statusLoading
        )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusFilters,
      render: (_: string, item: any) => {
        const { status, name, alarms = [] } = item

        return (
          <Spin spinning={statusLoading}>
            <HealthyStatus status={status}>
              <Divider type='vertical' />
              <Link to={`/platform/clusters/${name}`}>
                {alarms && <Tag color={danger}>{`${alarms && alarms.length} errors`}</Tag>}
              </Link>
            </HealthyStatus>
          </Spin>
        )
      }
    }
  ]

  return (
    <Table
      rowKey='name'
      columns={columns}
      dataSource={formatClusters(clusters, clusterStatus)}
      loading={clustersLoading}
      onChange={onTableChange}
      expandable={
        hasViewPermission && {
          expandedRowRender: (record: any, _index, _indent, expanded: boolean) =>
            expanded && <TenantList clusterName={record.name} />,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <CaretDownOutlined onClick={e => onExpand(record, e)} />
            ) : (
              <CaretRightOutlined onClick={e => onExpand(record, e)} />
            )
        }
      }
      pagination={{
        ...pagination,
        ...TABLE_PAGINATION_OPTION,
        total: totalCount
      }}
    />
  )
}

export default ClusterTable
