import { FunctionComponent } from 'react'
import { Tabs } from 'infrad'
import useUrlState from '@ahooksjs/use-url-state'
import { ContentWrapper } from 'src/common-styles/layout'
import { StyledAppClusterConfig } from 'src/components/App/Tenant/AppClusterConfig/style'

type TenantTabProp = {
  className?: string
}
export const TenantTabs: FunctionComponent<TenantTabProp> = (props) => {
  const { className } = props
  const [selectedTabState, setSelectedTabState] = useUrlState({
    tenantTab: 'App-Cluster Config',
  })

  return (
    <Tabs
      className={className}
      defaultActiveKey={selectedTabState.tenantTab}
      onTabClick={(key) => {
        setSelectedTabState({
          ...selectedTabState,
          tenantTab: key,
        })
      }}
    >
      <Tabs.TabPane tab="App-Cluster Config" key="app-cluster-config">
        <ContentWrapper>
          <StyledAppClusterConfig />
        </ContentWrapper>
      </Tabs.TabPane>
      {/* <Tabs.TabPane tab="Tab 2" key="2"> */}
      {/*  <ContentWrapper> */}
      {/*    <StyledContent>Content of tab 2</StyledContent> */}
      {/*  </ContentWrapper> */}
      {/* </Tabs.TabPane> */}
      {/* <Tabs.TabPane tab="Tab 3" key="3"> */}
      {/*  <ContentWrapper> */}
      {/*    <StyledContent>Content of tab 3</StyledContent> */}
      {/*  </ContentWrapper> */}
      {/* </Tabs.TabPane> */}
    </Tabs>
  )
}
