import { Card, Tabs } from 'infrad'
import Overview from 'components/App/ClusterManagement/ClusterDetail/Head/Overview'

const { TabPane } = Tabs
const tabs = [{ tab: 'Overview', key: 'overview', Component: Overview }]

const Head = () => (
  <Card>
    <Tabs activeKey="overview">
      {tabs.map(({ key, tab, Component }) => (
        <TabPane key={key} tab={tab}>
          <Component />
        </TabPane>
      ))}
    </Tabs>
  </Card>
)

export default Head
