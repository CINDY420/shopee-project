import * as React from 'react'
import { Wrapper, StyledTabs, ContentWrapper } from 'components/App/Platform/style'
import AccountManagement from 'components/App/Platform/AccountManagement'
import DetailLayout from 'components/Common/DetailLayout'
import PlatformConfig from 'components/App/Platform/PlatformConfig'
import { useSearchParams } from 'react-router-dom'

const { TabPane } = StyledTabs

enum TABS {
  ACCOUNT_MANAGEMENT = 'Account Management',
  PLATFORM_CONFIG = 'Platform Config',
}

const SELECTED_TAB_KEY = 'selectedTab'
const tabs = [
  {
    tab: TABS.ACCOUNT_MANAGEMENT,
    Component: AccountManagement,
  },
  {
    tab: TABS.PLATFORM_CONFIG,
    Component: PlatformConfig,
  },
]

const Platform: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedTab = searchParams.get(SELECTED_TAB_KEY) ?? TABS.ACCOUNT_MANAGEMENT
  return (
    <DetailLayout
      title="Platform Management"
      isHeaderWithBottomLine={false}
      isHeaderWithBreadcrumbs={false}
      body={
        <Wrapper>
          <StyledTabs
            activeKey={selectedTab}
            onChange={(tabKey: string) => setSearchParams({ [SELECTED_TAB_KEY]: tabKey })}
          >
            {tabs.map((item) => {
              const { Component } = item
              return (
                <TabPane tab={item.tab} key={item.tab}>
                  <ContentWrapper>
                    <Component />
                  </ContentWrapper>
                </TabPane>
              )
            })}
          </StyledTabs>
        </Wrapper>
      }
    />
  )
}
export default Platform
