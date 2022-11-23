import { FunctionComponent } from 'react'
import { RecoilRoot } from 'recoil'
import { Tabs } from 'infrad'
import useUrlState from '@ahooksjs/use-url-state'
import { WhiteContentWrapper } from 'src/components/App/Tenant/AppClusterConfig/style'
import { StyledSearch } from 'src/components/App/Tenant/AppClusterConfig/Search/style'
import { StyledDefaultConfig } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/style'

type AppClusterConfigProp = {
  className?: string
}
export const AppClusterConfig: FunctionComponent<AppClusterConfigProp> = (props) => {
  const { className } = props

  const [selectedTabState, setSelectedTabState] = useUrlState({
    appClusterConfigTab: 'Search',
  })

  return (
    <RecoilRoot>
      <Tabs
        className={className}
        type="card"
        onTabClick={(key) =>
          setSelectedTabState({
            ...selectedTabState,
            appClusterConfigTab: key,
          })
        }
        defaultActiveKey={selectedTabState.appClusterConfigTab}
      >
        <Tabs.TabPane tab="Search" key="Search">
          <WhiteContentWrapper>
            <StyledSearch />
          </WhiteContentWrapper>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Default Config" key="Default Config">
          <WhiteContentWrapper $noPaddingBottom>
            <StyledDefaultConfig />
          </WhiteContentWrapper>
        </Tabs.TabPane>
        {/* sdu tab will be done in next version */}
        {/* <Tabs.TabPane tab="SDUs' Config" key="SDUs' Config"> */}
        {/*  <WhiteContentWrapper>SDUs&apos; Config</WhiteContentWrapper> */}
        {/* </Tabs.TabPane> */}
      </Tabs>
    </RecoilRoot>
  )
}
export { tenantAndEnvState } from 'src/components/App/Tenant/AppClusterConfig/store'
