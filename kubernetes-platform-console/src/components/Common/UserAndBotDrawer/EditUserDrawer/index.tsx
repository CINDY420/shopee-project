import React, { useState, useEffect } from 'react'

import { Form, message } from 'infrad'
import CrudDrawer from 'components/Common/CrudDrawer'

import AddUserForm from './AddUserForm'

import { groupsControllerEditTenantUser, groupsControllerEditTenantBot } from 'swagger-api/v3/apis/Tenants'
import { roleControllerGetTenantPermissionGroups } from 'swagger-api/v3/apis/UserRole'
import { IRole } from 'api/types/application/group'
import { AddUserType } from 'constants/rbacActions'

import { StyledTitle } from './style'

interface IUser {
  name: string
  id: number
  email: string
  roleId: number
  detail?: string
}

interface IEditUserDrawer {
  visible: boolean
  onHideDrawer: () => void
  onRefresh: () => void
  selectedUser: IUser
  clickedUserType: AddUserType
  tenantId: number
  permissionItem?: React.ReactNode
}

const updateUserApisMap = {
  [AddUserType.HUMAN]: async ({ payload, id, tenantId }) => {
    return await groupsControllerEditTenantUser({ tenantId, userId: id, payload })
  },
  [AddUserType.BOT]: async ({ payload, id, tenantId }) => {
    return await groupsControllerEditTenantBot({ tenantId, botId: id, payload })
  }
}

const EditUserDrawer: React.FC<IEditUserDrawer> = ({
  visible,
  onHideDrawer,
  onRefresh,
  selectedUser,
  clickedUserType,
  tenantId,
  permissionItem
}) => {
  const { id } = selectedUser || {}
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  const [permissionGroups, setPermissionGroups] = useState<IRole[]>([])

  useEffect(() => {
    const fetchPermissionGroupList = async () => {
      const result = await roleControllerGetTenantPermissionGroups({ tenantId })
      const { roles = [] } = result || {}
      setPermissionGroups(roles)
    }
    fetchPermissionGroupList()
  }, [tenantId])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      const { type, ...payload } = values
      const updateUserApi = updateUserApisMap[type]
      await updateUserApi({ payload, id, tenantId })
      onHideDrawer()
      onRefresh()
      form.resetFields()
      form.setFieldsValue({
        type
      })
      message.success(`Update ${type} successfully!`)
    } catch (err) {
      err.message && message.error(err.message)
    }
    setLoading(false)
  }

  return (
    <CrudDrawer
      isSubmitDisabled={false}
      title={<StyledTitle>Edit User</StyledTitle>}
      visible={visible}
      getContainer={false}
      closeDrawer={onHideDrawer}
      body={
        <AddUserForm
          form={form}
          permissionGroups={permissionGroups}
          selectedUser={selectedUser}
          clickedUserType={clickedUserType}
          permissionItem={permissionItem}
        />
      }
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  )
}

export default EditUserDrawer
