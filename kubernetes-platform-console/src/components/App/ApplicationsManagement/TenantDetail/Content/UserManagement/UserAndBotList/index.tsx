import React, { useState, useEffect } from 'react'
import { Table } from 'common-styles/table'
import { VerticalDivider } from 'common-styles/divider'
import { Modal, Popover, message } from 'infrad'

import { roleControllerGetTenantPermissionGroups } from 'swagger-api/v3/apis/UserRole'
import {
  groupsControllerGetTenantUserList,
  groupsControllerGetTenantBotList,
  groupsControllerDeleteTenantUser,
  groupsControllerDeleteTenantBot
} from 'swagger-api/v3/apis/Tenants'

import { IRole, ITenantUserList, ITenantBotList } from 'api/types/application/group'
import { UserType, AddUserType, PERMISSION_GROUP } from 'constants/rbacActions'

import { REFRESH_RATE } from 'constants/time'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { AddUserDrawer, EditUserDrawer, SessionKeyDrawer } from 'components/Common/UserAndBotDrawer'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'

import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

import { getFilterUrlParam, filterTypes } from 'helpers/queryParams'

import userSvg from 'assets/user.svg'
import botSvg from 'assets/bot.svg'

import { StyledTag, StyledImg, StyledButton } from './style'

interface IUserListProps {
  selectedUserType: UserType
  tenantId: number
  searchValue: string
  drawerVisible: boolean
  hideDrawer: () => void
}

interface IUser {
  name: string
  id: number
  email: string
  roleId: number
  detail?: string
}

const dataSourceApiMap = {
  [UserType.USER]: groupsControllerGetTenantUserList,
  [UserType.BOT]: groupsControllerGetTenantBotList
}

const deleteUserApisMap = {
  [AddUserType.HUMAN]: async ({ tenantId, id }) => {
    return await groupsControllerDeleteTenantUser({ tenantId, userId: id })
  },
  [AddUserType.BOT]: async ({ tenantId, id }) => {
    return await groupsControllerDeleteTenantBot({ tenantId, botId: id })
  }
}

