import React, { useCallback, useEffect, useState } from 'react'
import { TableColumnType, message, Space, Tag, Switch, Tooltip, Typography } from 'infrad'
import { fetch, Models, useRequest } from 'src/rapper'
import { Table } from 'src/common-styles/table'
import { CapitalizeTag, CapitalizeStatus } from 'src/common-styles/textWrapper'

import { DEFAULT_TABLE_PAGINATION } from 'src/constants/pagination'
import useAntdTable, { getFilterUrlParam, FilterTypes } from 'src/hooks/table/useAntdTable'
import { timestampToLocalTime } from 'src/helpers/time'
import MonitorSvg from 'src/assets/monitor.svg'
import { HTTPError } from '@space/common-http'
import KarmadaManagementModal from 'src/components/Common/ClusterTable/KarmadaManagementModal'
import { IQuestionMark } from 'infra-design-icons'
import {
  globalController_listAllAzs,
  globalController_listAllAZv1s,
  globalController_listAllSegmentNames,
} from 'src/swagger-api/apis/Global'
import { clusterController_enableKarmada } from 'src/swagger-api/apis/Cluster'
import { eksClusterController_getClusterInfoByUuid } from 'src/swagger-api/apis/EksCluster'
import { IEnableKarmadaBody } from 'src/swagger-api/models'
import { buildEksClusterDetailUrl } from 'src/constants/eks'

type Cluster = Models['GET/ecpadmin/clusters']['Res']['items'][0]
type ListClustersRequest = Models['GET/ecpadmin/clusters']['Req']
type ListClustersResponse = Models['GET/ecpadmin/clusters']['Res']

const HealthyStatusColorMap: Record<string, string> = {
  Healthy: '#52C41A',
  Unhealthy: '#FF4D4F',
}

interface IClusterTableProps {
  searchValue?: string
  segmentName?: string
  azv2Key?: string
  segmentNameFilterDisabled?: boolean
  azv2KeyFilterDisabled?: boolean
}

