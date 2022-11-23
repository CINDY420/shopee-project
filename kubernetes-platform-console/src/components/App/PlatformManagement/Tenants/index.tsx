import React from 'react'

import { Card } from 'common-styles/cardWrapper'
import { Title, TitleWrapper, StyledButton } from './style'

import TenantTable from './TenantTable'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION, PERMISSION_SCOPE } from 'constants/accessControl'
import accessControl from 'hocs/accessControl'

const Tenants: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = React.useState<boolean>(false)
  const showDrawer = () => setDrawerVisible(true)
  const hideDrawer = () => setDrawerVisible(false)

  const accessControlContext = React.useContext(AccessControlContext)
  const tenantActions = accessControlContext[RESOURCE_TYPE.TENANT] || []
  const canAddTenant = tenantActions.includes(RESOURCE_ACTION.Add)

  return (
    <Card height='100%'>
      <TitleWrapper>
        <Title>Tenant Management</Title>
        {canAddTenant && (
          <StyledButton type='primary' onClick={showDrawer}>
            Add Tenant
          </StyledButton>
        )}
      </TitleWrapper>
      <TenantTable drawerVisible={drawerVisible} hideDrawer={hideDrawer} showDrawer={showDrawer} />
    </Card>
  )
}

export default accessControl(Tenants, PERMISSION_SCOPE.GLOBAL, [RESOURCE_TYPE.TENANT])
