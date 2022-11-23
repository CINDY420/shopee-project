import * as React from 'react'
import { Tabs } from 'infrad'
import hooks from 'src/sharedModules/cmdb/hooks'
import { DetailPageTabs } from 'src/components/Common/DetailLayout/DetailTabs/style'

const { usePersistQuery } = hooks
const SELECTED_TAB_KEY = 'selected_tab'

const { TabPane } = Tabs

interface ITab {
  name: string
  Component: React.ComponentType<any>
  props: { [name: string]: any }
}

export interface IDetailTabsProps {
  top?: string
  defaultActiveKey?: string
  tabs?: Array<ITab>
  tabBarExtraContent?: React.ReactNode
}

const DetailTabs: React.FC<IDetailTabsProps> = ({
  top,
  tabs,
  defaultActiveKey,
  tabBarExtraContent,
}) => {
  const { setPersistQuery, getPersistQuery } = usePersistQuery()
  const defaultTabName = defaultActiveKey || tabs?.[0]?.name

  const [selectedTab, setSelectedTab] = React.useState<string>(
    getPersistQuery(SELECTED_TAB_KEY) || defaultTabName,
  )
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
    setPersistQuery(SELECTED_TAB_KEY, tab)
  }

  return (
    <DetailPageTabs
      top={top}
      activeKey={selectedTab}
      onChange={handleTabChange}
      animated={false}
      destroyInactiveTabPane
      tabBarExtraContent={tabBarExtraContent}
    >
      {tabs.map(({ name, Component, props: tabProps }) => (
        <TabPane tab={name} key={name}>
          <Component isActive={selectedTab === name} {...tabProps} />
        </TabPane>
      ))}
    </DetailPageTabs>
  )
}

export default DetailTabs
