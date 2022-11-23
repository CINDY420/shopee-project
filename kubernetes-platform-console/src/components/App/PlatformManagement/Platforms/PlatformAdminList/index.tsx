import React, { useState, useEffect } from 'react'

import {
  roleControllerGetGlobalUserList,
  roleControllerGetGlobalBotList,
  roleControllerGetTenantPermissionGroups
} from 'swagger-api/v3/apis/UserRole'

import { groupsControllerDeleteTenantUser, groupsControllerDeleteTenantBot } from 'swagger-api/v3/apis/Tenants'

import { ITenantUserList, ITenantBotList, IUser, IRole } from 'api/types/application/group'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'

import { Table } from 'common-styles/table'
import { VerticalDivider } from 'common-styles/divider'
import { StyledForm } from 'common-styles/form'
import { Modal, message, Popover, Select } from 'infrad'
import { AddUserDrawer, EditUserDrawer, SessionKeyDrawer } from 'components/Common/UserAndBotDrawer'

import { REFRESH_RATE } from 'constants/time'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { UserType, AddUserType } from 'constants/rbacActions'
import { PLATFORM_ADMIN_ID, RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

import userSvg from 'assets/user.svg'
import botSvg from 'assets/bot.svg'
import { AccessControlContext } from 'hooks/useAccessControl'
import { getFilterUrlParam, filterTypes } from 'helpers/queryParams'

import { StyledTag, StyledImg, StyledButton } from './style'

const { Item } = StyledForm
const { Option } = Select

interface IDrawProps {
  drawerVisible: boolean
  searchValue: string
  hideDrawer: () => void
  selectedUserType: UserType
}

interface ISelectedUser {
  name: string
  id: number
  email: string
  roleId: number
  detail?: string
}

const dataSourceApiMap = {
  [UserType.USER]: roleControllerGetGlobalUserList,
  [UserType.BOT]: roleControllerGetGlobalBotList
}

const deleteUserApisMap = {
  [AddUserType.HUMAN]: async ({ tenantId, id }) => {
    return await groupsControllerDeleteTenantUser({ tenantId, userId: id })
  },
  [AddUserType.BOT]: async ({ tenantId, id }) => {
    return await groupsControllerDeleteTenantBot({ tenantId, botId: id })
  }
}

const PlatformAdminList: React.FC<IDrawProps> = ({ searchValue, drawerVisible, hideDrawer, selectedUserType }) => {
  const [selectedUser, setSelectedUser] = useState<ISelectedUser>()
  const [clickedUserType, setClickedUserType] = useState<AddUserType>(AddUserType.HUMAN)
  const [deleteUserType, setDeleteUserType] = useState<AddUserType>()
  const [noticeModalVisible, setNoticeModalVisible] = useState<boolean>(false)
  const [editDrawerVisible, setEditDrawerVisible] = useState<boolean>(false)
  const [sessionKeyDrawer, setSessionKeyDrwer] = useState<boolean>(false)
  const [permissionGroups, setPermissionGroups] = React.useState<IRole[]>([])

  const fetchPermissionGroupList = async () => {
    const result = await roleControllerGetTenantPermissionGroups({ tenantId: 0 })
    const { roles = [] } = result || {}
    setPermissionGroups(roles)
  }

  React.useEffect(() => {
    fetchPermissionGroupList()
  }, [])

  const accessControlContext = React.useContext(AccessControlContext)
  const globalUserActions = accessControlContext[RESOURCE_TYPE.GLOBAL_USER] || []
  const globalBotActions = accessControlContext[RESOURCE_TYPE.GLOBAL_BOT] || []

  const canDeleteUser = globalUserActions.includes(RESOURCE_ACTION.Delete)
  const canEditBot = globalBotActions.includes(RESOURCE_ACTION.Edit)
  const canDeleteBot = globalBotActions.includes(RESOURCE_ACTION.Delete)

  const dataSourceApi = dataSourceApiMap[selectedUserType]
  const listUsersFnWithResource = React.useCallback(
    args => {
      const { filterBy, ...others } = args || {}
      const extraFilterBy = getFilterUrlParam({
        name: { key: 'all', value: searchValue, type: filterTypes.contain }
      })
      return dataSourceApi({
        filterBy: filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy,
        ...others
      })
    },
    [dataSourceApi, searchValue]
  )

  const [listUsersState, listUsersFn] = useAsyncIntervalFn<ITenantUserList | ITenantBotList>(listUsersFnWithResource, {
    enableIntervalCallback: false,
    refreshRate: REFRESH_RATE
  })
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listUsersFn })
  const { tenantUsers = [], tenantBots = [], totalSize = 0 } = (listUsersState.value as any) || {}

  const dataSourceMap = {
    [UserType.USER]: tenantUsers,
    [UserType.BOT]: tenantBots
  }

  const handleDeleteHumanClick = record => {
    const {
      roleId,
      user: { name, userId: id, email }
    } = record || {}
    setSelectedUser({ id, name, roleId, email })
    setDeleteUserType(AddUserType.HUMAN)
    setNoticeModalVisible(true)
  }
  const handleDeleteBotClick = record => {
    const {
      roleId,
      bot: { id, name, detail, email }
    } = record || {}
    setSelectedUser({ id, name, roleId, detail, email })
    setDeleteUserType(AddUserType.BOT)
    setNoticeModalVisible(true)
  }

  const handleDeleteUser = async () => {
    setNoticeModalVisible(false)
    const { id } = selectedUser
    try {
      const deleteUserApi = deleteUserApisMap[deleteUserType]
      await deleteUserApi({ tenantId: 0, id })
      message.success('Successfully deleted user')

      const { current, pageSize } = pagination
      const num = pageSize * (current - 1)

      if (current > 1 && num === totalSize - 1) {
        refresh(false, { ...pagination, current: current - 1 })
      } else {
        refresh(false)
      }
    } catch (err) {
      err.message && message.error(err.message)
    }
    refresh()
  }

  const handleDeleteUserSuccess = () => {
    setNoticeModalVisible(false)
  }

  const showEditDrawer = () => setEditDrawerVisible(true)
  const hideEditDrawer = () => setEditDrawerVisible(false)

  const handleEditBot = record => {
    const {
      roleId,
      bot: { id, name, detail, email }
    } = record || {}
    setSelectedUser({ id, name, roleId, detail, email })
    setClickedUserType(AddUserType.BOT)
    showEditDrawer()
  }

  const handleGenerateSessionKeyClick = record => {
    const {
      roleId,
      bot: { id, name, detail, email }
    } = record || {}
    setSelectedUser({ id, name, roleId, email, detail })
    setSessionKeyDrwer(true)
  }

  const hideGenerateSessionKeyDrawer = () => {
    setSessionKeyDrwer(false)
  }

  const permissionGroupFilters = permissionGroups.map(({ name, id }) => ({ text: name, value: id }))

  const userColumns: any = [
    {
      title: 'User ID',
      dataIndex: ['user', 'userId']
    },
    {
      title: 'User Name',
      dataIndex: ['user', 'name'],
      render: user => <StyledTag icon={<StyledImg src={userSvg} />}>{user}</StyledTag>
    },
    {
      title: 'User Email',
      dataIndex: ['user', 'email']
    },
    {
      title: 'Permission Group',
      dataIndex: 'roleName',
      key: 'roleName',
      filters: permissionGroupFilters
    }
  ]
  const botColumns: any = [
    {
      title: 'Bot ID',
      dataIndex: ['bot', 'id']
    },
    {
      title: 'Bot Name',
      dataIndex: ['bot', 'name'],
      render: bot => <StyledTag icon={<StyledImg src={botSvg} />}>{bot}</StyledTag>
    },
    {
      title: 'Permission Group',
      dataIndex: 'roleName',
      filters: permissionGroupFilters
    },
    {
      title: 'Description',
      dataIndex: ['bot', 'detail']
    },
    {
      title: 'Action',
      key: 'actions',
      render: (_, record) => (
        <>
          <StyledButton type='link' onClick={() => handleEditBot(record)} disabled={!canEditBot}>
            Edit
          </StyledButton>
          <VerticalDivider size='0' />
          <Popover
            placement='bottomLeft'
            content={
              <>
                <StyledButton type='link' onClick={() => handleGenerateSessionKeyClick(record)} disabled={!canEditBot}>
                  Generate Session Key
                </StyledButton>
                <StyledButton type='link' onClick={() => handleDeleteBotClick(record)} disabled={!canDeleteBot}>
                  Delete
                </StyledButton>
              </>
            }
          >
            <StyledButton type='link' disabled={!(canDeleteBot || canEditBot)}>
              More
            </StyledButton>
          </Popover>
        </>
      )
    }
  ]

  const columnsMap = {
    [UserType.USER]: userColumns,
    [UserType.BOT]: botColumns
  }

  if (canDeleteUser) {
    userColumns.push({
      title: 'Action',
      key: 'actions',
      render: (_, record: IUser) => (
        <StyledButton type='link' onClick={() => handleDeleteHumanClick(record)}>
          Delete
        </StyledButton>
      )
    })
  }

  useEffect(() => {
    refresh()
  }, [refresh, selectedUserType, searchValue])

  const permissionItem = (
    <Item
      name='roleId'
      label='Permission Group'
      rules={[{ required: true, message: 'Permission Group is required.' }]}
      initialValue={PLATFORM_ADMIN_ID}
    >
      <Select placeholder='Please select a permission group'>
        {permissionGroups.map(permissionGroup => {
          const { id, name } = permissionGroup
          return (
            <Option key={id} value={id}>
              {name}
            </Option>
          )
        })}
      </Select>
    </Item>
  )

  const { email, name } = selectedUser || {}

  return (
    <>
      <Table
        columns={columnsMap[selectedUserType]}
        rowKey={(record: any) => {
          const user = record.user || record.bot || {}
          return user.id || user.userId
        }}
        dataSource={dataSourceMap[selectedUserType]}
        loading={listUsersState.loading}
        onChange={handleTableChange}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...pagination,
          total: totalSize
        }}
      />
      <AddUserDrawer
        visible={drawerVisible}
        onHideDrawer={hideDrawer}
        onRefresh={refresh}
        selectedUserType={selectedUserType}
        tenantId={0}
        permissionItem={permissionItem}
      />
      <EditUserDrawer
        visible={editDrawerVisible}
        onHideDrawer={hideEditDrawer}
        onRefresh={refresh}
        selectedUser={selectedUser}
        clickedUserType={clickedUserType}
        tenantId={0}
        permissionItem={permissionItem}
      />
      <SessionKeyDrawer
        visible={sessionKeyDrawer}
        onHideDrawer={hideGenerateSessionKeyDrawer}
        selectedUser={selectedUser}
        tenantId={0}
      />
      <Modal
        title='Notice'
        visible={noticeModalVisible}
        onOk={handleDeleteUser}
        onCancel={handleDeleteUserSuccess}
        okText='Yes'
        cancelText='No'
        getContainer={() => document.body}
      >
        {`Are you sure you want to delete this user '${email || name}' ?`}
      </Modal>
    </>
  )
}

export default PlatformAdminList
