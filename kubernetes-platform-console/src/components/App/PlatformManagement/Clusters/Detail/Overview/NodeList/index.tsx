import * as React from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { Typography, Tag, Modal, message, Tooltip } from 'infrad'
import {
  CheckCircleOutlined,
  QuestionCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleFilled
} from 'infra-design-icons'

import NodeListHeader from './Header'
import Actions from './Actions'
import Drawer from './Drawer'

import Collapse from 'components/App/PlatformManagement/Clusters/Common/TaintCollapse'
import BatchOperations from 'components/Common/BatchOperations'
import ProgressBar, { IProgressBarProps } from 'components/App/PlatformManagement/Clusters/Common/ProgressBar'

import { NODE_STATUS } from 'constants/cluster'
import { danger, success, grey } from 'constants/colors'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncFn from 'hooks/useAsyncFn'

import { throttle } from 'helpers/functionUtils'
import { formatDataFromByteToGib } from 'helpers/format'
import { columnSorterEnhancer } from 'helpers/pagination'
import { getFilterUrlParam, getFilterItem, filterTypes } from 'helpers/queryParams'

import { selectedCluster } from 'states/clusterState'

import { putClusterNodeActions } from 'helpers/api'
import { nodesControllerListNodes } from 'swagger-api/v3/apis/Nodes'
import { globalControllerGetMetaData } from 'swagger-api/v3/apis/Global'
import { IIMetadataResponse } from 'swagger-api/v3/models'

import {
  Key,
  TaintWrapper,
  TaintValueWrapper,
  StyledTag,
  StatusTextWrapper,
  TableWrapper,
  StyledPopover
} from './style'
import { Table } from 'common-styles/table'
import { StyledTitle } from 'common-styles/title'
import ColorWrapper from 'common-styles/colorWrapper'
import { HorizonCenterWrapper } from 'common-styles/flexWrapper'
import { Link } from 'react-router-dom'
import { buildNodeDetailRoute } from 'constants/routes/routes'

const { Text } = Typography

const StyledName = styled.div`
  min-width: 200px;
  .name {
    font-weight: 500;
    font-size: 16px;
  }
  a {
    color: #333;
  }
`

const { confirm } = Modal

const colorMap = {
  [NODE_STATUS.READY]: success,
  [NODE_STATUS.NOT_READY]: danger,
  [NODE_STATUS.UNKNOWN]: grey
}

const handleNodeActionConfirm = ({
  type,
  nodes,
  result,
  onOk,
  submitCallback = null,
  cancelCallback = null,
  setIsConfirming
}) => {
  const length = nodes.length
  const nodeName = length > 1 ? `${nodes[0]} and ${length - 1} more nodes` : nodes[0]
  const moreContent = type === 'Drain' ? `${type} will cordon the node and mark it unschedulable. ` : ''
  confirm({
    icon: <QuestionCircleFilled />,
    title: `${type} the node '${nodeName}'?`,
    content: `${moreContent}This operation cannot be canceled.`,
    okText: 'Confirm',
    centered: true,
    onOk() {
      if (onOk) {
        onOk(type, result, submitCallback)
      }
      setIsConfirming(false)
    },
    onCancel() {
      if (cancelCallback) {
        cancelCallback()
      }
      setIsConfirming(false)
    }
  })
}

const handleNodeSelection = (node, record, selected) => {
  const { name } = record
  if (selected) {
    if (node.indexOf(name) < 0) {
      node.push(name)
    }
  } else {
    node.splice(node.indexOf(name), 1)
  }
}

const getActionResultNodes = (nodes: string[]) => {
  if (!nodes) return 'no node'
  const length = nodes.length
  if (length > 0) {
    return `node${nodes.length > 1 ? 's' : ''} ${nodes.toString()}`
  } else {
    return 'no node'
  }
}

interface IUsage {
  capacity: number
  used: number
  status: string
}

interface IProps {
  isDeleting: boolean
}

