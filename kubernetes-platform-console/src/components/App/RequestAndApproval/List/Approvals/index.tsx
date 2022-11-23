import * as React from 'react'
import { Tabs, Typography } from 'infrad'
import { useQueryParam, StringParam } from 'use-query-params'

import HistoryApprovalList from './HistoryApprovalList'
import OpenApprovalList from './OpenApprovalList'
import { Root } from 'components/App/RequestAndApproval/style'
import Breadcrumbs from 'components/App/RequestAndApproval/Common/Breadcrumbs'

import { StyledTabs } from './style'

const { TabPane } = Tabs

const { Title } = Typography

const TABS = {
  PENDING_MY_APPROVAL: 'Open requests',
  APPROVAL_HISTORY: 'History'
}

const tabs = [
  {
    name: TABS.PENDING_MY_APPROVAL,
    Component: () => <OpenApprovalList />
  },
  {
    name: TABS.APPROVAL_HISTORY,
    Component: () => <HistoryApprovalList />
  }
]

const Approvals: React.FC = () => {
  const [selectedTab, setSelectedTab] = useQueryParam('selectedTab', StringParam)

  return (
    <Root>
      <Breadcrumbs />
      <Title level={4}>Pending My Action</Title>
      <StyledTabs activeKey={selectedTab} onChange={setSelectedTab} animated={false} destroyInactiveTabPane={true}>
        {tabs.map((tab: any) => {
          const { name, Component, props: tabProps } = tab

          return (
            <TabPane tab={name} key={name}>
              <Component {...tabProps} />
            </TabPane>
          )
        })}
      </StyledTabs>
    </Root>
  )
}

export default Approvals
