import React, { useState, useEffect } from 'react'
import { StyledForm } from 'common-styles/form'
import { Radio, Input, Select, Tooltip } from 'infrad'
import { PlatformUserHint, StyledCascader } from 'components/App/Layout/RBACActionDrawer/AccessRequestForm/style'

import { AccessRequestPermissionType, PLATFORM_USER_ROLE } from 'constants/rbacActions'

const { Item } = StyledForm
const { TextArea } = Input
const { Option } = Select

interface IAccessRequestForm {
  form: any
  tenantRolesOptions: any
  platformRoles: any
}

const PLATFORM_USER_ROLE_HINT_MAP = {
  [PLATFORM_USER_ROLE.PLATFORM_ADMIN]:
    'Only for infra SRE, if you are a SRE belongs to other teams, please choose Tenant User-Tenant Admin.',
  [PLATFORM_USER_ROLE.PLATFORM_DEVELOPER]:
    'Only for K8S developer, if you are engineer belongs to other teams, please choose Tenant User-developer.',
  [PLATFORM_USER_ROLE.PLATFORM_VIEWER]:
    "Only for auditor, if you aren‘t auditor, please don't choose this permission group."
}

const AccessRequestForm: React.FC<IAccessRequestForm> = ({ form, tenantRolesOptions, platformRoles }) => {
  const [selectedType, setSelectedType] = useState<AccessRequestPermissionType>(AccessRequestPermissionType.TENANT_USER)
  const [selectedPlatformUserRole, setSelectedPlatformUser] = useState<PLATFORM_USER_ROLE>(
    PLATFORM_USER_ROLE.PLATFORM_DEVELOPER
  )
  const handleTypeChange = e => {
    setSelectedType(e.target.value)
  }
  const handlePlatformUserChanged = value => {
    setSelectedPlatformUser(value)
  }

  const displayRender = (labels, selectedOptions) => {
    if (labels.length < 2) {
      return ''
    }
    const selectedText = selectedOptions.map(({ text, label }) => text || label).join(' | ')
    return selectedText
  }
  const NormalUserItems = (
    <Item name='accessGroups' label='Permission Group' rules={[{ required: true }]}>
      <StyledCascader
        placeholder='please select a permission group'
        options={tenantRolesOptions}
        expandTrigger='hover'
        displayRender={displayRender}
      />
    </Item>
  )

  const PlatformAdminItems = (
    <>
      <Item name='platformPermissionGroupId' label='Permission Group' rules={[{ required: true }]}>
        <Select placeholder='please select a permission group' onChange={handlePlatformUserChanged}>
          {platformRoles.map(role => {
            const { id, name } = role
            return (
              <Option key={id} value={id}>
                {name}
              </Option>
            )
          })}
        </Select>
      </Item>
      <Item>
        <PlatformUserHint>{PLATFORM_USER_ROLE_HINT_MAP[selectedPlatformUserRole]}</PlatformUserHint>
      </Item>
      <Item name='purpose' label='Purpose' rules={[{ required: true }]}>
        <TextArea rows={4} placeholder='Please input' />
      </Item>
    </>
  )

  const itemsMap = {
    [AccessRequestPermissionType.TENANT_USER]: NormalUserItems,
    [AccessRequestPermissionType.PLATFORM_USER]: PlatformAdminItems
  }

  useEffect(() => {
    form.setFieldsValue({
      type: AccessRequestPermissionType.TENANT_USER,
      platformPermissionGroupId: PLATFORM_USER_ROLE.PLATFORM_DEVELOPER
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StyledForm form={form} layout='vertical'>
      <Item name='type' label='Type' rules={[{ required: true }]}>
        <Radio.Group onChange={handleTypeChange}>
          <Radio value={AccessRequestPermissionType.TENANT_USER}>{AccessRequestPermissionType.TENANT_USER}</Radio>
          <Radio value={AccessRequestPermissionType.PLATFORM_USER}>
            <Tooltip
              title='Only for Infra SRE or k8s developer!'
              placement='topLeft'
              visible={selectedType === AccessRequestPermissionType.PLATFORM_USER}
            >
              <span>{AccessRequestPermissionType.PLATFORM_USER}</span>
            </Tooltip>
          </Radio>
        </Radio.Group>
      </Item>
      {itemsMap[selectedType]}
    </StyledForm>
  )
}

export default AccessRequestForm
