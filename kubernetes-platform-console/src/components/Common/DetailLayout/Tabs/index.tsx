import * as React from 'react'
import EnumStringParamGenerator from 'hooks/queryString/EnumStringParam'
import { Tabs } from 'infrad'
import { useQueryParam } from 'use-query-params'

import { DetailPageTabs } from './style'

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

const DetailTabs: React.FC<IDetailTabsProps> = ({ top, tabs, defaultActiveKey, tabBarExtraContent }) => {
  const tabNames = tabs.map(({ name }) => name)
  const defaultTabName = defaultActiveKey || tabNames[0]
  const enumStringParam = React.useMemo(() => EnumStringParamGenerator(tabNames, defaultTabName), [
    tabNames,
    defaultTabName
  ])

  const [selectedTab, setSelectedTab] = useQueryParam<string>('selectedTab', enumStringParam)
  const handleTabChange = tab => {
    setSelectedTab(tab)
  }

  return (
    <DetailPageTabs
      top={top}
      activeKey={selectedTab}
      onChange={handleTabChange}
      animated={false}
      destroyInactiveTabPane={true}
      tabBarExtraContent={tabBarExtraContent}
    >
      {tabs.map(({ name, Component, props: tabProps }) => {
        return (
          <TabPane tab={name} key={name}>
            <Component isActive={selectedTab === name} {...tabProps} />
          </TabPane>
        )
      })}
    </DetailPageTabs>
  )
}

export default DetailTabs
