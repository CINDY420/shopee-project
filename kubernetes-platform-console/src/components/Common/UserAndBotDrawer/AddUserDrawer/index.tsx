import React, { useState, useEffect } from 'react'

import { Form, message } from 'infrad'
import CrudDrawer from 'components/Common/CrudDrawer'

import AddUserForm from './AddUserForm'

import { groupsControllerAddTenantUsers, groupsControllerAddTenantBot } from 'swagger-api/v3/apis/Tenants'
import { roleControllerGetTenantPermissionGroups } from 'swagger-api/v3/apis/UserRole'
import { IRole } from 'api/types/application/group'
import { AddUserType, UserType } from 'constants/rbacActions'

import { StyledTitle } from './style'

interface ICRUDUserDrawer {
  visible: boolean
  onHideDrawer: () => void
  onRefresh: () => void
  tenantId: number
  selectedUserType: UserType
  permissionItem?: React.ReactNode
}

const addUserApisMap = {
  [AddUserType.HUMAN]: groupsControllerAddTenantUsers,
  [AddUserType.BOT]: groupsControllerAddTenantBot
}

const AddUserDrawer: React.FC<ICRUDUserDrawer> = ({
  visible,
  onHideDrawer,
  onRefresh,
  tenantId,
  selectedUserType,
  permissionItem
}) => {
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
      const addUserApi = addUserApisMap[type]
      await addUserApi({ payload, tenantId })
      onHideDrawer()
      onRefresh()
      form.resetFields()
      form.setFieldsValue({
        type
      })
      message.success(`Add ${type} successfully!`)
    } catch (err) {
      err.message && message.error(err.message)
    }
    setLoading(false)
  }

  return (
    <CrudDrawer
      isSubmitDisabled={false}
      title={<StyledTitle>Add User</StyledTitle>}
      visible={visible}
      getContainer={false}
      closeDrawer={onHideDrawer}
      body={
        <AddUserForm
          form={form}
          permissionGroups={permissionGroups}
          selectedUserType={selectedUserType}
          permissionItem={permissionItem}
        />
      }
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  )
}

export default AddUserDrawer
