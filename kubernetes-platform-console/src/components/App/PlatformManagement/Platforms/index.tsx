import * as React from 'react'

import { Card } from 'common-styles/cardWrapper'
import { Radio } from 'infrad'
import { Title, StyledInput, StyledButton, Filters, UserTypeFilterWrapper } from './style'
import { SearchOutlined } from 'infra-design-icons'

import PlatformAdminList from './PlatformAdminList'

import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION, PERMISSION_SCOPE } from 'constants/accessControl'
import { UserType } from 'constants/rbacActions'
import accessControl from 'hocs/accessControl'

const Platforms: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = React.useState<UserType>(UserType.USER)
  const [drawerVisible, setDrawerVisible] = React.useState<boolean>(false)
  const [searchValue, setSearchValue] = React.useState('')

  const showDrawer = () => setDrawerVisible(true)
  const hideDrawer = () => setDrawerVisible(false)

  const accessControlContext = React.useContext(AccessControlContext)
  const globalUserActions = accessControlContext[RESOURCE_TYPE.GLOBAL_USER] || []
  const globalBotActions = accessControlContext[RESOURCE_TYPE.GLOBAL_BOT] || []

  const canAddUser = globalUserActions.includes(RESOURCE_ACTION.Add)
  const canViewBot = globalBotActions.includes(RESOURCE_ACTION.View)

  const userPermissionMap = {
    [UserType.USER]: true,
    [UserType.BOT]: canViewBot
  }

  const tabs = Object.values(UserType).filter(type => userPermissionMap[type])

  const handleRadioChange = event => {
    setSelectedUserType(event.target.value)
  }

  return (
    <Card height='100%'>
      <Title>Platform Management</Title>
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
          {canAddUser && (
            <StyledButton type='primary' onClick={showDrawer}>
              Add User
            </StyledButton>
          )}
        </div>
      </Filters>
      <PlatformAdminList
        searchValue={searchValue}
        drawerVisible={drawerVisible}
        hideDrawer={hideDrawer}
        selectedUserType={selectedUserType}
      />
    </Card>
  )
}

export default accessControl(Platforms, PERMISSION_SCOPE.GLOBAL, [RESOURCE_TYPE.GLOBAL_USER, RESOURCE_TYPE.GLOBAL_BOT])
