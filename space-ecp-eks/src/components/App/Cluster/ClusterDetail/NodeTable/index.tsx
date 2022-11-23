import React from 'react'
import { Card, Row, Col, Radio, Badge, Space, Tag, Dropdown, Menu, Button } from 'infrad'
import { RadioChangeEvent } from 'infrad/lib/radio/interface'
import Progress from 'src/components/App/Cluster/ClusterDetail/NodeTable/Progress'
import Icon, { IArrowDown, InfoCircleOutlined } from 'infra-design-icons'
import { ColumnsType } from 'infrad/lib/table'
import { IAntdTableChangeParam, listFnWrapper } from 'src/helpers/table'
import {
  IEksNodeItem,
  ILabel,
  ITaint,
  IEKsNodeMetricsSpec,
  IEksGetClusterDetailResponse,
} from 'src/swagger-api/models'
import { eksNodeController_listNodes } from 'src/swagger-api/apis/EksNode'
import { listQuery } from '@infra/utils'
import { useTable } from 'src/hooks/useTable'
import DebouncedSearch from 'src/components/Common/DebouncedSearch'
import { TABLE_PAGINATION_OPTION } from 'src/constants/pagination'
import {
  StyledButton,
  StyledLabelFiltersContainer,
  StyledPopover,
  StyledStatusTable,
  StyledTable,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/style'
import LabelFilter from 'src/components/App/Cluster/ClusterDetail/NodeTable/LabelFilter'
import BatchAction from 'src/components/App/Cluster/ClusterDetail/NodeTable/BatchAction'
import {
  getDispatchers,
  initialState,
  NodeContext,
  reducer,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/useNodeContext'
import { useAsyncEffect } from 'ahooks'
import NodeActions from 'src/components/App/Cluster/ClusterDetail/NodeTable/NodeActions'
import { NodeAction } from 'src/components/App/Cluster/ClusterDetail/NodeTable/constant'
import { IFilterByItem } from '@infra/utils/dist/list-query'
import AddNode from 'src/components/App/Cluster/ClusterDetail/NodeTable/AddNode'
import { ReactComponent as ProvisioningSvg } from 'src/assets/provisioning.svg'
import Taint from 'src/components/App/Cluster/ClusterDetail/NodeTable/Taint'

const { FilterByOperator } = listQuery

const computePercent = (used: number, total: number) => Math.round((used / total) * 100)
const NodeMoreActions = Object.values(NodeAction).filter(
  (item) => item !== NodeAction.LABEL && item !== NodeAction.TAINT,
)

interface INodeTableProps {
  clusterId: number
  totalCount: number
  notReadyCount: number
  readyCount: number
  unknownCount: number
  containerElement: HTMLElement
  clusterDetail: IEksGetClusterDetailResponse
}

export enum NodeStatusTypes {
  PROVISIONING = 'Provisioning',
  UPDATING = 'Updating',
  PENDING = 'Pending',
  FAILED = 'Failed',
  UNKNOWN = 'Unknown',
  RUNNING = 'Running',
  READY = 'Ready',
  NOT_READY = 'NotReady',
  DELETING = 'Deleting',
}

export const nodeStatusColorMap: Record<string, string> = {
  [NodeStatusTypes.UPDATING]: '#1890FF',
  [NodeStatusTypes.PENDING]: '#722ED1',
  [NodeStatusTypes.FAILED]: '#FF4D4F',
  [NodeStatusTypes.UNKNOWN]: '#BFBFBF',
  [NodeStatusTypes.RUNNING]: '#13C2C2',
  [NodeStatusTypes.READY]: '#52C41A',
  [NodeStatusTypes.NOT_READY]: '#FADB14',
  [NodeStatusTypes.DELETING]: '#FA8C16',
}

export const SchedulingStatusColorMap: Record<string, string> = {
  Schedulabled: '#52C41A',
  SchedulingDisabled: '#FAAD14',
}

const getActionDisableStatus = (selectedNode: IEksNodeItem, action: NodeAction): boolean => {
  const { roles, schedulingStatus } = selectedNode || {}
  switch (action) {
    case NodeAction.CORDON:
      return roles.includes('master') || schedulingStatus === 'SchedulingDisabled'
    case NodeAction.UNCORDON:
      return roles.includes('master') || schedulingStatus === 'Schedulabled'
    case NodeAction.DRAIN:
      return roles.includes('master')
  }
}

const NodeTable: React.FC<INodeTableProps> = (props) => {
  const {
    clusterId,
    totalCount,
    notReadyCount,
    readyCount,
    unknownCount,
    containerElement,
    clusterDetail,
  } = props

  const typeCountMap = React.useMemo(
    () => ({
      All: totalCount,
      Ready: readyCount,
      NotReady: notReadyCount,
      Unknown: unknownCount,
    }),
    [totalCount, notReadyCount, readyCount, unknownCount],
  )

  const [selectedType, setSelectedType] = React.useState<string>(Object.keys(typeCountMap)[0])

  const [searchValue, setSearchValue] = React.useState('')
  const [rolesList, setRolesList] = React.useState<Array<string>>([])
  const [isBatchOperating, setIsBatchOperating] = React.useState(false)
  const [selectedRowState, setSelectedRowState] = React.useState<{
    selectedRowKeys: React.Key[]
    selectedRows: IEksNodeItem[]
  }>({
    selectedRowKeys: [],
    selectedRows: [],
  })
  const [labelFilters, setLabelFilters] = React.useState<IFilterByItem[]>([])
  const [currentListParams, setCurrentListParams] = React.useState<IAntdTableChangeParam>()
  const [batchActionType, setBatchAActionType] = React.useState<NodeAction>()

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [])
  const { refresh: refreshFlag } = state

  const listNodeFn = listFnWrapper(async (args) => {
    const { filterBy } = args
    const typeFilterBy = `status${FilterByOperator.EQUAL}${selectedType}`
    const labelSelector = labelFilters
      .map((item) => `${item.keyPath}${item.operator}${item.value}`)
      .join(',')

    const values = await eksNodeController_listNodes({
      ...args,
      clusterId,
      searchBy: searchValue,
      filterBy: filterBy ? `${filterBy};${typeFilterBy}` : `${typeFilterBy}`,
      labelSelector,
    })
    const { items, total, rolesList = [] } = values || {}
    setRolesList(rolesList)
    return {
      list: items || [],
      total: total || 0,
    }
  })

  const { tableProps, refreshAsync } = useTable(
    (param: IAntdTableChangeParam) => {
      setCurrentListParams(param)
      return listNodeFn(param)
    },
    {
      refreshDeps: [clusterId, searchValue, selectedType, labelFilters],
      reloadRate: 15000,
    },
  )

  useAsyncEffect(async () => {
    if (refreshFlag) {
      await refreshAsync()
      setIsBatchOperating(false)
      setSelectedRowState({
        selectedRowKeys: [],
        selectedRows: [],
      })
      dispatchers.finishRefresh()
    }
  }, [refreshFlag])

  const { pagination } = tableProps

  const nodeStatusConditionColumns = [
    {
      title: 'Type',
      dataIndex: 'meta',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      render: (reason: string) => reason || '-',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      render: (message: string) => message || '-',
    },
  ]

  const columns: ColumnsType<IEksNodeItem> = [
    {
      title: 'Node',
      dataIndex: 'nodeName',
      width: 148,
    },
    {
      title: 'Private IP',
      dataIndex: 'privateIp',
      render: (ip: string) => <div style={{ whiteSpace: 'nowrap' }}>{ip}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string, record) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          {status === NodeStatusTypes.PROVISIONING ? (
            <span style={{ marginLeft: '-8px' }}>
              <Icon component={ProvisioningSvg} style={{ marginRight: '8px' }} />
              {status}
            </span>
          ) : (
            <Badge color={nodeStatusColorMap[status]} text={status} />
          )}
          <StyledPopover
            title="Condition"
            content={
              <StyledStatusTable
                columns={nodeStatusConditionColumns}
                dataSource={record.condition}
                pagination={false}
                scroll={{ y: 350 }}
              />
            }
            placement="right"
            trigger="click"
          >
            <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 6 }} />
          </StyledPopover>
        </div>
      ),
    },
    {
      title: 'Scheduling Status',
      key: 'scheduling_status',
      dataIndex: 'schedulingStatus',
      render: (status: string) => (
        <span style={{ color: SchedulingStatusColorMap?.[status], whiteSpace: 'nowrap' }}>
          {status}
        </span>
      ),
      filters: [
        { text: 'Schedulabled', value: 'Schedulabled' },
        { text: 'SchedulingDisabled', value: 'SchedulingDisabled' },
      ],
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      filters: rolesList?.map((role) => ({
        text: role,
        value: role,
      })),
      render: (roles: string[]) => (
        <Space direction="vertical" size={4}>
          {roles.map((role) => (
            <div key={role} style={{ whiteSpace: 'nowrap' }}>
              {role}
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: 'Node Group',
      dataIndex: 'nodeGroupName',
    },
    {
      title: 'Labels',
      dataIndex: 'labels',
      render: (labels: ILabel[]) => (
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
      render: (taints: ITaint[]) => <Taint taints={taints} />,
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      render: (cpu: IEKsNodeMetricsSpec) => {
        const { allocatable = 0, allocated = 0 } = cpu
        return (
          <Progress
            header={`${allocated}/${allocatable} Cores`}
            percent={computePercent(allocated, allocatable)}
          />
        )
      },
    },
    {
      title: 'Memory',
      dataIndex: 'memory',
      render: (memory: IEKsNodeMetricsSpec) => {
        const { allocatable = 0, allocated = 0 } = memory
        return (
          <Progress
            header={`${allocated}/${allocatable} GiB`}
            percent={computePercent(allocated, allocatable)}
          />
        )
      },
    },
    {
      title: 'Pod',
      dataIndex: 'podSummary',
      render: (pod: IEKsNodeMetricsSpec) => {
        const { allocatable = 0, allocated = 0 } = pod
        return (
          <Progress
            header={`${allocated}/${allocatable} Pods`}
            percent={computePercent(allocated, allocatable)}
          />
        )
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="vertical" size={8}>
          <StyledButton
            type="link"
            onClick={() => handleNodeAction(NodeAction.LABEL, record)}
            disabled={isBatchOperating}
          >
            {NodeAction.LABEL}
          </StyledButton>
          <StyledButton
            type="link"
            onClick={() => handleNodeAction(NodeAction.TAINT, record)}
            disabled={isBatchOperating}
          >
            {NodeAction.TAINT}
          </StyledButton>
          <Dropdown
            overlay={
              <Menu
                items={NodeMoreActions.map((item) => ({
                  key: item,
                  label: item,
                  disabled: getActionDisableStatus(record, item),
                }))}
                onClick={(menuInfo) => handleNodeAction(menuInfo.key as NodeAction, record)}
              />
            }
            disabled={isBatchOperating}
            getPopupContainer={() => document.body}
          >
            <StyledButton type="link">
              More <IArrowDown />
            </StyledButton>
          </Dropdown>
        </Space>
      ),
    },
  ]

  const handleNodeAction = (type: NodeAction, record: IEksNodeItem) => {
    if (type === NodeAction.WEB_TERMINAL) {
      window.open(`https://toc.shopee.io/toolbox/web-term/${record.privateIp}`)
      return
    }
    dispatchers.enableEdit(type)
    dispatchers.updateSelectedNodes([record])
  }

  const handleSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: IEksNodeItem[]) => {
    setSelectedRowState({
      selectedRowKeys: newSelectedRowKeys,
      selectedRows: newSelectedRows,
    })
  }

  const handleDeleteLabel = (index: number) => {
    setLabelFilters(() => {
      labelFilters.splice(index, 1)
      return [...labelFilters]
    })
  }

  const handleGetBatchActionType = (action: NodeAction) => {
    setBatchAActionType(action)
  }
  const rowSelection = {
    selectedRowKeys: selectedRowState.selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: handleSelectChange,
    getCheckboxProps(record: IEksNodeItem) {
      return {
        disabled: getActionDisableStatus(record, batchActionType),
      }
    },
    selections: [
      {
        key: 'currentPage',
        text: 'Select Current page',
        onSelect: () => {
          setSelectedRowState({
            selectedRowKeys: tableProps.dataSource
              .filter((item) => getActionDisableStatus(item, batchActionType) !== true)
              ?.map((item) => item.nodeName + item.privateIp),
            selectedRows: tableProps.dataSource.filter(
              (item) => getActionDisableStatus(item, batchActionType) !== true,
            ),
          })
        },
      },
      {
        key: 'allPage',
        text: 'Select All Data',
        onSelect: async () => {
          const { list } = await listNodeFn({
            ...currentListParams,
            current: 0,
            pageSize: tableProps.pagination.total,
          })
          setSelectedRowState({
            selectedRowKeys: list
              .filter((item) => getActionDisableStatus(item, batchActionType) !== true)
              ?.map((item) => item.nodeName + item.privateIp),
            selectedRows: list.filter(
              (item) => getActionDisableStatus(item, batchActionType) !== true,
            ),
          })
        },
      },
      {
        key: 'none',
        text: 'Clear All Data',
        onSelect: () => {
          setSelectedRowState({
            selectedRowKeys: [],
            selectedRows: [],
          })
        },
      },
    ],
  }

  const selectedLabelFilersRender = (
    <StyledLabelFiltersContainer>
      <span>Selected labels :</span>
      {labelFilters?.map((item, index) => {
        const { keyPath, value, operator } = item
        const label = `${keyPath}${operator}${value}`
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Tag key={`${label}/${index}`} closable onClose={() => handleDeleteLabel(index)}>
            {label}
          </Tag>
        )
      })}
      <Button type="link" onClick={() => setLabelFilters([])}>
        Clear all
      </Button>
    </StyledLabelFiltersContainer>
  )

  return (
    <NodeContext.Provider value={{ state, dispatch }}>
      <Card style={{ margin: '24px' }}>
        <Row justify="space-between">
          <Col>
            <Radio.Group
              value={selectedType}
              onChange={(e: RadioChangeEvent) => setSelectedType(e.target.value)}
            >
              {Object.entries(typeCountMap).map(([type, count]) => (
                <Radio.Button key={type} value={type}>
                  <Space size={5}>
                    <span>{type}</span>
                    <span>{count}</span>
                  </Space>
                </Radio.Button>
              ))}
            </Radio.Group>
          </Col>
          <Col>
            <Space>
              <DebouncedSearch
                placeholder="Search Node/Private IP"
                callback={(value) => setSearchValue(value)}
                style={{ width: 264 }}
                debounceTime={500}
              />
              <LabelFilter labelFilters={labelFilters} onLabelFiltersChange={setLabelFilters} />
              <BatchAction
                isBatchOperating={isBatchOperating}
                onBatchOperatingStateChange={setIsBatchOperating}
                selectedRowState={selectedRowState}
                onSelectedRowStateChange={setSelectedRowState}
                containerElement={containerElement}
                handleGetBatchActionType={handleGetBatchActionType}
              />
              <AddNode clusterDetail={clusterDetail} />
            </Space>
          </Col>
        </Row>
        {labelFilters?.length > 0 && selectedLabelFilersRender}
        <StyledTable
          rowKey={(node: IEksNodeItem) => node.nodeName + node.privateIp}
          {...tableProps}
          columns={columns}
          style={{ marginTop: '16px', marginBottom: isBatchOperating ? '56px' : 'unset' }}
          scroll={{ x: 'max-content' }}
          pagination={{
            ...pagination,
            ...TABLE_PAGINATION_OPTION,
          }}
          rowSelection={isBatchOperating ? rowSelection : null}
        />
        <NodeActions clusterDetail={clusterDetail} />
      </Card>
    </NodeContext.Provider>
  )
}

export default NodeTable
