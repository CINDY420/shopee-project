import React from 'react'
import {
  StyledButton,
  StyledRoot,
} from 'components/App/ClusterManagement/ClusterDetail/Content/style'
import { CommonStyledCard } from 'common-styles/card'
import TableSearchInput from 'components/Common/TableSearchInput'
import { Table } from 'common-styles/table'
import { Dropdown, Form, Menu, message, Modal } from 'infrad'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { ColumnsType } from 'infrad/lib/table'
import { INodeListItem, IListNodesResponse } from 'swagger-api/models'
import CrudModal from 'components/Common/CrudModal'
import LabelsModalForm from 'components/App/ClusterManagement/ClusterDetail/Content/LabelsModalForm'
import TaintModalForm from 'components/App/ClusterManagement/ClusterDetail/Content/TaintModalForm'
import { nodeControllerListNodes, nodeControllerUpdateNode } from 'swagger-api/apis/Node'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/useAntdTable'
import { useDebounce } from 'react-use'
import { ExclamationCircleOutlined } from 'infra-design-icons'
import { useParams } from 'react-router'
import { ITableParams } from 'types/table'
import { NODE_ACTIONS } from 'constants/node'

enum ACTION_TYPE {
  LABEL = 'Label(s)',
  TAINT = 'Taint',
}
enum ACTIONS {
  ADD = 'Add',
  EDIT = 'Edit',
  DELETE = 'Delete',
}

const { confirm } = Modal

