import React from 'react'
import { useHistory } from 'react-router'
import { CREATE_CLUSTER, CLUSTER } from 'src/constants/routes/routes'
import { Button, Tag } from 'infrad'
import { StyledPageHeader } from 'src/common-styles/layout'
import {
  Root,
  BorderedLink,
  StyledCard,
  StyledTable,
  StyledBadge,
} from 'src/components/App/Cluster/ClusterTable/style'
import MonitorSvg from 'src/assets/monitor.svg'
import { eksClusterController_listClusters } from 'src/swagger-api/apis/EksCluster'
import { IEksClusterItem } from 'src/swagger-api/models'
import { TABLE_PAGINATION_OPTION } from 'src/constants/pagination'
import { ColumnsType } from 'infrad/lib/table'
import { listFnWrapper } from 'src/helpers/table'
import { useTable } from 'src/hooks/useTable'
import DebouncedSearch from 'src/components/Common/DebouncedSearch'
import { timestampToLocalTime } from 'src/helpers/time'
import { Link } from 'react-router-dom'

export enum CLUSTER_STATUS_TYPE {
  RUNNING = 'Running',
  PENDING = 'Pending',
  PROVISIONING = 'Provisioning',
  UPDATING = 'Updating',
  FAILED = 'Failed',
  DELETING = 'Deleting',
  UNKNOWN = 'Unknown',
  PROVISIONED = 'Provisioned',
}

const statusTagColorMap: Record<string, string> = {
  [CLUSTER_STATUS_TYPE.RUNNING]: 'green',
  [CLUSTER_STATUS_TYPE.PENDING]: 'purple',
  [CLUSTER_STATUS_TYPE.PROVISIONING]: 'processing',
  [CLUSTER_STATUS_TYPE.UPDATING]: 'cyan',
  [CLUSTER_STATUS_TYPE.FAILED]: 'red',
  [CLUSTER_STATUS_TYPE.DELETING]: 'warning',
  [CLUSTER_STATUS_TYPE.UNKNOWN]: 'default',
  [CLUSTER_STATUS_TYPE.PROVISIONED]: 'geekblue',
}

export const healthyStatusColorMap: Record<string, string> = {
  Healthy: 'green',
  Unhealthy: 'red',
}

const ClusterTable: React.FC = () => {
  const history = useHistory()
  const handleCreateCluster = () => history.push(CREATE_CLUSTER)
  const [searchValue, setSearchValue] = React.useState<string>('')
  const [clusterOptions, setClusterOptions] = React.useState<Record<string, string[]>>({
    azList: [],
    healthyStatusList: [],
    servicesNameList: [],
    statusList: [],
    segmentList: [],
  })

  const listClusterFn = listFnWrapper(async (args) => {
    const values = await eksClusterController_listClusters({
      ...args,
      searchBy: searchValue,
    })

    const {
      items,
      total,
      azList = [],
      healthyStatusList = [],
      servicesNameList = [],
      statusList = [],
      segmentList = [],
    } = values || {}
    setClusterOptions({
      azList,
      healthyStatusList,
      servicesNameList,
      statusList,
      segmentList,
    })
    return {
      list: items || [],
      total: total || 0,
    }
  })

  const { tableProps } = useTable(listClusterFn, {
    refreshDeps: [searchValue],
    reloadRate: 15000,
  })

  const { pagination } = tableProps

  const columns: ColumnsType<IEksClusterItem> = [
    {
      title: 'Display Name',
      dataIndex: 'displayName',
      render: (name, record) => <Link to={`${CLUSTER}/${record.id}`}>{name}</Link>,
    },
    {
      title: 'Cluster ID',
      dataIndex: 'uuid',
    },
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      filters: clusterOptions?.servicesNameList.map((serviceName) => ({
        text: serviceName,
        value: serviceName,
      })),
    },
    {
      title: 'AZ',
      dataIndex: 'az',
      filters: clusterOptions?.azList.map((az) => ({ text: az, value: az })),
    },
    {
      title: 'Segment ',
      dataIndex: 'segment',
      filters: clusterOptions?.segmentList.map((segment) => ({ text: segment, value: segment })),
    },
    {
      title: 'Nodes',
      dataIndex: 'nodeCount',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: clusterOptions?.statusList.map((status) => ({ text: status, value: status })),
      render: (status: string) => <Tag color={statusTagColorMap[status]}>{status}</Tag>,
    },
    {
      title: 'Health Status',
      dataIndex: 'healthyStatus',
      filters: clusterOptions?.healthyStatusList.map((healthyStatus) => ({
        text: healthyStatus,
        value: healthyStatus,
      })),
      render: (healthyStatus: string) => (
        <StyledBadge color={healthyStatusColorMap[healthyStatus]} text={healthyStatus} />
      ),
    },
    {
      title: 'Create Time',
      dataIndex: 'createdTime',
      defaultSortOrder: 'descend',
      sorter: true,
      render: (createdTime: string) => timestampToLocalTime(createdTime),
    },
    {
      title: 'Observability',
      dataIndex: 'observabilityLink',
      render: (observabilityLink: string) => (
        <BorderedLink href={observabilityLink} target="_blank" rel="noreferrer">
          <img src={MonitorSvg} alt="#" />
        </BorderedLink>
      ),
    },
  ]

  return (
    <Root>
      <StyledPageHeader
        title="Cluster"
        extra={[
          <Button key="Create Cluster" type="primary" onClick={handleCreateCluster}>
            Create Cluster
          </Button>,
        ]}
      />
      <StyledCard>
        <DebouncedSearch
          placeholder="Search by Display Name/Cluster ID"
          callback={(value) => setSearchValue(value)}
          style={{ width: 400 }}
          debounceTime={500}
        />
        <StyledTable
          rowKey="uuid"
          columns={columns}
          {...tableProps}
          style={{ marginTop: '16px' }}
          pagination={{
            ...pagination,
            ...TABLE_PAGINATION_OPTION,
          }}
        />
      </StyledCard>
    </Root>
  )
}
export default ClusterTable
