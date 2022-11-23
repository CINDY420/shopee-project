import React, { useState, useEffect } from 'react'

import Icon, { CodeOutlined, AppstoreOutlined, RightOutlined, IBucket } from 'infra-design-icons'
import SideBar from 'components/Common/SideBar'

import { SideMenu, SideSubmenu, DividerLine, StyledSpan } from 'common-styles/menu'

import {
  APPLICATIONS,
  CLUSTERS,
  PLATFORMS,
  TENANTS,
  PENDING_MY_ACTION_LIST,
  MY_REQUESTS_LIST,
  RESOURCE
} from 'constants/routes/routes'
import { buildTenantName } from 'constants/routes/name'

import ExtendSubMenu from './ExtendSubMenu'
import ApplicationMenu from './ApplicationMenu'

import { useRecoilValue } from 'recoil'
import { switchedTenant as switchedTenantState } from 'states/tenantSwitcher'

import history from 'helpers/history'
import { useRouteMatch } from 'react-router-dom'
import { GlobalContext } from 'hocs/useGlobalContext'

import TicketsCenterSvg from 'assets/ticketsCenter.antd.svg?component'
import SettingsSvg from 'assets/settings.antd.svg?component'
import UsersSvg from 'assets/users.antd.svg?component'

const { Item, ItemGroup } = SideMenu

enum ITEM_KEY {
  APP_MANAGEMENT = 'app-management',
  TICKETS_CENTER = 'tickets-center',
  PLATFORM_MANAGEMENT = 'platform-management',
  CLUSTER = 'cluster',
  PLATFORM = 'platform',
  TENANT = 'tenant',
  RESOURCE = 'resource'
}
enum TICKETS_CENTER_KEY {
  PENDING_MY_ACTION = 'pending-my-action',
  MY_REQUESTS = 'my-requests'
}
const KeyRouteMap = {
  [TICKETS_CENTER_KEY.PENDING_MY_ACTION]: PENDING_MY_ACTION_LIST,
  [TICKETS_CENTER_KEY.MY_REQUESTS]: MY_REQUESTS_LIST,
  [ITEM_KEY.APP_MANAGEMENT]: APPLICATIONS,
  [ITEM_KEY.CLUSTER]: CLUSTERS,
  [ITEM_KEY.PLATFORM]: PLATFORMS,
  [ITEM_KEY.TENANT]: TENANTS,
  [ITEM_KEY.RESOURCE]: RESOURCE
}

const SiderMenu: React.FC = () => {
  const { state } = React.useContext(GlobalContext)
  const { userRoles = [] } = state || {}
  const isUnbindUser = userRoles.length > 0

  const matchedRoute = useRouteMatch(Object.values(KeyRouteMap))

  const [collapsed, setCollapsed] = useState<boolean>()
  const [selectedKey, setSelectedKey] = useState<ITEM_KEY | TICKETS_CENTER_KEY | string>(ITEM_KEY.APP_MANAGEMENT)
  const [appTreeVisible, setAppTreeVisible] = useState(false)

  useEffect(() => {
    const matchedKey = matchedRoute && Object.entries(KeyRouteMap).find(([, route]) => route === matchedRoute.path)
    const defaultSelectedKey = matchedKey ? matchedKey[0] : ITEM_KEY.APP_MANAGEMENT
    setSelectedKey(defaultSelectedKey)
  }, [matchedRoute])

  const switchedTenant = useRecoilValue(switchedTenantState)
  const { id: switchedTenantId } = switchedTenant || {}

  const handleMenuSelect = ({ key }) => {
    setSelectedKey(key)
  }
  const handleItemClick = ({ key }) => {
    const selectedRoute =
      key === ITEM_KEY.APP_MANAGEMENT ? `${APPLICATIONS}/${buildTenantName(switchedTenantId)}` : KeyRouteMap[key]
    selectedRoute && history.push(selectedRoute)
  }

  const handleSiderCollapse = (siderCollapsed: boolean) => setCollapsed(siderCollapsed)
  const menu = (
    <SideMenu
      mode='inline'
      onSelect={handleMenuSelect}
      onClick={handleItemClick}
      defaultOpenKeys={[ITEM_KEY.TICKETS_CENTER]}
      selectedKeys={[selectedKey]}
    >
      {isUnbindUser && (
        <Item
          key={ITEM_KEY.APP_MANAGEMENT}
          icon={<CodeOutlined style={{ fontSize: '16px' }} />}
          onMouseEnter={() => setAppTreeVisible(true)}
          onMouseLeave={() => setAppTreeVisible(false)}
          title={null}
        >
          App Management{' '}
          {!collapsed && <RightOutlined style={{ position: 'absolute', right: 16, top: 14, fontSize: '12px' }} />}
        </Item>
      )}
      <SideSubmenu
        key={ITEM_KEY.TICKETS_CENTER}
        icon={<Icon component={TicketsCenterSvg} style={{ fontSize: '16px' }} />}
        title='Tickets Center'
      >
        {collapsed && (
          <Item key='tickets-center-title' disabled>
            Tickets Center
          </Item>
        )}
        <Item key={TICKETS_CENTER_KEY.PENDING_MY_ACTION}>
          <StyledSpan marked={collapsed}>Pending My Action</StyledSpan>
        </Item>
        <Item key={TICKETS_CENTER_KEY.MY_REQUESTS}>
          <StyledSpan marked={collapsed}>My Requests</StyledSpan>
        </Item>
      </SideSubmenu>
      {isUnbindUser && (
        <ItemGroup title={collapsed ? <DividerLine /> : 'Platform Management'}>
          <Item key={ITEM_KEY.CLUSTER} icon={<AppstoreOutlined style={{ fontSize: '16px' }} />}>
            Cluster
          </Item>
          <Item key={ITEM_KEY.PLATFORM} icon={<Icon component={SettingsSvg} style={{ fontSize: '16px' }} />}>
            Platform
          </Item>
          <Item key={ITEM_KEY.TENANT} icon={<Icon component={UsersSvg} style={{ fontSize: '16px' }} />}>
            Tenant
          </Item>
          <Item key={ITEM_KEY.RESOURCE} icon={<IBucket style={{ fontSize: '16px' }} />}>
            Resource
          </Item>
        </ItemGroup>
      )}
    </SideMenu>
  )

  return (
    <>
      {isUnbindUser && (
        <ExtendSubMenu visible={appTreeVisible} left={collapsed ? 48 : 210} component={<ApplicationMenu />} />
      )}
      <SideBar width={210} collapsedWidth={48} menu={menu} onCollapse={handleSiderCollapse} />
    </>
  )
}

export default SiderMenu
