import React, { useState } from 'react'
import { Radio } from 'infrad'
import { SearchOutlined } from 'infra-design-icons'

import UserAndBotList from './UserAndBotList'
import { UserType } from 'constants/rbacActions'
import { StyledInput, Filters, UserTypeFilterWrapper, StyledButton } from './style'

import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

import { selectedTenant } from 'states/applicationState/tenant'
import { useRecoilValue } from 'recoil'

const UserManagement: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedUserType, setSelectedUserType] = useState<UserType>(UserType.USER)
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)

  const groupInfo = useRecoilValue(selectedTenant)
  const { id: tenantId } = groupInfo

  const handleRadioChange = event => {
    setSelectedUserType(event.target.value)
  }

  const showDrawer = () => setDrawerVisible(true)
  const hideDrawer = () => setDrawerVisible(false)

  const accessControlContext = React.useContext(AccessControlContext)
  const tenantUserActions = accessControlContext[RESOURCE_TYPE.TENANT_USER] || []
  const tenantBotActions = accessControlContext[RESOURCE_TYPE.TENANT_BOT] || []

  const canAddTenantUser = tenantUserActions.includes(RESOURCE_ACTION.Add)
  const canViewTenantBot = tenantBotActions.includes(RESOURCE_ACTION.View)

  const userPermissionMap = {
    [UserType.USER]: true,
    [UserType.BOT]: canViewTenantBot
  }

  const tabs = Object.values(UserType).filter(type => userPermissionMap[type])

  return (
    <>
      <Filters>
        <UserTypeFilterWrapper>
          <Radio.Group defaultValue={selectedUserType} onChange={handleRadioChange}>
            {tabs.map(type => (
              <Radio.Button key={type} value={type}>
                {type}
              </Radio.Button>
            ))}
          </Radio.Group>
        </UserTypeFilterWrapper>
        <div>
          <StyledInput
            value={searchValue}
            allowClear
            placeholder='Search user by email...'
            onChange={event => setSearchValue(event.target.value)}
            suffix={<SearchOutlined />}
          />
          {canAddTenantUser && (
            <StyledButton type='primary' onClick={showDrawer}>
              Add User
            </StyledButton>
          )}
        </div>
      </Filters>
      <UserAndBotList
        selectedUserType={selectedUserType}
        tenantId={tenantId}
        searchValue={searchValue}
        drawerVisible={drawerVisible}
        hideDrawer={hideDrawer}
      />
    </>
  )
}

export default UserManagement