const Content = () => {
  const { clusterId } = useParams()
  const [searchValue, setSearchValue] = React.useState<string>()
  const [visibleModalName, setVisibleModalName] = React.useState<string>('')
  const [modalTitle, setModalTitle] = React.useState<string>('')
  const [isEditingModal, setIsEditingModal] = React.useState<boolean>(false)
  const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false)
  const [currentNodeDetail, setCurrentNodeDetail] = React.useState<INodeListItem>()

  const [labelsForm] = Form.useForm()
  const [taintForm] = Form.useForm()

  const listNodes = React.useCallback(
    (tableQueryParams: ITableParams) => {
      if (clusterId) {
        return nodeControllerListNodes({
          ...tableQueryParams,
          searchBy: searchValue,
          clusterId,
        })
      }
    },
    [searchValue, clusterId],
  )

  const [listNodesState, listNodesFn] = useAsyncIntervalFn<IListNodesResponse>(listNodes)
  const { value, loading: isLoadingListNodes } = listNodesState

  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: listNodesFn,
  })
  const { items: nodeList = [], total = 0 } = value || {}

  useDebounce(
    () => {
      searchValue !== undefined && refresh()
    },
    500,
    [searchValue],
  )

  const handleLabelsOrTaintDelete = (type: ACTION_TYPE, record: INodeListItem) => {
    const payload =
      type === ACTION_TYPE.LABEL
        ? { labels: record.labels, action: NODE_ACTIONS.DELETE }
        : { taints: record.taints, action: NODE_ACTIONS.DELETE }
    confirm({
      title: `Do you want to delete ${type}?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        if (clusterId) {
          try {
            await nodeControllerUpdateNode({ clusterId, nodeId: record.nodeId, payload })
            message.success('Delete successfully!')
            refresh()
          } catch (error) {
            console.error('error handleLabelsOrTaintDelete:', error)
            message.error(error?.message || 'Delete failed!')
          }
        }
      },
    })
  }

  const handleMenuClick = (key: string, type: ACTION_TYPE, record: INodeListItem) => {
    setCurrentNodeDetail(record)
    if (key === ACTIONS.DELETE) {
      handleLabelsOrTaintDelete(type, record)
      return
    }

    setIsEditingModal(key === ACTIONS.EDIT)
    setModalTitle(`${key} ${type}`)
    setVisibleModalName(type)
  }

  const handleModalCancel = () => {
    setVisibleModalName('')
    setModalTitle('')
    setIsSubmitLoading(false)
    visibleModalName === ACTION_TYPE.LABEL ? labelsForm.resetFields() : taintForm.resetFields()
  }

  const handleLabelsModalSubmit = async () => {
    if (clusterId) {
      const { nodeId, labels } = await labelsForm.validateFields()
      setIsSubmitLoading(true)
      try {
        const payload = { labels, action: isEditingModal ? NODE_ACTIONS.UPDATE : NODE_ACTIONS.ADD }
        await nodeControllerUpdateNode({ clusterId, nodeId, payload })
        handleModalCancel()
        message.success('Change labels successfully!')
        refresh()
      } catch (error) {
        console.error('error handleLabelsModalSubmit:', error)
        handleModalCancel()
        message.error(error?.message || 'Change labels failed!')
      }
    }
  }

  const handleTaintModalSubmit = async () => {
    if (clusterId) {
      const { nodeId, taints } = await taintForm.validateFields()
      setIsSubmitLoading(true)
      try {
        const payload = { taints, action: isEditingModal ? NODE_ACTIONS.UPDATE : NODE_ACTIONS.ADD }
        await nodeControllerUpdateNode({ clusterId, nodeId, payload })
        handleModalCancel()
        message.success('Change labels successfully!')
        refresh()
      } catch (error) {
        console.error('error handleTaintModalSubmit:', error)
        handleModalCancel()
        message.error(error?.message || 'Change labels failed!')
      }
    }
  }

  const getMenu = (type: ACTION_TYPE, record: INodeListItem) => (
    <Menu onClick={({ key }) => handleMenuClick(key, type, record)}>
      <Menu.Item key={ACTIONS.EDIT}>{ACTIONS.EDIT}</Menu.Item>
      <Menu.Item key={ACTIONS.ADD}>{ACTIONS.ADD}</Menu.Item>
      {type === ACTION_TYPE.TAINT && (
        <Menu.Item key={ACTIONS.DELETE} disabled={record.taints.length === 0}>
          {ACTIONS.DELETE}
        </Menu.Item>
      )}
    </Menu>
  )

  const columns: ColumnsType<INodeListItem> = [
    {
      title: 'Node Name',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: 'Node IP',
      dataIndex: 'nodeIp',
      width: 80,
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      render: (roles: INodeListItem['roles']) => roles?.join(', '),
      width: 100,
    },
    {
      title: 'Labels',
      dataIndex: 'labels',
      width: 150,
      render: (labels: INodeListItem['labels']) =>
        labels.map((item) => (
          <div key={item.key}>
            {item.key}={item.value}
          </div>
        )),
    },
    {
      title: 'Taint',
      dataIndex: 'taints',
      width: 120,
      render: (taints: INodeListItem['taints']) => {
        if (taints.length === 0) return 'No Taint'
        return taints.map((item) => (
          <span key={item.key}>
            <div>key={item.key}</div>
            <div>value={item.value}</div>
            <div>effect={item.effect}</div>
          </span>
        ))
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 120,
      render: (_, record) => (
        <>
          <Dropdown overlay={getMenu(ACTION_TYPE.LABEL, record)} arrow>
            <StyledButton type="link">Label</StyledButton>
          </Dropdown>
          <Dropdown overlay={getMenu(ACTION_TYPE.TAINT, record)} arrow>
            <StyledButton type="link">Taint</StyledButton>
          </Dropdown>
        </>
      ),
    },
  ]

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  return (
    <StyledRoot>
      <CommonStyledCard title="Node List">
        <TableSearchInput
          placeholder="Search Node..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <Table
          rowKey="nodeId"
          columns={columns}
          dataSource={nodeList}
          loading={isLoadingListNodes}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            ...TABLE_PAGINATION_OPTION,
            total,
          }}
        />
        {/* Labels modal */}
        <CrudModal
          visible={visibleModalName === ACTION_TYPE.LABEL}
          title={modalTitle}
          width={1024}
          isSubmitLoading={isSubmitLoading}
          onOk={handleLabelsModalSubmit}
          onCancel={handleModalCancel}
          destroyOnClose
        >
          <LabelsModalForm
            form={labelsForm}
            currentNodeDetail={currentNodeDetail}
            isEditingModal={isEditingModal}
          />
        </CrudModal>

        {/* Taint modal */}
        <CrudModal
          visible={visibleModalName === ACTION_TYPE.TAINT}
          title={modalTitle}
          width={1024}
          isSubmitLoading={isSubmitLoading}
          onOk={handleTaintModalSubmit}
          onCancel={handleModalCancel}
          destroyOnClose
        >
          <TaintModalForm
            form={taintForm}
            currentNodeDetail={currentNodeDetail}
            isEditingModal={isEditingModal}
          />
        </CrudModal>
      </CommonStyledCard>
    </StyledRoot>
  )
}

export default Content