const NodeList: React.FC<IProps> = ({ isDeleting }) => {
  const [nameOrder, setNameOrder] = React.useState()
  const [searchVal, setSearchVal] = React.useState('')
  const [statusFilters, setStatusFilters] = React.useState([])
  const [rolesFilters, setRolesFilters] = React.useState([])
  const [offset, setOffset] = React.useState(0)
  const [isConfirming, setIsConfirming] = React.useState(false)
  const [metaData, setMetadata] = React.useState<IIMetadataResponse>({
    roles: [],
    statuses: []
  })

  const [actionType, setActionType] = React.useState('Label')
  const [actionNodes, setActionNodes] = React.useState([])
  const [isDrawerVisible, setIsDrawerVisible] = React.useState(false)
  const [isBatchSelectVisible, setIsBatchSelectVisible] = React.useState(false)
  const [isBatch, setIsBatch] = React.useState(false)
  const [, getMetadataFn] = useAsyncFn(globalControllerGetMetaData)

  const [selectedClusterNodeState, getSelectedClusterNodeFn, setStartIntervalCallback] = useAsyncIntervalFn(
    nodesControllerListNodes,
    {
      enableIntervalCallback: !isDeleting
    }
  )
  const [, putClusterNodeActionsFn] = useAsyncIntervalFn(putClusterNodeActions)
  const { nodes = [], totalCount = 0 } = selectedClusterNodeState.value || {}

  const currentSelectedCluster = useRecoilValue(selectedCluster)
  const { name: clusterId } = currentSelectedCluster

  const fetchFn = React.useCallback(
    args => {
      const { filterBy } = args || {}

      const extraFilterBy = getFilterUrlParam(
        {
          name: getFilterItem('name', searchVal, filterTypes.contain),
          IP: getFilterItem('IP', searchVal, filterTypes.contain)
        },
        { or: true }
      )

      getSelectedClusterNodeFn({
        ...args,
        clusterName: clusterId,
        filterBy: filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy
      })

      if (offset !== args.offset) {
        setOffset(args.offset)
      } else {
        setActionNodes([])
      }
    },
    [clusterId, getSelectedClusterNodeFn, offset, searchVal]
  )

  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: fetchFn
  })

  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    throttledRefresh()
  }, [searchVal, throttledRefresh])

  const refreshTableFilters = React.useCallback(() => {
    if (metaData.statuses) {
      setStatusFilters(Object.values(metaData.statuses).map(val => ({ text: val, value: val })))
    }
    if (metaData.roles) {
      setRolesFilters(Object.values(metaData.roles).map(val => ({ text: val, value: val })))
    }
  }, [metaData])

  const getMetaData = React.useCallback(async () => {
    const res = await getMetadataFn()
    setMetadata(res)
  }, [getMetadataFn])

  React.useEffect(() => {
    getMetaData()
  }, [getMetaData])

  React.useEffect(() => {
    refreshTableFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaData])

  const renderProgress = ({ capacity, used, status, unit, formatDataFn }: IProgressBarProps) => {
    return (
      <ProgressBar
        used={used}
        capacity={capacity}
        status={status}
        unit={unit}
        style={{ width: '150px' }}
        formatDataFn={formatDataFn}
      />
    )
  }

  const renderPodState = (status, color) => {
    switch (status) {
      case NODE_STATUS.UNKNOWN:
        return <QuestionCircleOutlined color={color} />
      case NODE_STATUS.NOT_READY:
        return <ExclamationCircleOutlined color={color} />
      default:
        return <CheckCircleOutlined color={color} />
    }
  }

  const handleConfirm = async (type, result, submitCallback?) => {
    const res = await putClusterNodeActionsFn({
      actionType: type.toLowerCase(),
      clusterName: clusterId,
      actionConfig: result
    })
    message.success(
      `Submit Successfully! With ${getActionResultNodes(res.success)} success, With ${getActionResultNodes(
        res.fail
      )} failed.`
    )
    setActionNodes([])
    closeDrawer()
    if (submitCallback) {
      submitCallback()
    }
  }

  const handleActions = (type, isBatch, nodeName?) => {
    setActionType(type)
    setIsBatch(isBatch)
    if (isBatch) {
      setActionNodes([])
      setIsBatchSelectVisible(true)
    } else {
      triggerAction(type, isBatch, [nodeName])
      setActionNodes([nodeName])
    }
  }

  const triggerAction = (type, isBatch, nodeNames) => {
    switch (type) {
      case 'Taint':
      case 'Label':
        setIsDrawerVisible(true)
        break
      default:
        setIsConfirming(true)
        handleNodeActionConfirm({
          type,
          nodes: nodeNames,
          result: { nodes: nodeNames },
          onOk: handleConfirm,
          cancelCallback: () => {
            cancelActionsHandler()
          },
          setIsConfirming
        })
    }
  }

  const closeDrawer = () => {
    setIsDrawerVisible(false)
  }

  const cancelActionsHandler = () => {
    if (isBatch) {
      setIsBatchSelectVisible(true)
    } else {
      setActionNodes([])
    }
  }

  const columns = [
    columnSorterEnhancer(
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name: string, { IP, cluster }: { IP: string; cluster: string }) => (
          <StyledName>
            <Link to={buildNodeDetailRoute({ nodeName: name, clusterName: cluster })}>
              <span className='name'>{name}</span>
            </Link>
            <br />
            <Text type='secondary'>Node IP:{IP}</Text>
          </StyledName>
        )
      },
      nameOrder,
      setNameOrder
    ),
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusFilters,
      render: (status: string, { statusExtra = [] }: { statusExtra: [] }) => {
        const color: string = colorMap[status]

        return color ? (
          <ColorWrapper color={color}>
            <HorizonCenterWrapper>
              {renderPodState(status, color)}
              <StatusTextWrapper>
                {status}
                {statusExtra.map(status => `, ${status}`)}
              </StatusTextWrapper>
            </HorizonCenterWrapper>
          </ColorWrapper>
        ) : null
      }
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      filters: rolesFilters,
      render: (roles: string[]) =>
        roles.map((role, index) => (
          <Tag color='blue' key={index}>
            {role}
          </Tag>
        ))
    },
    {
      title: 'Labels',
      dataIndex: 'labels',
      key: 'labels',
      render: (labels: string[]) => {
        if (labels) {
          return Object.keys(labels).map(key => {
            const content = `${key}=${labels[key]}`
            return (
              <StyledPopover content={content} key={key}>
                <StyledTag>{content}</StyledTag>
              </StyledPopover>
            )
          })
        }
      }
    },
    {
      title: 'Taints',
      dataIndex: 'taints',
      key: 'taints',
      render: (taints: []) => {
        const length = taints ? taints.length : 0
        return length ? (
          <Collapse
            needMore={length > 1}
            panel={taints.map((taint, index) => (
              <TaintWrapper key={index} isLast={index === length - 1}>
                {Object.keys(taint).map((obj, idx) => {
                  const content: string = taint[obj]
                  return (
                    <Tooltip title={content.length > 14 ? content : ''} key={idx}>
                      <TaintValueWrapper>
                        <Key>{obj}:</Key> {content || '-'}
                      </TaintValueWrapper>
                    </Tooltip>
                  )
                })}
              </TaintWrapper>
            ))}
          ></Collapse>
        ) : (
          'No Taint'
        )
      }
    },
    {
      title: 'CPU',
      dataIndex: 'cpuMetrics',
      key: 'cpuMetrics',
      render: (cpuMetrics: IUsage) => renderProgress({ ...cpuMetrics, unit: 'Cores' })
    },
    {
      title: 'Memory',
      dataIndex: 'memMetrics',
      key: 'memMetrics',
      render: (memMetrics: IUsage) =>
        renderProgress({ ...memMetrics, unit: 'GiB', formatDataFn: formatDataFromByteToGib })
    },
    {
      title: 'Pods',
      dataIndex: 'podMetrics',
      key: 'podMetrics',
      render: (podMetrics: IUsage) => (
        <div>
          {podMetrics.used}/{podMetrics.capacity}
        </div>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'name',
      key: 'actions',
      render: name => {
        return <Actions onAction={handleActions} nodeName={name} />
      }
    }
  ]

  const handleSelect = (record, selected) => {
    const node = [...actionNodes]
    handleNodeSelection(node, record, selected)
    setActionNodes(node)
  }

  const handleSelectAll = (selected, records, changeRows) => {
    const node = [...actionNodes]
    changeRows.forEach(record => {
      if (record) {
        handleNodeSelection(node, record, selected)
      }
    })
    setActionNodes(node)
  }

  React.useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterId])

  React.useEffect(() => {
    if (isBatchSelectVisible || isDrawerVisible || isConfirming) {
      setStartIntervalCallback(false)
    } else {
      setStartIntervalCallback(true)
    }
  }, [isBatchSelectVisible, isDrawerVisible, isConfirming, setStartIntervalCallback])

  return (
    <div>
      <StyledTitle>Node List</StyledTitle>
      <NodeListHeader
        onAction={handleActions}
        batchDisabled={isBatchSelectVisible}
        onSearch={setSearchVal}
        searchVal={searchVal}
      />
      <TableWrapper>
        <Table
          rowKey='name'
          loading={selectedClusterNodeState.loading}
          columns={columns}
          dataSource={nodes}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            ...TABLE_PAGINATION_OPTION,
            total: totalCount
          }}
          getPopupContainer={triggerNode => triggerNode}
          rowSelection={
            isBatchSelectVisible
              ? { selectedRowKeys: actionNodes, onSelect: handleSelect, onSelectAll: handleSelectAll }
              : null
          }
        />
      </TableWrapper>
      <Drawer
        visible={isDrawerVisible}
        type={actionType}
        closeDrawer={closeDrawer}
        nodeNames={actionNodes}
        onCancel={cancelActionsHandler}
        onSubmit={(result, submitCallback) => {
          setIsConfirming(true)
          handleNodeActionConfirm({
            type: actionType,
            nodes: actionNodes,
            result,
            onOk: handleConfirm,
            submitCallback,
            setIsConfirming
          })
        }}
      />
      <BatchOperations
        title={'Batch-' + actionType}
        visible={isBatchSelectVisible}
        selectedCount={actionNodes.length}
        onSubmit={() => {
          setIsBatchSelectVisible(false)
          triggerAction(actionType, isBatch, actionNodes)
        }}
        onCancel={() => {
          setIsBatchSelectVisible(false)
          setActionNodes([])
        }}
        disabled={actionNodes.length < 1}
      />
    </div>
  )
}

export default NodeList
