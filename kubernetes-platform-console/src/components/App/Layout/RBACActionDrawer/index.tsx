import React, { useState, useEffect, useCallback } from 'react'

import { Form, message } from 'infrad'
import CrudDrawer from 'components/Common/CrudDrawer'

import AccessRequestForm from './AccessRequestForm'
import EditAccessForm from './EditAccessForm'
import AccessConfirmModal from './AccessConfirmModal'

import AccessRequestSuccessContent from './AccessRequestSuccessContent'

import { RBAC_ACTION_KEY } from 'constants/routes/routes'
import { AccessRequestPermissionType, RBACActionType } from 'constants/rbacActions'

import history from 'helpers/history'
import { removeQuery } from 'helpers/editUrlQuery'
import { getSession } from 'helpers/session'

import {
  roleControllerNewUserApplyForTenantUser,
  roleControllerChangeRole,
  roleControllerNewUserApplyForPlatformUser,
  roleControllerGetRbacUserInfo,
  roleControllerGetTenantsRoles,
  roleControllerGetPlatformRoles
} from 'swagger-api/v3/apis/UserRole'

import { initialAccessBeforeSubmit, changeRoleBeforeSubmit } from './beforeSubmit'
import { IOptionRole, ITenantRole, IRole } from 'api/types/accessRequest'
import { useQueryParam, StringParam } from 'use-query-params'
import { IOption } from 'api/types/application/group'

import { StyledTitle, StyledDescription, StyledManual, StyledModal } from 'components/App/Layout/RBACActionDrawer/style'

interface ITitle {
  title: string
  description: string
}

interface IActionDrawerMessage {
  title: string
  description?: string
}
interface IActionDrawerMessageMap {
  [key: string]: IActionDrawerMessage
}

interface IBeforeSubmitMap {
  [key: string]: (formData: Record<string, any>, actionType: RBACActionType) => Record<string, any>
}

const ACCESS_REQUEST_MESSAGE = {
  title: 'Access Request',
  description: 'Please choose your Tenant and Permission Group to request for access.'
}

const EDIT_PERMISSION_GROUP_MESSAGE = {
  title: 'Edit Permission Group',
  description: 'Please choose your Tenant and Permission Group.'
}

const actionDrawerMessageMap: IActionDrawerMessageMap = {
  [RBACActionType.INITIAL_ACCESS]: ACCESS_REQUEST_MESSAGE,
  [RBACActionType.CHANGE_ROLE]: EDIT_PERMISSION_GROUP_MESSAGE
}

const beforeSubmitMap: IBeforeSubmitMap = {
  [RBACActionType.INITIAL_ACCESS]: initialAccessBeforeSubmit,
  [RBACActionType.CHANGE_ROLE]: changeRoleBeforeSubmit
}

const handleSubmitApisMap = {
  [RBACActionType.INITIAL_ACCESS]: roleControllerNewUserApplyForTenantUser,
  [RBACActionType.CHANGE_ROLE]: roleControllerChangeRole
}

const Title: React.FC<ITitle> = ({ title, description }) => {
  return (
    <div>
      <StyledTitle>{title}</StyledTitle>
      {description && (
        <StyledDescription>
          {description}
          <StyledManual href='https://confluence.shopee.io/pages/viewpage.action?pageId=391611313'>
            User manual
          </StyledManual>
        </StyledDescription>
      )}
    </div>
  )
}

const generateCascaderRoleOptions = (tenantsRoleList: ITenantRole[]): IOption[] => {
  const antdOptions = tenantsRoleList.map(tenantRoles => {
    const { tenantName, tenantId, roles } = tenantRoles
    return {
      value: tenantId,
      label: (
        <span style={{ color: '#333333', fontSize: '14px' }}>
          {tenantName}
          <br />
          <span style={{ color: '#999999', fontSize: '12px' }}>ID: {tenantId}</span>
        </span>
      ),
      text: tenantName,
      children: roles.map(role => ({ value: role.id, label: role.name }))
    } as IOption
  })
  return antdOptions
}

