import { useParams, useSearchParams } from 'react-router-dom'
import { Card, Tabs } from 'infrad'
import ProjectList from 'components/App/ProjectMGT/TenantDetail/Content/ProjectList'
import UserManagement from 'components/App/ProjectMGT/TenantDetail/Content/UserManagement'
import { PLATFORM_ADMIN_ID, TENANT_ADMIN_ID, TENANT_MEMBER_ID } from 'constants/auth'
import useCheckRoles from 'hooks/useCheckRoles'

const { TabPane } = Tabs
const SELECTED_TAB_KEY = 'selectedTab'
const tabs = [
  { tab: 'Project List', key: 'projectList', Component: ProjectList },
  { tab: 'User Management', key: 'userManagement', Component: UserManagement },
]

const Content = () => {
  const { tenantId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const isShowUserManagement = useCheckRoles([
    {
      roleId: PLATFORM_ADMIN_ID,
    },
    {
      roleId: TENANT_ADMIN_ID,
      tenantId,
    },
    {
      roleId: TENANT_MEMBER_ID,
      tenantId,
    },
  ])
  const selectedTab = searchParams.get(SELECTED_TAB_KEY) ?? 'projectList'

  return (
    <Card>
      <Tabs
        activeKey={selectedTab}
        onChange={(tabKey: string) => setSearchParams({ [SELECTED_TAB_KEY]: tabKey })}
      >
        {tabs.map(({ key, tab, Component }) => {
          if (key === 'userManagement' && !isShowUserManagement) return null

          return (
            <TabPane key={key} tab={tab}>
              <Component />
            </TabPane>
          )
        })}
      </Tabs>
    </Card>
  )
}

export default Content
