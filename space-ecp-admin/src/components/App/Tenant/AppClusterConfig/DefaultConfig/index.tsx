import { FunctionComponent, useState } from 'react'
import { Divider, Radio, Tabs } from 'infrad'
import { StyledTenantAndEnvSelector } from 'src/components/App/Tenant/AppClusterConfig/TenantAndEnvSelector/style'
import {
  StyledSpan,
  StyleEmpty,
} from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/style'
import {
  DefaultConfigTabs,
  tenantAndEnvState,
  useConfigsNumber,
  useUpdateFormSavedStatus,
} from 'src/components/App/Tenant/AppClusterConfig/store'
import { antdConfirm } from 'src/helpers/antdModel'
import { useRecoilValue } from 'recoil'

type DefaultConfigProp = {
  className?: string
}
export const DefaultConfig: FunctionComponent<DefaultConfigProp> = (props) => {
  const { className } = props

  const [configsNumbers] = useConfigsNumber()
  const [activeTabKey, setActiveTabKey] = useState(DefaultConfigTabs[0].scope)
  const [formSavedStatusList] = useUpdateFormSavedStatus()

  const tenantAndEnv = useRecoilValue(tenantAndEnvState)
  const { env, tenant } = tenantAndEnv
  const noData = !env || !tenant

  const getConfigNumberByScope = (scope: string) => {
    const configNumberValue = configsNumbers.find((config) => config.scope === scope)?.value ?? 0
    if (configNumberValue) {
      return String(configNumberValue)
    }
    return ''
  }

  return (
    <div className={className}>
      <StyledTenantAndEnvSelector />
      <Divider />
      {noData && <StyleEmpty />}
      {!noData && (
        <Tabs
          activeKey={activeTabKey}
          renderTabBar={(props, DefaultTabBar) => (
            <Radio.Group value={activeTabKey}>
              <DefaultTabBar {...props}>
                {(node) => (
                  <Radio.Button value={node.key} key={node.key}>
                    {node}
                  </Radio.Button>
                )}
              </DefaultTabBar>
            </Radio.Group>
          )}
          onChange={async (key) => {
            const currentStatus = formSavedStatusList.find(
              (status) => status.scope === activeTabKey,
            )
            if (currentStatus?.value) {
              setActiveTabKey(key)
            } else {
              const result = await antdConfirm({
                okText: 'Ok',
                title: 'Confirm',
                content:
                  'The config has not been saved yet. Are you sure to change to another tab?',
              })
              if (result) {
                setActiveTabKey(key)
              }
            }
          }}
        >
          {DefaultConfigTabs.map((tabConfig) => (
            <Tabs.TabPane
              tab={
                <>
                  {tabConfig.title}{' '}
                  <StyledSpan $isActive={activeTabKey === tabConfig.scope}>
                    {getConfigNumberByScope(tabConfig.scope)}
                  </StyledSpan>
                </>
              }
              key={tabConfig.scope}
            >
              <tabConfig.DefaultConfigForm />
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </div>
  )
}
