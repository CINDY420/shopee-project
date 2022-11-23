import { useSearchParams } from 'react-router-dom'
import { Card, Tabs } from 'infrad'
import Overview from './Overview'
import JobBasicInformation from './JobBasicInformation'
import useCheckPermission from 'hooks/useCheckPermission'
import { PERMISSION_RESOURCE, PERMISSION_ACTION } from 'constants/permission'

const { TabPane } = Tabs
const SELECTED_TAB_KEY = 'selectedTabKey'
const tabs = [
  { tab: 'Overview', key: 'overview', Component: Overview },
  { tab: 'Basic Information', key: 'basicInfo', Component: JobBasicInformation },
]

const Content = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedTab = searchParams.get(SELECTED_TAB_KEY) ?? 'overview'

  const checkPermission = useCheckPermission(PERMISSION_RESOURCE.SHOPEE_JOB)
  const permission = {
    canViewBasicInfo: checkPermission(PERMISSION_ACTION.GET),
  }

  return (
    <Card bordered={false} style={{ borderRadius: 0 }}>
      <Tabs
        activeKey={selectedTab}
        onChange={(tabKey: string) => setSearchParams({ [SELECTED_TAB_KEY]: tabKey })}
      >
        {tabs.map(
          ({ key, tab, Component }) =>
            (permission.canViewBasicInfo || key !== 'basicInfo') && (
              <TabPane key={key} tab={tab}>
                <Component />
              </TabPane>
            ),
        )}
      </Tabs>
    </Card>
  )
}

export default Content
