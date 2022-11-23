import React, { useCallback, useState, useEffect } from 'react'

import { TableColumnType, Input, Radio, Space, Tag, message } from 'infrad'
import { fetch, Models } from 'src/rapper'
import { Table } from 'src/common-styles/table'
import { CapitalizeStatus } from 'src/common-styles/textWrapper'

import { DEFAULT_TABLE_PAGINATION } from 'src/constants/pagination'
import useAntdTable, { getFilterUrlParam, FilterTypes } from 'src/hooks/table/useAntdTable'
import {
  Root,
  HeaderWrapper,
  CapitalizedSpan,
  StatusCountWrapper,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/style'
import Taints from 'src/components/App/Cluster/ClusterDetail/NodeTable/Taints'
import Progress from 'src/components/App/Cluster/ClusterDetail/NodeTable/Progress'
import { HTTPError } from '@space/common-http'
import { ByteToGiB, formatCpu } from 'src/helpers/unit'

type Node = Models['GET/ecpadmin/clusters/{clusterId}/nodes']['Res']['items'][0]
type ListNodesRequest = Models['GET/ecpadmin/clusters/{clusterId}/nodes']['Req']
type ListNodesResponse = Models['GET/ecpadmin/clusters/{clusterId}/nodes']['Res']

const computePercent = (used: number, total: number) => Math.round((used / total) * 100)

interface INodeTableProps {
  clusterId: string
}

enum NodeStatus {
  TOTAL = 'Total',
  READY = 'Ready',
  NOT_READY = 'Not Ready',
  UNKNOWN = 'Unknown',
}

const statusCountMap = {
  [NodeStatus.TOTAL]: 'total',
  [NodeStatus.READY]: 'readyCount',
  [NodeStatus.NOT_READY]: 'notReadyCount',
  [NodeStatus.UNKNOWN]: 'unknownCount',
}

const statusFilterMap = {
  [NodeStatus.READY]: 'Ready',
  [NodeStatus.NOT_READY]: 'Not Ready',
  [NodeStatus.UNKNOWN]: 'Unknown',
}

const StatusColorMap: Record<string, string> = {
  Ready: '#52C41A',
  Unknown: '#D9D9D9',
  ['Not Ready']: '#FF4D4F',
}

const NodeTable: React.FC<INodeTableProps> = ({ clusterId }) => {
  const [data, setData] = useState<ListNodesResponse>()
  const { items: dataSource = [], totalCount, filterOptions } = data || {}
  const { status: statusCount = [], roles } = filterOptions || {}

  const column: TableColumnType<Node>[] = [
    {
      title: 'Node',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Private IP',
      dataIndex: 'privateIP',
      key: 'privateIP',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <CapitalizeStatus pointColor={StatusColorMap[status]}>{status}</CapitalizeStatus>
      ),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) =>
        roles.map((role) => (
          <Tag color="blue" key={role}>
            {role}
          </Tag>
        )),
      filters: roles?.map((role) => ({ value: role, text: role })),
    },
    {
      title: 'Labels',
      dataIndex: 'labels',
      key: 'labels',
      render: (labels: Node['labels']) => (
        <Space direction="vertical" size={6}>
          {labels.map(({ key, value }) => (
            <Tag key={`${key}-${value}`}>
              {key}={value}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Taints',
      dataIndex: 'taints',
      key: 'taints',
      render: (taints: Node['taints']) => <Taints taints={taints} />,
    },
    {
      title: 'CPU',
      render: (_, record) => {
        const cpuMetric = record.metrics.cpu
        const { used, total } = cpuMetric
        return (
          <Progress
            header={`${formatCpu(used)}/${formatCpu(total)} Cores`}
            percent={computePercent(used, total)}
          />
        )
      },
    },
    {
      title: 'Memory',
      render: (_, record) => {
        const memoryMetric = record.metrics.memory
        const { used, total } = memoryMetric
        return (
          <Progress
            header={`${ByteToGiB(used)}/${ByteToGiB(total)} GiB`}
            percent={computePercent(used, total)}
          />
        )
      },
    },
    {
      title: 'Disk',
      render: (_, record) => {
        const diskMetrics = record.metrics.disk
        const { used, total } = diskMetrics
        return <Progress header={`${used}/${total} TiB`} percent={computePercent(used, total)} />
      },
    },
    {
      title: 'GPU',
      render: (_, record) => {
        const gpuMetrics = record.metrics.gpu
        const { used, total } = gpuMetrics
        return <Progress header={`${used}/${total} Cores`} percent={computePercent(used, total)} />
      },
    },
    {
      title: 'Pod',
      render: (_, record) => {
        const { capacity, count } = record.podSummary
        return (
          <Progress
            header={`${count}/${capacity} Pods`}
            percent={computePercent(count, capacity)}
          />
        )
      },
    },
  ]

  const [searchValue, setSearchValue] = useState<string>()

  const [selectedType, setSelectedType] = useState(NodeStatus.TOTAL)

  const statusFilterBy =
    selectedType !== NodeStatus.TOTAL
      ? getFilterUrlParam({
          status: { key: 'status', value: statusFilterMap[selectedType], type: FilterTypes.EQUAL },
        })
      : undefined

  const listNodesFn = useCallback(
    async (args: ListNodesRequest) => {
      const { filterBy } = args
      try {
        const response = await fetch['GET/ecpadmin/clusters/{clusterId}/nodes']({
          ...args,
          filterBy: statusFilterBy ? [filterBy, statusFilterBy].join(';') : filterBy,
          searchBy: searchValue,
          clusterId,
        })
        setData(response)
      } catch (error) {
        error instanceof HTTPError && message.error(error.message)
      }
    },
    [clusterId, searchValue, statusFilterBy],
  )
  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: listNodesFn,
    shouldFetchOnMounted: false,
  })

  useEffect(() => {
    refresh()
  }, [refresh, searchValue, selectedType])

  return (
    <Root>
      <HeaderWrapper>
        <Radio.Group value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          {Object.values(NodeStatus).map((status) => (
            <Radio.Button key={status} value={status}>
              <CapitalizedSpan>{status}</CapitalizedSpan>
              <StatusCountWrapper>
                {statusCount.find((item) => item.option === statusCountMap[status])?.totalCount}
              </StatusCountWrapper>
            </Radio.Button>
          ))}
        </Radio.Group>
        <Input.Search
          allowClear
          onSearch={(value) => setSearchValue(value)}
          style={{ width: 264, float: 'right' }}
          placeholder="Search Node Name/Private IP"
        />
      </HeaderWrapper>
      <Table
        rowKey={(record) => `${record.name}-${record.privateIP}`}
        dataSource={dataSource}
        columns={column}
        pagination={{ ...pagination, ...DEFAULT_TABLE_PAGINATION, total: totalCount }}
        onChange={handleTableChange}
      />
    </Root>
  )
}

export default NodeTable