const RBACActionDrawer: React.FC = () => {
  const [actionType] = useQueryParam(RBAC_ACTION_KEY, StringParam)
  const drawerVisible = !!RBACActionType[actionType]

  const actionDrawerMessage = actionDrawerMessageMap[actionType]
  const { title, description } = actionDrawerMessage || {}

  const [form] = Form.useForm()

  const [loading, setLoading] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [formResponse, setFormResponse] = useState<any>()
  const [actionTypeMemory, setActionTypeMemory] = useState(actionType)
  const [beforeRoles, setBeforeRoles] = useState<IRole[]>([])
  const [afterRoles, setAfterRoles] = useState<IRole[]>([])
  const [deleteRoles, setDeleteRoles] = useState<IRole[]>([])
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)

  const hideDrawer = () => {
    removeQuery(history, RBAC_ACTION_KEY)
  }

  const hideModal = () => {
    setModalVisible(false)
  }

  const [tenantsRoleList, setTenantsRoleList] = useState<ITenantRole[]>()
  const [tenantRolesOptions, setTenantRolesOptions] = React.useState<IOption[]>([])
  const [platformRoles, setPlatformRoles] = React.useState<IOptionRole[]>([])

  const getTenantsRolesFn = useCallback(async () => {
    try {
      const tenantsRoles = await roleControllerGetTenantsRoles()
      const { tenantsRoles: tenantsRoleList } = tenantsRoles
      setTenantsRoleList(tenantsRoleList)
      const antdOptions = generateCascaderRoleOptions(tenantsRoleList)
      setTenantRolesOptions(antdOptions)
    } catch (err) {
      // ignore err
    }
  }, [])

  const getPlatformRolesFn = useCallback(async () => {
    try {
      const platformRoles = await roleControllerGetPlatformRoles()
      const { roles } = platformRoles
      setPlatformRoles(roles)
    } catch (err) {
      // ignore err
    }
  }, [])

  useEffect(() => {
    getTenantsRolesFn()
    getPlatformRolesFn()
  }, [getTenantsRolesFn, getPlatformRolesFn])

  useEffect(() => {
    const loginedUser = getSession()
    roleControllerGetRbacUserInfo({ userId: loginedUser.userId }).then(response => {
      const { roles = [] } = response || {}
      const userRoles = roles.map(({ tenantId, tenantName, roleId, roleName, roleScope }) => ({
        tenantId,
        tenantName,
        roleId,
        roleName,
        roleScope
      }))
      setBeforeRoles(userRoles)
    })
  }, [])

  const getAfterRoles = useCallback(
    roles => {
      setAfterRoles(roles)
    },
    [setAfterRoles]
  )

  const actionFormsMap = {
    [RBACActionType.INITIAL_ACCESS]: (
      <AccessRequestForm form={form} tenantRolesOptions={tenantRolesOptions} platformRoles={platformRoles} />
    ),
    [RBACActionType.CHANGE_ROLE]: (
      <EditAccessForm form={form} tenantsRoleList={tenantsRoleList} getAfterRoles={getAfterRoles} />
    )
  }

  const getDifferenceSet = (before, after) => {
    before = before.map(JSON.stringify)
    after = after.map(JSON.stringify)
    return before
      .concat(after)
      .filter((v, i, arr) => {
        return arr.indexOf(v) === arr.lastIndexOf(v) && after.indexOf(v) < 0
      })
      .map(JSON.parse)
  }

  const handleConfirm = async () => {
    if (actionType === RBACActionType.CHANGE_ROLE) {
      setConfirmModalVisible(true)
      setDeleteRoles(getDifferenceSet(beforeRoles, afterRoles))
    } else {
      handleSubmit()
    }
  }

  const confirmModalhHandleOk = () => {
    handleSubmit()
    setConfirmModalVisible(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()

      const beforeSubmit = beforeSubmitMap[actionType]
      let handleSubmitApi = handleSubmitApisMap[actionType]
      if (values.type === AccessRequestPermissionType.PLATFORM_USER) {
        handleSubmitApi = roleControllerNewUserApplyForPlatformUser
      }

      let payload = values
      if (beforeSubmit) {
        payload = beforeSubmit(values, actionType as RBACActionType)
      }
      if (!payload) {
        setModalVisible(false)
      } else {
        const response = await handleSubmitApi({ payload })
        setFormResponse(response)
        setModalVisible(true)
        hideDrawer()
      }
    } catch (err) {
      console.error('handleSubmit err:', err)
      err.message && message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (actionType) {
      setActionTypeMemory(actionType)
    }
  }, [actionType])

  const SuccessModalContentMap = {
    [RBACActionType.INITIAL_ACCESS]: <AccessRequestSuccessContent onCancel={hideModal} formResponse={formResponse} />,
    [RBACActionType.CHANGE_ROLE]: <AccessRequestSuccessContent onCancel={hideModal} formResponse={formResponse} />
  }

  const SuccessModalContent = SuccessModalContentMap[actionTypeMemory]
  return (
    <>
      <CrudDrawer
        isSubmitDisabled={false}
        title={<Title title={title} description={description} />}
        visible={drawerVisible}
        getContainer={false}
        style={{ position: 'absolute' }}
        closeDrawer={hideDrawer}
        body={actionFormsMap[actionType]}
        onSubmit={handleConfirm}
        isLoading={loading}
      />
      {SuccessModalContent && (
        <StyledModal
          visible={modalVisible}
          getContainer={() => document.body}
          onCancel={hideModal}
          footer={null}
          centered={true}
        >
          {SuccessModalContent}
        </StyledModal>
      )}
      <AccessConfirmModal
        visible={confirmModalVisible}
        onOk={confirmModalhHandleOk}
        onCancel={() => setConfirmModalVisible(false)}
        beforeRoles={beforeRoles}
        afterRoles={afterRoles}
        deleteRoles={deleteRoles}
      />
    </>
  )
}

export default RBACActionDrawer
