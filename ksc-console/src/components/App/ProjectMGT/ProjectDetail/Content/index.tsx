import { useParams, useSearchParams } from 'react-router-dom'
import { Card, Tabs } from 'infrad'
import JobList from './JobList'
import PeriodicJobList from './PeriodicJobList'
import UserManagement from './UserManagement'
import useCheckRoles from 'hooks/useCheckRoles'
import {
  PLATFORM_ADMIN_ID,
  PROJECT_ADMIN_ID,
  PROJECT_MEMBER_ID,
  TENANT_ADMIN_ID,
} from 'constants/auth'
import OperationHistory from 'components/App/ProjectMGT/ProjectDetail/Content/OperationHistory'

const { TabPane } = Tabs
const SELECTED_TAB_KEY = 'selectedTab'
const tabs = [
  { tab: 'Real-time Job', key: 'realtimeJob', Component: JobList },
  { tab: 'Periodic Job', key: 'periodicJob', Component: PeriodicJobList },
  { tab: 'User Management', key: 'userManagement', Component: UserManagement },
  { tab: 'Operation History', key: 'operationHistory', Component: OperationHistory },
]

const Content = () => {
  const { tenantId, projectId } = useParams()
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
      roleId: PROJECT_ADMIN_ID,
      tenantId,
      projectId,
    },
    {
      roleId: PROJECT_MEMBER_ID,
      tenantId,
      projectId,
    },
  ])
  const selectedTab = searchParams.get(SELECTED_TAB_KEY) ?? 'realtimeJob'

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
