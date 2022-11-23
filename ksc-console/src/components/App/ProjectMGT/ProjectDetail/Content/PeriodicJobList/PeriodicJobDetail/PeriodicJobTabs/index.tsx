import { Card, Tabs } from 'infrad'
import { useSearchParams } from 'react-router-dom'
import BasicInformation from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail/PeriodicJobTabs/BasicInformation'
import Instance from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail/PeriodicJobTabs/Instance'

const SELECTED_TAB_KEY = 'selectedTabKey'
const { TabPane } = Tabs
const tabs = [
  { tab: 'Instance', key: 'instance', Component: Instance },
  { tab: 'Basic Information', key: 'basicInfo', Component: BasicInformation },
]
const PeriodicJobTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedTab = searchParams.get(SELECTED_TAB_KEY) ?? 'instance'

  return (
    <Card bordered={false} style={{ borderRadius: 0 }}>
      <Tabs
        activeKey={selectedTab}
        onChange={(tabKey: string) => setSearchParams({ [SELECTED_TAB_KEY]: tabKey })}
      >
        {tabs.map(({ key, tab, Component }) => (
          <TabPane key={key} tab={tab}>
            <Component />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  )
}

export default PeriodicJobTabs
