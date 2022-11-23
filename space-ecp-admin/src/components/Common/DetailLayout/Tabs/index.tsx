import React from 'react'
import { useQueryParam, StringParam } from 'use-query-params'
import { StyledTabs } from 'src/components/Common/DetailLayout/Tabs/style'

const { TabPane } = StyledTabs

export interface ITab {
  name: string
  Component: React.FC<any>
  props?: { [name: string]: any }
}

export interface ITabsDetailProps {
  tabs: ITab[]
  defaultActiveKey?: string
  tabBarExtraContent?: React.ReactNode
}

const TabsDetail: React.FC<ITabsDetailProps> = (props) => {
  const { tabs, defaultActiveKey, tabBarExtraContent } = props

  const [selectedTab, setSelectedTab] = useQueryParam('selectedTab', StringParam)

  const handleSelectTab = (tab: string) => {
    setSelectedTab(tab)
  }

  return (
    <StyledTabs
      defaultActiveKey={defaultActiveKey}
      onChange={handleSelectTab}
      activeKey={selectedTab?.toString()}
      tabBarExtraContent={tabBarExtraContent}
      destroyInactiveTabPane
    >
      {tabs?.map((tab) => {
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
