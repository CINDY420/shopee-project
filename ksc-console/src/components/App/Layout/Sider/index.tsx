import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  PROJECT_MGT,
  PLATFORMS,
  TENANTS,
  CLUSTER_MANAGEMENT,
  OPERATION_HISTORY,
} from 'constants/routes/route'
import 'infrad/dist/antd.less'
import { IGridview, ICrm, IBucket, IServer, HistoryOutlined } from 'infra-design-icons'
import SideBar from 'components/App/Layout/Sider/SideBar'
import { SideMenu } from './style'
import useCheckPermission from 'hooks/useCheckPermission'
import { PERMISSION_RESOURCE } from 'constants/permission'
import { Menu } from 'infrad'
import { CLUSTER_ADMIN_ID, PLATFORM_ADMIN_ID } from 'constants/auth'
import { hasRole } from 'helpers/permission'
import { IUserInfo } from 'helpers/session'

enum ITEM_KEY {
  PROJECT_MGT = 'projectManagement',
  RESOURCE_PANEL = 'resourcePanel',
  PLATFORMS = 'platform',
  TENANTS = 'tenant',
  CLUSTER_MANAGEMENT = 'clusterManagement',
  OPERATION_HISTORY = 'operationHistory',
}

interface ISliderProps {
  roles: IUserInfo['roles']
}

interface IMenuItems {
  key: ITEM_KEY
  permissionKey?: PERMISSION_RESOURCE
  name: string
  route: string
  icon: React.ReactElement
  roleKeys?: string[]
}

const MENU_ITEMS: IMenuItems[] = [
  {
    key: ITEM_KEY.PROJECT_MGT,
    permissionKey: PERMISSION_RESOURCE.PROJECT,
    name: 'Project MGT',
    route: PROJECT_MGT,
    icon: <IGridview style={{ fontSize: '16px' }} />,
  },
  // TODO: tiancheng.zhang add in next version
  /*
   * {
   *   key: ITEM_KEY.RESOURCE_PANEL,
   *   roleKeys: [PLATFORM_ADMIN_ID],
   *   name: 'Resource Panel',
   *   route: RESOURCE_PANEL,
   *   icon: <IDashboard style={{ fontSize: '16px' }} />,
   * },
   */
  {
    key: ITEM_KEY.PLATFORMS,
    roleKeys: [PLATFORM_ADMIN_ID],
    name: 'Platform',
    route: PLATFORMS,
    icon: <ICrm style={{ fontSize: '16px' }} />,
  },
  {
    key: ITEM_KEY.TENANTS,
    roleKeys: [PLATFORM_ADMIN_ID],
    name: 'Tenant',
    route: TENANTS,
    icon: <IBucket style={{ fontSize: '16px' }} />,
  },
  {
    key: ITEM_KEY.CLUSTER_MANAGEMENT,
    roleKeys: [CLUSTER_ADMIN_ID, PLATFORM_ADMIN_ID],
    name: 'Cluster',
    route: CLUSTER_MANAGEMENT,
    icon: <IServer style={{ fontSize: '16px' }} />,
  },
  {
    key: ITEM_KEY.OPERATION_HISTORY,
    roleKeys: [PLATFORM_ADMIN_ID],
    name: 'Operation History',
    route: OPERATION_HISTORY,
    icon: <HistoryOutlined style={{ fontSize: '16px' }} />,
  },
]

const { Item } = SideMenu

const Sider = ({ roles }: ISliderProps) => {
  const location = useLocation()
  const [selectedKey, setSelectedKey] = React.useState<string>(location.pathname.split('/')[1])

  const checkPermissionMaps = {
    project: useCheckPermission(PERMISSION_RESOURCE.PROJECT)(),
  }

  const handleMenuSelect = ({ key }) => {
    setSelectedKey(key)
  }
  React.useEffect(() => {
    setSelectedKey(location.pathname.split('/')[1])
  }, [location.pathname])
  const menu = (
    <Menu
      mode="inline"
      defaultSelectedKeys={[ITEM_KEY.PROJECT_MGT]}
      onSelect={handleMenuSelect}
      selectedKeys={[selectedKey]}
    >
      {MENU_ITEMS.map((menuItem) => {
        if (
          (menuItem.roleKeys && menuItem.roleKeys.some((roleKey) => hasRole(roles, roleKey))) ||
          (menuItem.permissionKey && checkPermissionMaps[menuItem.permissionKey])
        )
          return (
            <Item key={menuItem.key} icon={menuItem.icon}>
              <Link to={menuItem.route}>{menuItem.name}</Link>
            </Item>
          )

        return null
      })}
    </Menu>
  )

  return <SideBar width={200} collapsedWidth={48} menu={menu} />
}
export default Sider
