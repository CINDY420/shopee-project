import React from 'react'
import { useQueryParam, StringParam } from 'use-query-params'
import { StyledTabs } from 'src/components/Common/DetailLayout/Tabs/style'

const { TabPane } = StyledTabs

interface ITab {
  name: string
  Component: React.FunctionComponent
  props: { [name: string]: any }
}

export interface ITabsDetailProps {
  defaultActiveKey?: string
  tabs?: ITab[]
  tabBarExtraContent?: React.ReactNode
  top?: number
}

const TabsDetail: React.FC<ITabsDetailProps> = (props) => {
  const { tabs, defaultActiveKey, tabBarExtraContent, top } = props

  const [selectedTab, setSelectedTab] = useQueryParam<string>('selectedTab', StringParam)
  const handleSelectTab = (tab: string) => {
    setSelectedTab(tab)
  }

  return (
    <StyledTabs
      defaultActiveKey={defaultActiveKey}
      onChange={handleSelectTab}
      activeKey={selectedTab}
      tabBarExtraContent={tabBarExtraContent}
      destroyInactiveTabPane
      top={top}
    >
      {tabs.map((tab) => {
        const { name, Component, props: tabProps } = tab
        return (
          <TabPane tab={name} key={name}>
            <Component {...tabProps} />
          </TabPane>
        )
      })}
    </StyledTabs>
  )
}

export default TabsDetail
