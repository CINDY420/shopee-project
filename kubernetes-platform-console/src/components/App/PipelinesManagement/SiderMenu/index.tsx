import React, { useState, useEffect } from 'react'

import { CodeOutlined, SendOutlined } from 'infra-design-icons'
import SideBar from 'components/Common/SideBar'

import { SideMenu, DividerLine } from 'common-styles/menu'

import { PIPELINES, RELEASE_FREEZES } from 'constants/routes/routes'
import { buildTenantName } from 'constants/routes/name'

import { useRecoilValue } from 'recoil'
import { switchedTenant as switchedTenantState } from 'states/tenantSwitcher'

import history from 'helpers/history'
import { useRouteMatch } from 'react-router-dom'

const { Item, ItemGroup } = SideMenu

enum ITEM_KEY {
  PIPELINE = 'pipeline',
  RELEASE_FREEZE = 'release-freeze'
}
const KeyRouteMap = {
  [ITEM_KEY.RELEASE_FREEZE]: RELEASE_FREEZES,
  [ITEM_KEY.PIPELINE]: PIPELINES
}

const SiderMenu: React.FC = () => {
  const matchedRoute = useRouteMatch(Object.values(KeyRouteMap))

  const [collapsed, setCollapsed] = useState<boolean>()
  const [selectedKey, setSelectedKey] = useState<ITEM_KEY | string>(ITEM_KEY.PIPELINE)

  useEffect(() => {
    const matchedKey = matchedRoute && Object.entries(KeyRouteMap).find(([, route]) => route === matchedRoute.path)
    const defaultSelectedKey = matchedKey ? matchedKey[0] : ITEM_KEY.PIPELINE
    setSelectedKey(defaultSelectedKey)
  }, [matchedRoute])

  const switchedTenant = useRecoilValue(switchedTenantState)
  const { id: switchedTenantId } = switchedTenant || {}

  const handleMenuSelect = ({ key }) => {
    setSelectedKey(key)
  }
  const handleItemClick = ({ key }) => {
    const selectedRoute =
      key === ITEM_KEY.PIPELINE ? `${PIPELINES}/${buildTenantName(switchedTenantId)}` : KeyRouteMap[key]
    selectedRoute && history.push(selectedRoute)
  }

  const handleSiderCollapse = (siderCollapsed: boolean) => setCollapsed(siderCollapsed)
  const menu = (
    <SideMenu mode='inline' onSelect={handleMenuSelect} onClick={handleItemClick} selectedKeys={[selectedKey]}>
      <Item key={ITEM_KEY.PIPELINE} icon={<CodeOutlined style={{ fontSize: '16px' }} />}>
        Pipeline
      </Item>
      <ItemGroup title={collapsed ? <DividerLine /> : 'Platform Management'}>
        <Item key={ITEM_KEY.RELEASE_FREEZE} icon={<SendOutlined rotate={-50} style={{ fontSize: '16px' }} />}>
          Release Freeze
        </Item>
      </ItemGroup>
    </SideMenu>
  )

  return (
    <>
      <SideBar width={210} collapsedWidth={48} menu={menu} onCollapse={handleSiderCollapse} />
    </>
  )
}

export default SiderMenu