const ClusterTable: React.FC<IClusterTableProps> = ({
  searchValue,
  segmentName,
  azv2Key,
  segmentNameFilterDisabled,
  azv2KeyFilterDisabled,
}) => {
  const { data: azv1Data } = useRequest(globalController_listAllAZv1s)
  const { data: azv2Data } = useRequest(globalController_listAllAzs)
  const { data: allSegmentNames } = useRequest(globalController_listAllSegmentNames)
  const [data, setData] = useState<ListClustersResponse>()
  const { items: dataSource = [], totalCount, filterOptions } = data || {}
  const {
    type: typeEnums = [],
    status: statusEnums = [],
    healthyStatus: healthyStatusEnums = [],
  } = filterOptions || {}
  const [karmadaConfigVisible, setKarmadaConfigVisible] = useState(false)
  const [selectedClusterId, setSelectedClusterId] = useState('')

  const handleClusterNameClick = async (clusterId: string) => {
    const clusterInfo = await eksClusterController_getClusterInfoByUuid({ uuid: clusterId })
    const { id } = clusterInfo || {}
    window.open(buildEksClusterDetailUrl(id))
  }

  const column: TableColumnType<Cluster>[] = [
    {
      title: 'Display Name',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (name, record) => (
        <Typography.Link onClick={() => handleClusterNameClick(record.clusterId)}>
          {name}
        </Typography.Link>
      ),
    },
    {
      title: 'Cluster ID',
      dataIndex: 'clusterId',
      key: 'clusterId',
    },
    {
      title: 'Version',
      dataIndex: 'clusterType',
      key: 'clusterType',
      filterSearch: true,
      filters: typeEnums.map((type) => ({ value: type, text: type })),
    },
    {
      title: 'AZv1',
      dataIndex: 'azv1Key',
      key: 'azv1Key',
      filterSearch: true,
      filters: azv1Data?.items
        .slice()
        .sort()
        .map((azKey) => ({ value: azKey, text: azKey })),
    },
    {
      title: 'AZv2',
      dataIndex: 'azv2Key',
      key: 'azv2Key',
      render: (azv2Key: string) => azv2Data?.items.find((item) => item.azKey === azv2Key)?.azName,
      filterSearch: true,
      filters: !azv2KeyFilterDisabled
        ? azv2Data?.items.map(({ azKey, azName }) => ({ value: azKey, text: azName }))
        : undefined,
    },
    {
      title: 'Segment',
      dataIndex: 'segmentName',
      key: 'segmentName',
      filterSearch: true,
      filters: !segmentNameFilterDisabled
        ? allSegmentNames?.items
            .map(({ name }) => name)
            .sort()
            .map((item) => ({ value: item, text: item }))
        : undefined,
    },
    {
      title: 'Karmada',
      dataIndex: 'karmadaCluster',
      key: 'karmadaCluster',
      render: (karmadaCluster, record) => (
        <Switch
          checked={karmadaCluster}
          onClick={() => handleKarmadaSwitchChange(record.clusterId)}
        />
      ),
    },
    {
      title: 'Labels',
      dataIndex: 'labels',
      key: 'labels',
      render: (labels: Cluster['labels']) => (
        <Space direction="vertical" size={6}>
          {labels.map((label) => (
            <Tag key={label}>{label}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Nodes',
      dataIndex: 'nodeCount',
      key: 'nodeCount',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <CapitalizeTag style={{ textTransform: 'capitalize' }} color="green">
          {status}
        </CapitalizeTag>
      ),
      filters: statusEnums.map((status) => ({ value: status, text: status })),
    },
    {
      title: 'Health Status',
      dataIndex: 'healthyStatus',
      key: 'healthyStatus',
      render: (healthStatus: string) => (
        <CapitalizeStatus pointColor={HealthyStatusColorMap[healthStatus]}>
          {healthStatus}
          <Tooltip title="error detail">
            <IQuestionMark style={{ marginLeft: '4px', fontSize: '16px' }} />
          </Tooltip>
        </CapitalizeStatus>
      ),
      filters: healthyStatusEnums.map((healthy) => ({ value: healthy, text: healthy })),
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (timestamp: string) => timestampToLocalTime(timestamp),
      sorter: true,
    },
    {
      title: 'Observability',
      dataIndex: 'observabilityLink',
      key: 'observabilityLink',
      render: (observabilityLink: string) => (
        <a href={observabilityLink} target="_black">
          <img src={MonitorSvg} alt="#" />
        </a>
      ),
    },
  ]

  const listClustersFn = useCallback(
    async (args: ListClustersRequest) => {
      const { filterBy, ...otherArgs } = args
      const segmentKeyFilterBy =
        segmentName &&
        getFilterUrlParam({
          type: { key: 'segmentName', value: segmentName, type: FilterTypes.EQUAL },
        })
      const azv2KeyFilterBy =
        azv2Key &&
        getFilterUrlParam({
          type: { key: 'azv2Key', value: azv2Key, type: FilterTypes.EQUAL },
        })
      try {
        const response = await fetch['GET/ecpadmin/clusters']({
          ...otherArgs,
          filterBy: segmentKeyFilterBy
            ? [filterBy, segmentKeyFilterBy, azv2KeyFilterBy].join(';')
            : filterBy,
          searchBy: searchValue,
        })
        setData(response)
      } catch (error) {
        error instanceof HTTPError && message.error(error.message)
      }
    },
    [searchValue, segmentName, azv2Key],
  )
  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: listClustersFn,
    shouldFetchOnMounted: false,
  })
  const handleKarmadaSwitchChange = (clusterId: string) => {
    setKarmadaConfigVisible(true)
    setSelectedClusterId(clusterId)
  }
  const handleKarmadaCancel = () => {
    setKarmadaConfigVisible(false)
    refresh()
  }
  const handleKarmadaComfirm = async (values: IEnableKarmadaBody) => {
    setKarmadaConfigVisible(false)
    try {
      await clusterController_enableKarmada(
        {
          clusterId: selectedClusterId,
          payload: values,
        },
        { disableError: true },
      )
      message.success('Successfully Enable Karmada Management!')
    } catch (error) {
      message.error('Failed to enable karmada management!')
    }
    refresh()
    setSelectedClusterId('')
  }

  useEffect(() => {
    refresh()
  }, [refresh, searchValue])

  return (
    <>
      <Table
        rowKey="clusterId"
        dataSource={dataSource}
        columns={column}
        pagination={{ ...pagination, ...DEFAULT_TABLE_PAGINATION, total: totalCount }}
        onChange={handleTableChange}
      />
      <KarmadaManagementModal
        visible={karmadaConfigVisible}
        onCancel={handleKarmadaCancel}
        onComfirm={handleKarmadaComfirm}
      />
    </>
  )
}

export default ClusterTable
