import React from 'react'
import { Card, Typography, Tag, Button, Modal, message, Row, Col, Dropdown, Menu } from 'infrad'
import { MenuInfo } from 'node_modules/rc-menu/lib/interface'
import { InfoCircleOutlined, IArrowDown } from 'infra-design-icons'
import { QuotaDiv, StyledProgress, PodMeta } from 'src/components/Deployment/PodList/style'
import { Table } from 'src/common-styles/table'
import {
  QUOTA_UNIT,
  NO_LIMIT_RESOURCE_TEXT,
  RUNNING_STATUS_MAP,
  ABNORMAL_STATUS_TEXT_MAP,
} from 'src/constants/deployment'
import { IModels } from 'src/rapper/request'
import { ColumnsType } from 'infrad/lib/table'
import { Params } from 'ahooks/lib/useAntdTable/types'
import { useSize, useAsyncEffect } from 'ahooks'
import useTable from 'src/hooks/useTable'
import {
  FilterTypes,
  getFilterItem,
  getFilterUrlParam,
  getTableProps,
} from 'src/helpers/tableProps'
import { fetch } from 'src/rapper'
import { TABLE_PAGINATION_OPTION } from 'src/constants/pagination'
import moment from 'moment'
import OperationBar from 'src/components/Common/OperationBar'
import DebouncedSearch from 'src/components/Common/DebouncedSearch'
import { tryCatch } from '@infra/utils'
import { DeploymentContext, getDispatchers } from 'src/components/Deployment/useDeploymentContext'
import { PodActions } from 'src/constants/pod'
import { Stdout } from 'src/components/Deployment/PodList/Action/Stdout'
import ViewFiles from 'src/components/Deployment/PodList/Action/ViewFiles'
import { ContainerEntryGuide } from 'src/components/Deployment/PodList/ContainerEntryGuide'

const { Paragraph, Text } = Typography

export type Pod =
  IModels['GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods']['Res']['items'][0]
interface IPodListProps {
  sduName: string
  deployId: string
  containerElement: HTMLElement
  env: string
}

