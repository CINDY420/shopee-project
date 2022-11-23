import React, { useEffect, useState, useCallback } from 'react'
import { StyledForm } from 'common-styles/form'
import { Button, message } from 'infrad'
import { DeleteOutlined } from 'infra-design-icons'
import { FlexDiv, StyledCascader } from './style'
import { getSession } from 'helpers/session'

import { IOption } from 'api/types/application/group'
import { IRole, ITenantRole } from 'api/types/accessRequest'
import { roleControllerGetRbacUserInfo } from 'swagger-api/v3/apis/UserRole'
import { PLATFORM_TENANT_ID } from 'constants/accessControl'

const { Item } = StyledForm

interface IEditAccessForm {
  form: any
  tenantsRoleList: ITenantRole[]
  getAfterRoles: (roles: IRole[]) => void
}

const titleStyle = { color: '#333333', fontSize: '14px' }
const disabledTitleStyle = { color: '#999999', fontSize: '14px' }
const idStyle = { color: '#999999', fontSize: '12px' }

// transform tenants roles to infrad Cascader options
const generateCascaderRoleOptions = (tenantsRoleList: ITenantRole[], disabledTenants: number[] = []): IOption[] => {
  const antdOptions = tenantsRoleList.map(tenantRoles => {
    const { tenantName, tenantId, roles } = tenantRoles || {}
    const shouldDisabled = disabledTenants.includes(tenantId)
    return {
      value: tenantId,
      label: (
        <span style={shouldDisabled ? disabledTitleStyle : titleStyle}>
          {tenantName}
          <br />
          <span style={idStyle}>ID: {tenantId}</span>
        </span>
      ),
      text: tenantName,
      disabled: shouldDisabled,
      children: roles.map(role => ({ value: role.id, label: role.name }))
    } as IOption
  })
  return antdOptions
}

const EditAccessForm: React.FC<IEditAccessForm> = ({ form, tenantsRoleList = [], getAfterRoles }) => {
  const [userRoles, setUserRoles] = useState<IRole[]>([])
  // find selected tenant
  const [options, setOptions] = useState<IOption[]>([])

  const [selectedPermissionGroups, setSelectedPermissionGroups] = useState<number[][]>([])

  // get initial value of Group Cascader
  const initDefaultRoles = useCallback(async () => {
    const userInfo = getSession()
    const { userId } = userInfo
    try {
      const userRoles = await roleControllerGetRbacUserInfo({ userId })
      const { roles } = userRoles
      setUserRoles(roles)
      const currentValue = roles.map(role => {
        return [role.tenantId, role.roleId]
      })
      setSelectedPermissionGroups(currentValue)
      form.setFieldsValue({ accessGroups: currentValue })
    } catch (err) {
      // ignore err
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    initDefaultRoles()
    const defaultOptions = generateCascaderRoleOptions(tenantsRoleList)
    setOptions(defaultOptions)
  }, [initDefaultRoles, tenantsRoleList])

  useEffect(() => {
    const afterRoles = []
    selectedPermissionGroups.forEach(([selectedTenantId, selectedPermissionGroupId]) => {
      let afterRole = {}
      if (selectedTenantId === PLATFORM_TENANT_ID) {
        const platformUserRole = userRoles.find(({ roleId }) => roleId === selectedPermissionGroupId)
        afterRole = { ...platformUserRole }
      } else {
        const tenantRoles = tenantsRoleList.find(({ tenantId }) => tenantId === selectedTenantId)
        const { tenantName, roles = [] } = tenantRoles || {}
        const selectedRole = roles.find(({ id }) => id === selectedPermissionGroupId)
        const { name: roleName, roleScope } = selectedRole || {}
        afterRole = { tenantId: selectedTenantId, tenantName, roleId: selectedPermissionGroupId, roleName, roleScope }
      }

      afterRoles.push(afterRole)
    })
    getAfterRoles(afterRoles)
  }, [getAfterRoles, selectedPermissionGroups, tenantsRoleList, userRoles])

  const displayRender = (labels, selectedOptions) => {
    if (labels.length < 2) {
      return ''
    }
    const selectedText = selectedOptions.map(({ text, label }) => text || label).join(' | ')
    return selectedText
  }

  const handleCascaderValueChange = (index: number, value: number[]) => {
    const currentPermissionGroups = [...selectedPermissionGroups]
    // replace empty item with selected one
    currentPermissionGroups[index] = value
    setSelectedPermissionGroups(currentPermissionGroups)
    form.setFieldsValue({ accessGroups: currentPermissionGroups })
  }

  const handleClickAdd = () => {
    if (selectedPermissionGroups.find(item => item.length === 0)) {
      message.info('Already has blank item!')
      return
    }
    form.setFieldsValue({ accessGroups: [...selectedPermissionGroups, []] })
    setSelectedPermissionGroups([...selectedPermissionGroups, []])
  }

  const handleClickDelete = index => {
    if (selectedPermissionGroups.length === 1) {
      message.info('Leave at least one permission group')
      return
    }

    const newAccessGroups = [...selectedPermissionGroups.slice(0, index), ...selectedPermissionGroups.slice(index + 1)]
    form.setFieldsValue({ accessGroups: newAccessGroups })
    setSelectedPermissionGroups(newAccessGroups)
  }

  const handlePopupVisibleChange = (value: boolean, clickTenantId: number) => {
    if (value) {
      // disabled selected tenant except current click tenant
      const selectedTenants = selectedPermissionGroups
        .filter(
          tenantPermission => tenantPermission.length && tenantPermission[0] && tenantPermission[0] !== clickTenantId
        )
        .map(tenant => tenant[0])
      const renderOptions = generateCascaderRoleOptions(tenantsRoleList, selectedTenants)
      setOptions([...renderOptions])
    }
  }

  const permissionGroupsFormItems = selectedPermissionGroups.map((item, index) => {
    const [tenantId, permissionGroupId] = item
    const isPlatformUser = tenantId === PLATFORM_TENANT_ID
    const platformUserRole = userRoles.find(({ roleId }) => roleId === permissionGroupId)
    const { roleName } = platformUserRole || {}

    return (
      <FlexDiv key={item}>
        <Item label='Permission Group' name={['accessGroups', index]}>
          <>
            {isPlatformUser ? (
              <div style={{ width: '100%' }}>{roleName}</div>
            ) : (
              <StyledCascader
                placeholder='please select a permission group'
                options={options}
                expandTrigger='hover'
                defaultValue={item}
                onChange={value => handleCascaderValueChange(index, value)}
                displayRender={displayRender}
                onPopupVisibleChange={value => handlePopupVisibleChange(value, tenantId)}
                allowClear={false}
              />
            )}
            <DeleteOutlined onClick={() => handleClickDelete(index)} />
          </>
        </Item>
      </FlexDiv>
    )
  })

  return (
    <StyledForm form={form} layout='vertical' initialValues={{ accessGroups: selectedPermissionGroups }}>
      {permissionGroupsFormItems}
      <Button type='dashed' block onClick={handleClickAdd}>
        + Add
      </Button>
    </StyledForm>
  )
}

export default EditAccessForm