const UserAndBotList: React.FC<IUserListProps> = ({
  selectedUserType,
  tenantId,
  searchValue,
  drawerVisible,
  hideDrawer
}) => {
  const [permissionGroups, setPermissionGroups] = useState<IRole[]>([])
  const [editDrawerVisible, setEditDrawerVisible] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<IUser>()
  const [clickedUserType, setClickedUserType] = useState<AddUserType>(AddUserType.HUMAN)
  const [deleteUserType, setDeleteUserType] = useState<AddUserType>()
  const [noticeModalVisible, setNoticeModalVisible] = useState<boolean>(false)
  const [sessionKeyDrawer, setSessionKeyDrwer] = useState<boolean>(false)

  // get table data source
  const dataSourceApi = dataSourceApiMap[selectedUserType]
  const fetchFn = React.useCallback(
    args => {
      const { filterBy, ...others } = args || {}
      const extraFilterBy = getFilterUrlParam({
        name: { key: 'all', value: searchValue, type: filterTypes.contain }
      })
      return dataSourceApi({
        tenantId,
        filterBy: filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy,
        ...others
      })
    },
    [searchValue, dataSourceApi, tenantId]
  )

  const [listUser, listUserFn] = useAsyncIntervalFn<ITenantUserList | ITenantBotList>(fetchFn, {
    enableIntervalCallback: false,
    refreshRate: REFRESH_RATE
  })
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listUserFn })
  const { tenantUsers, tenantBots, totalSize } = (listUser.value as any) || {}

  const dataSourceMap = {
    [UserType.USER]: tenantUsers,
    [UserType.BOT]: tenantBots
  }

  useEffect(() => {
    refresh()
  }, [refresh, selectedUserType, searchValue])

  // get form selects
  useEffect(() => {
    const listPermissionGroupListFn = async (tenantId: number) => {
      const result = await roleControllerGetTenantPermissionGroups({ tenantId })
      const { roles = [] } = result || {}
      setPermissionGroups(roles)
    }
    listPermissionGroupListFn(tenantId)
  }, [tenantId])

  // handle drawer
  const showEditDrawer = () => setEditDrawerVisible(true)
  const hideEditDrawer = () => setEditDrawerVisible(false)

  const handleEditHuman = record => {
    const {
      roleId,
      user: { name, userId: id, email }
    } = record || {}
    setSelectedUser({ id, name, roleId, email })
    setClickedUserType(AddUserType.HUMAN)
    showEditDrawer()
  }

  const handleEditBot = record => {
    const {
      roleId,
      bot: { id, name, detail, email }
    } = record || {}
    setSelectedUser({ id, name, roleId, detail, email })
    setClickedUserType(AddUserType.BOT)
    showEditDrawer()
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
      await deleteUserApi({ tenantId, id })
      message.success(`Delete ${deleteUserType} successfully!`)
    } catch (err) {
      err.message && message.error(err.message)
    }
    refresh()
  }

  const handleDeleteUserSuccess = () => {
    setNoticeModalVisible(false)
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

  // table column
  const permissionGroupFilters = permissionGroups
    .filter(permissionGroup => permissionGroup.name !== PERMISSION_GROUP.PLATFORM_ADMIN)
    .map(({ name, id }) => ({ text: name, value: id }))

  const accessControlContext = React.useContext(AccessControlContext)
  const tenantUserActions = accessControlContext[RESOURCE_TYPE.TENANT_USER] || []
  const tenantBotActions = accessControlContext[RESOURCE_TYPE.TENANT_BOT] || []

  const canEditTenantUser = tenantUserActions.includes(RESOURCE_ACTION.Edit)
  const canDeleteTenantUser = tenantUserActions.includes(RESOURCE_ACTION.Delete)
  const canEditTenantBot = tenantBotActions.includes(RESOURCE_ACTION.Edit)
  const canDeleteTenantBot = tenantBotActions.includes(RESOURCE_ACTION.Delete)

  const userColumns = [
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
    },
    {
      title: 'Action',
      key: 'actions',
      render: (_, record) => (
        <>
          <StyledButton type='link' onClick={() => handleEditHuman(record)} disabled={!canEditTenantUser}>
            Edit
          </StyledButton>
          <VerticalDivider size='0' />
          <StyledButton type='link' onClick={() => handleDeleteHumanClick(record)} disabled={!canDeleteTenantUser}>
            Delete
          </StyledButton>
        </>
      )
    }
  ]

  const botColumns = [
    {
      title: 'Bot ID',
      dataIndex: ['bot', 'id'],
      key: 'id'
    },
    {
      title: 'Bot Name',
      dataIndex: ['bot', 'name'],
      render: user => <StyledTag icon={<StyledImg src={botSvg} />}>{user}</StyledTag>
    },
    {
      title: 'Permission Group',
      dataIndex: 'roleName',
      key: 'roleName',
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
          <StyledButton type='link' onClick={() => handleEditBot(record)} disabled={!canEditTenantBot}>
            Edit
          </StyledButton>
          <VerticalDivider size='0' />
          <Popover
            placement='bottomLeft'
            content={
              <>
                <StyledButton
                  type='link'
                  onClick={() => handleGenerateSessionKeyClick(record)}
                  disabled={!canEditTenantBot}
                >
                  Generate Session Key
                </StyledButton>
                <StyledButton type='link' onClick={() => handleDeleteBotClick(record)} disabled={!canDeleteTenantBot}>
                  Delete
                </StyledButton>
              </>
            }
          >
            <StyledButton type='link'>More</StyledButton>
          </Popover>
        </>
      )
    }
  ]

  const columnsMap = {
    [UserType.USER]: userColumns,
    [UserType.BOT]: botColumns
  }

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
        loading={listUser.loading}
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
        tenantId={tenantId}
        selectedUserType={selectedUserType}
      />
      <EditUserDrawer
        visible={editDrawerVisible}
        onHideDrawer={hideEditDrawer}
        onRefresh={refresh}
        selectedUser={selectedUser}
        clickedUserType={clickedUserType}
        tenantId={tenantId}
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
      <SessionKeyDrawer
        visible={sessionKeyDrawer}
        onHideDrawer={hideGenerateSessionKeyDrawer}
        selectedUser={selectedUser}
        tenantId={tenantId}
      />
    </>
  )
}

export default UserAndBotList