const PodList: React.FC<IPodListProps> = ({ sduName, deployId, containerElement, env }) => {
  const [searchValue, setSearchValue] = React.useState('')
  const [statusList, setStatusList] = React.useState<string[]>([])
  const [selectedPod, setSelectedPod] = React.useState<Pod>()
  const [isBatchKillEditing, setIsBatchKillEditing] = React.useState(false)
  const [selectedRowState, setSelectedRowState] = React.useState<{
    selectRowKeys: React.Key[]
    selectRows: Pod[]
  }>({
    selectRowKeys: [],
    selectRows: [],
  })
  const [isLogsVisible, setLogsVisible] = React.useState(false)
  const [isFilesModalVisible, setFilesModalVisible] = React.useState(false)

  const { state, dispatch } = React.useContext(DeploymentContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { refresh: refreshFlag } = state

  const containerSize = useSize(containerElement)
  const { width: containerWidth = 0 } = containerSize || {}

  const { tableProps, loading, refreshAsync } = useTable(
    (args) =>
      getPodList(args, {
        deployId,
        sduName,
      }),
    {
      refreshDeps: [deployId, sduName, searchValue],
      reloadRate: 15000,
    },
  )

  useAsyncEffect(async () => {
    if (refreshFlag) {
      await refreshAsync()
      dispatchers.finishRefresh()
    }
  }, [refreshFlag])

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: Pod[]) => {
    setSelectedRowState({
      selectRowKeys: newSelectedRowKeys,
      selectRows: newSelectedRows,
    })
  }

  const rowSelection = {
    selectedRowState,
    preserveSelectedRowKeys: true,
    onChange: onSelectChange,
  }

  const handleCancelEdit = () => {
    setIsBatchKillEditing(false)
    setSelectedRowState({
      selectRowKeys: [],
      selectRows: [],
    })
  }

  const handleConfirmEdit = () => {
    Modal.confirm({
      title: 'Notification',
      icon: <InfoCircleOutlined style={{ color: '#2673DD' }} />,
      content: 'Are you sure to kill these pods ?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      async onOk() {
        const pods = selectedRowState.selectRows
        const [, error] = await tryCatch(
          fetch['POST/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods:batchKill']({
            sduName,
            deployId,
            pods,
          }),
        )
        if (!error) {
          void message.success('Successfully kill these pods')
          void refreshAsync()
        }
        handleCancelEdit()
      },
    })
  }

  const getPodList = async (
    { current, pageSize, filters, sorter }: Params[0],
    params: { deployId: string; sduName: string },
  ) => {
    const { deployId, sduName } = params
    const searchBy = getFilterUrlParam({
      searchValue: getFilterItem('searchValue', searchValue, FilterTypes.CONTAIN),
    })

    const { offset, limit, filterBy, orderBy } = getTableProps({
      pagination: { current, pageSize },
      filters,
      sorter,
    })

    const {
      items,
      total,
      statusList: statusListData,
    } = await fetch['GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods']({
      sduName,
      deployId,
      offset,
      limit,
      filterBy,
      orderBy,
      searchBy,
    })
    setStatusList(statusListData)
    return {
      list: items || [],
      total: total || 0,
    }
  }

  const { pagination } = tableProps

  const handleKillPod = (pod: Pod) => {
    const { podName, clusterName, namespace } = pod

    Modal.confirm({
      title: 'Notification',
      icon: <InfoCircleOutlined style={{ color: '#2673DD' }} />,
      content: `Are you sure to kill pod '${podName}'?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      async onOk() {
        const [, error] = await tryCatch(
          fetch['POST/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill']({
            sduName,
            deployId,
            podName,
            clusterName,
            namespace,
          }),
        )

        if (!error) {
          void message.success(`Successfully kill pod ${podName}`)
          void refreshAsync()
        }
      },
    })
  }

  const renderProgress = (usage: Pod['cpu'] | Pod['memory'], unit: string) => {
    if (!usage) {
      return <div>no data</div>
    }
    const { used, applied } = usage
    const isValid = isFinite(used / applied)
    const percent = isValid ? Math.floor((used / applied) * 100) : 0

    const quotaUsage =
      applied === 0 ? `${used} / ${NO_LIMIT_RESOURCE_TEXT}` : `${used} / ${applied} ${unit}`

    return (
      <div style={{ whiteSpace: 'nowrap' }}>
        <QuotaDiv>{quotaUsage}</QuotaDiv>
        <StyledProgress
          percent={percent}
          format={(percent) => `${percent > 500 ? '>500' : percent}%`}
          style={{ width: '100px' }}
        />
      </div>
    )
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const columns: ColumnsType<Pod> = [
    {
      title: 'Pod',
      dataIndex: 'podName',
      key: 'podName',
      render: (podName: string, record) => (
        <PodMeta>
          <div>{podName}</div>
          <div>
            Pod IP: <Paragraph copyable>{record.podIp}</Paragraph>
          </div>
          <div>
            Node IP: <Paragraph copyable>{record.nodeIp}</Paragraph>
          </div>
        </PodMeta>
      ),
    },
    {
      title: 'Strategy&Tag ',
      dataIndex: 'phase',
      key: 'phase',
      render: (phase: string, record) => (
        <Tag>
          {phase} | {record.tag}
        </Tag>
      ),
    },
    {
      title: 'Restarts',
      dataIndex: 'restartCount',
      key: 'restartCount',
    },
    {
      title: 'CPU Usage',
      dataIndex: 'cpu',
      key: 'cpu',
      render: (cpu: Pod['cpu']) => renderProgress(cpu, QUOTA_UNIT.CPU),
    },
    {
      title: 'MEM Usage',
      dataIndex: 'memory',
      key: 'memory',
      render: (memory: Pod['memory']) => renderProgress(memory, QUOTA_UNIT.MEMORY),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusList.map((item: string) => ({
        text: RUNNING_STATUS_MAP[item] || item,
        value: item,
      })),
      render: (status: string) => {
        const text = ABNORMAL_STATUS_TEXT_MAP[status] || status
        const isRunning = RUNNING_STATUS_MAP[status] !== undefined
        return (
          <div>
            {isRunning ? (
              <Tag color="green">{RUNNING_STATUS_MAP[status]}</Tag>
            ) : (
              <>
                <Tag color="red">Abnormal</Tag>
                <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
                  {text}
                </Text>
              </>
            )}
          </div>
        )
      },
    },
    {
      title: 'Create Time',
      dataIndex: 'createdTime',
      key: 'createdTime',
      sorter: true,
      render: (time: number) => moment(time * 1000).format('YYYY/MM/DD HH:mm:ss'),
    },
    {
      title: 'Action',
      render: (_, record) => {
        const menu = (
          <Menu
            items={Object.values(PodActions).map((action) => ({
              key: action,
              label: action,
            }))}
            onClick={(menuInfo) => handleMenuClick(menuInfo, record)}
          />
        )
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="link"
              style={{ padding: '0 16px 0 0' }}
              onClick={() => handleKillPod(record)}
              disabled={isBatchKillEditing}
            >
              Kill
            </Button>
            <Dropdown overlay={menu}>
              <Button
                type="link"
                onClick={(e) => e.preventDefault()}
                style={{ whiteSpace: 'nowrap' }}
              >
                More
                <IArrowDown />
              </Button>
            </Dropdown>
          </div>
        )
      },
    },
  ]

  const operationBarMargin = 24
  const operationBarWidth = containerWidth ? containerWidth - 2 * operationBarMargin : 0
  const bulkKillPodSelectedCount = selectedRowState.selectRowKeys.length

  const handleMenuClick = (menuInfo: MenuInfo, pod: Pod) => {
    setSelectedPod(pod)
    switch (menuInfo.key) {
      case PodActions.STDOUT_STDERR:
        setLogsVisible(true)
        break
      case PodActions.VIEW_FILES:
        setFilesModalVisible(true)
      default:
        break
    }
  }

  return (
    <div style={{ position: 'relative', marginBottom: '56px' }}>
      <Card style={{ marginTop: '16px' }}>
        <Row justify="space-between">
          <Col>
            <DebouncedSearch
              callback={handleSearchChange}
              placeholder={'Input Instance Name/IP…'}
              debounceTime={300}
              style={{ width: '264px', marginBottom: '16px' }}
              disabled={isBatchKillEditing}
            />
          </Col>
          <Col>
            <ContainerEntryGuide env={env} sduName={sduName} />
            <Button
              type="primary"
              onClick={() => setIsBatchKillEditing(true)}
              disabled={isBatchKillEditing}
            >
              Bulk Kill
            </Button>
          </Col>
        </Row>

        <Table
          {...tableProps}
          rowKey="podName"
          columns={columns}
          loading={loading}
          rowSelection={isBatchKillEditing ? rowSelection : null}
          pagination={{
            ...TABLE_PAGINATION_OPTION,
            ...pagination,
          }}
          scroll={{ x: '100%' }}
        />
      </Card>
      <ViewFiles
        visible={isFilesModalVisible}
        onModalVisibleChange={setFilesModalVisible}
        sduName={sduName}
        deployId={deployId}
        podData={selectedPod}
      />
      <OperationBar
        visible={isBatchKillEditing}
        onSubmit={handleConfirmEdit}
        onCancel={handleCancelEdit}
        selectedCount={bulkKillPodSelectedCount}
        parent={containerElement}
        style={{
          position: 'absolute',
          bottom: 0,
          width: `${operationBarWidth}px`,
          margin: `0 ${operationBarMargin}px`,
        }}
        disabled={bulkKillPodSelectedCount === 0}
      />
      <Stdout
        sduName={sduName}
        deployId={deployId}
        isLogsVisible={isLogsVisible}
        onLogsVisibleChange={setLogsVisible}
        selectedPod={selectedPod}
      />
    </div>
  )
}

export default PodList
