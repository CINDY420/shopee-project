import React from 'react'
import { Tabs } from 'infrad'
import { Card } from 'common-styles/cardWrapper'

import ProjectList from './ProjectList'
import UserManagement from './UserManagement'
import { useQueryParam, StringParam } from 'use-query-params'

import accessControl from 'hocs/accessControl'
import { PERMISSION_SCOPE, RESOURCE_TYPE } from 'constants/accessControl'
import ZoneManagement from 'components/App/ApplicationsManagement/TenantDetail/Content/ZoneManagement'
import { tenantControllerListEnableHybridDeployTenants } from 'swagger-api/v1/apis/Tenant'

const AccessControlProjectList = accessControl(ProjectList, PERMISSION_SCOPE.TENANT, [
  RESOURCE_TYPE.PROJECT,
  RESOURCE_TYPE.PROJECT_QUOTA
])
const AccessControlUserManagement = accessControl(UserManagement, PERMISSION_SCOPE.TENANT, [
  RESOURCE_TYPE.TENANT_USER,
  RESOURCE_TYPE.TENANT_BOT
])
const AccessControlZoneManagement = accessControl(ZoneManagement, PERMISSION_SCOPE.TENANT, [RESOURCE_TYPE.ZONE])

const { TabPane } = Tabs

interface IContentProps {
  tenantName: string
  tenantId: number
  onRefreshGroup: () => void
}

const Content: React.FC<IContentProps> = ({ tenantName, tenantId, onRefreshGroup }) => {
  const [selectedTab, setSelectedTab] = useQueryParam('selectedTab', StringParam)
  const [enableHybridDeployTenant, setEnableHybridDeployTenant] = React.useState<string[]>([])

  const getEnableHybridDeployTenants = React.useCallback(async () => {
    const { tenants } = await tenantControllerListEnableHybridDeployTenants()
    setEnableHybridDeployTenant(tenants)
  }, [])

  React.useEffect(() => {
    getEnableHybridDeployTenants()
  }, [getEnableHybridDeployTenants])

  return (
    <>
      <Card>
        <Tabs activeKey={selectedTab} onChange={setSelectedTab}>
          <TabPane key='projectList' tab='Project List'>
            <AccessControlProjectList tenantName={tenantName} tenantId={tenantId} onRefreshGroup={onRefreshGroup} />
          </TabPane>
          <TabPane key='userManagement' tab='User Management'>
            <AccessControlUserManagement />
          </TabPane>
          {enableHybridDeployTenant.includes(tenantId.toString()) && (
            <TabPane key='zoneManagement' tab='Zone Management'>
              <AccessControlZoneManagement />
            </TabPane>
          )}
        </Tabs>
      </Card>
    </>
  )
}

export default Content
