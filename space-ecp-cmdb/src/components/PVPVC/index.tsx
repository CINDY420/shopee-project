import * as React from 'react'
import { Tabs } from 'infrad'
import PVList from 'src/components/PVPVC/PVList'
import SecretList from 'src/components/PVPVC/SecretList'
import { StyledCard } from 'src/components/PVPVC/style'
import { fetch } from 'src/rapper'
import hooks from 'src/sharedModules/cmdb/hooks'
import RouteSetRegion from 'src/components/Common/RouteSetRegion'

const { usePersistQuery } = hooks
const SELECTED_TAB_KEY = 'selected_tab'
const { TabPane } = Tabs

interface ITab {
  name: string
  key: string
  Component: React.ComponentType<unknown>
  props: { [name: string]: unknown }
}

const PVPVC = () => {
  const [azList, setAzList] = React.useState<string[]>([])
  const [cidList, setCidList] = React.useState<string[]>([])
  const [envList, setEnvList] = React.useState<string[]>([])
  const { setPersistQuery, getPersistQuery } = usePersistQuery()
  const [selectedTab, setSelectedTab] = React.useState<string>(getPersistQuery(SELECTED_TAB_KEY))

  const tabs: ITab[] = React.useMemo(
    () => [
      {
        name: 'Secret',
        key: 'secret',
        Component: SecretList,
        props: {
          envList,
          azList,
        },
      },
      {
        name: 'PV/PVC',
        key: 'pv',
        Component: PVList,
        props: {
          envList,
          azList,
          cidList,
        },
      },
    ],
    [azList, cidList, envList],
  )

  const getAZList = React.useCallback(async () => {
    const { azs } = await fetch['GET/api/ecp-cmdb/pvAzs']()
    setAzList(azs)
  }, [])

  const getEnvList = React.useCallback(async () => {
    const { envs } = await fetch['GET/api/ecp-cmdb/envs']()
    setEnvList(envs)
  }, [])

  const getCidvList = React.useCallback(async () => {
    const { cids } = await fetch['GET/api/ecp-cmdb/cids']()
    setCidList(cids)
  }, [])

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
    setPersistQuery(SELECTED_TAB_KEY, tab)
  }

  React.useEffect(() => {
    getAZList()
    getEnvList()
    getCidvList()
  }, [getAZList, getCidvList, getEnvList])

  return (
    <StyledCard>
      <RouteSetRegion />
      <Tabs
        destroyInactiveTabPane
        onChange={handleTabChange}
        activeKey={selectedTab || tabs?.[0]?.key}
      >
        {tabs.map((item) => {
          const { name, key, Component, props } = item
          return (
            <TabPane tab={name} key={key}>
              <Component {...props} />
            </TabPane>
          )
        })}
      </Tabs>
    </StyledCard>
  )
}

export default PVPVC
