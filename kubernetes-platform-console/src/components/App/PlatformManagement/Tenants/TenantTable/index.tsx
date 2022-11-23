import React from 'react'

import { groupsControllerDeleteTenant, groupsControllerGetTenantList } from 'swagger-api/v3/apis/Tenants'
import { IITenantList } from 'swagger-api/v3/models'
import { ITenant } from 'api/types/tenant/tenant'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'

import { Table } from 'common-styles/table'
import { VerticalDivider } from 'common-styles/divider'
import { message, Modal } from 'infrad'
import CRUDDrawer from './CRUDDrawer'
import { StyledButton } from './style'

import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

interface IDrawProps {
  drawerVisible: boolean
  hideDrawer: () => void
  showDrawer: () => void
}

const TenantTable: React.FC<IDrawProps> = ({ drawerVisible, hideDrawer, showDrawer }) => {
  const [selectedTenantId, setSelectedTenantId] = React.useState<number>()
  const [selectedTenant, setSelectedTenant] = React.useState<ITenant>({} as ITenant)
  const [noticeModalVisible, setNoticeModalVisible] = React.useState<boolean>(false)

  const listTenantsFnWithResource = React.useCallback(args => {
    const { filterBy } = args || {}
    return groupsControllerGetTenantList({
      ...args,
      filterBy
    })
  }, [])

  const [listTenantsState, listTenantsFn] = useAsyncIntervalFn<IITenantList>(listTenantsFnWithResource)

  const { value, loading: tenantsLoading } = listTenantsState
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listTenantsFn })

  const { tenantList = [], totalCount = 0 } = value || {}

  const handleDeleteTenantClick = record => {
    const { id } = record
    setSelectedTenantId(id)
    setNoticeModalVisible(true)
  }

  const handleDeleteTenant = async () => {
    setNoticeModalVisible(false)
    try {
      await groupsControllerDeleteTenant({ tenantId: selectedTenantId })
      message.success('Successfully deleted tenant')

      const { current, pageSize } = pagination
      const num = pageSize * (current - 1)

      if (current > 1 && num === totalCount - 1) {
        refresh(false, { ...pagination, current: current - 1 })
      } else {
        refresh(false)
      }
    } catch (err) {
      err.message && message.error(err.message)
    }
  }

  const handleDeleteTenantSuccess = () => {
    setNoticeModalVisible(false)
  }

  // const handleEditTenantClick = record => {
  //   const { id, name } = record
  //   setSelectedTenant({ id, name })
  //   showDrawer()
  // }

  const onHideDrawer = () => {
    hideDrawer()
    setSelectedTenant({} as ITenant)
  }

  const accessControlContext = React.useContext(AccessControlContext)
  const tenantActions = accessControlContext[RESOURCE_TYPE.TENANT] || []
  // const canEditTenant = tenantActions.includes(RESOURCE_ACTION.Edit)
  const canDeleteTenant = tenantActions.includes(RESOURCE_ACTION.Delete)

  const tenantColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Tenant Name',
      dataIndex: 'name',
      key: 'name'
    },
    // {
    //   title: 'ENV',
    //   dataIndex: 'envs',
    //   key: 'envs',
    //   filters: envs.map((item: string) => ({ text: item, value: item })),
    //   render: envs => (envs ? envs.join(',') : '-')
    // },
    // {
    //   title: 'CID',
    //   dataIndex: 'cids',
    //   key: 'cids',
    //   filters: cids.map((item: string) => ({ text: item, value: item })),
    //   render: cids => (cids ? cids.join(',') : '-')
    // },
    // {
    //   title: 'Cluster',
    //   dataIndex: 'clusters',
    //   key: 'clusters',
    //   filters: clusters.map((item: string) => ({ text: item, value: item })),
    //   render: clusters => (clusters ? clusters.join(',') : '-')
    // },
    {
      title: 'Action',
      key: 'actions',
      render: (_, record: ITenant) => (
        <>
          {/* <StyledButton type='link' onClick={() => handleEditTenantClick(record)} disabled={!canEditTenant}>
            Edit
          </StyledButton> */}
          <VerticalDivider size='0' />
          <StyledButton type='link' onClick={() => handleDeleteTenantClick(record)} disabled={true || !canDeleteTenant}>
            Delete
          </StyledButton>
        </>
      )
    }
  ]

  React.useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <>
      <Table
        columns={tenantColumns}
        rowKey='id'
        dataSource={tenantList}
        loading={tenantsLoading}
        onChange={handleTableChange}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...pagination,
          total: totalCount
        }}
      />
      <CRUDDrawer
        visible={drawerVisible}
        onHideDrawer={onHideDrawer}
        onRefresh={refresh}
        selectedTenant={selectedTenant}
      />
      <Modal
        title='Notice'
        visible={noticeModalVisible}
        onOk={handleDeleteTenant}
        onCancel={handleDeleteTenantSuccess}
        okText='Yes'
        cancelText='No'
        getContainer={() => document.body}
      >
        Are you sure you want to delete this Tenant? All the resource will be removed.
      </Modal>
    </>
  )
}

export default TenantTable
