import * as React from 'react'
import { Link } from 'react-router-dom'
import { matchPath } from 'react-router'
import { Location } from 'history'
import { Menu, Avatar, Dropdown, Typography, Divider, message } from 'infrad'
import { LogoutOutlined, DownOutlined, SwapOutlined, EditOutlined } from 'infra-design-icons'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

import { roleControllerIsRoleRequestPending, roleControllerGetRbacUserInfo } from 'swagger-api/v3/apis/UserRole'
import useAsyncFn from 'hooks/useAsyncFn'

import history from 'helpers/history'

import { HorizontalDivider } from 'common-styles/divider'
import { APPLICATIONS, PENDING_MY_ACTION_LIST, OPERATION_LOGS, GATEWAYS, ACCESS_REQUEST } from 'constants/routes/routes'
import RequestOrApprovalWithBadge from './RequestOrApprovalWithBadge'
import HeaderSearch from './HeaderSearch'
import {
  HeaderWrapper,
  TitleWrapper,
  TitleIcon,
  Title,
  MenuWrapper,
  HeaderMenu,
  LogoWrapper,
  ActionWrapper,
  HubButton
} from './style'

import { HorizonCenterWrapper } from 'common-styles/flexWrapper'
import TenantSwitcher from './TenantSwitcher'
import { GLOBAL_CONTEXT_ACTION_TYPES, GlobalContext } from 'hocs/useGlobalContext'

import { LogIcon } from './CustomIcon'

const { Text } = Typography
const { Item } = Menu
const MENU = [
  {
    displayName: 'Applications',
    to: APPLICATIONS
  },
  {
    displayName: 'Gateway',
    to: GATEWAYS
  }
  // {
  //   displayName: 'Pipelines',
  //   to: PIPELINES
  // }
  // {
  //   displayName: 'Platform Management',
  //   to: PLATFORM
  // }
].filter(m => m)

interface IHeaderProps {
  location: Location
  loginedUser: any
  onLogout: () => any
  onChangeRole: () => void
  onAddRole: () => void
}

const handleAccessRequest = () => {
  history.push(ACCESS_REQUEST)
}

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const [roleList, setRoleList] = React.useState([])
  const [roleRequestPending, setRoleRequestPending] = React.useState<boolean>(false)
  const [, getUserRoleBindingFn] = useAsyncFn(roleControllerGetRbacUserInfo)

  const { location, loginedUser, onLogout, onChangeRole, onAddRole } = props
  const { avatar, name, userId } = loginedUser

  const accessControlContext = React.useContext(AccessControlContext)

  const platformManagementActions = accessControlContext[RESOURCE_TYPE.CLUSTER] || []
  const operationLogActions = accessControlContext[RESOURCE_TYPE.OPERATION_LOG] || []

  const canViewPlatformManagement = platformManagementActions.includes(RESOURCE_ACTION.View)
  const canViewOperationLog = operationLogActions.includes(RESOURCE_ACTION.View)
  const canViewTicketCenter = true

  const isUnbindUser = roleList.length > 0
  const getAllMenuPaths = (menuList: any[]) => {
    const paths: any[] = []
    const getMenuPaths = (menu: any) => {
      const { to, children = [] } = menu
      if (children.length > 0) {
        return children.map((item: any) => getMenuPaths(item))
      } else {
        return paths.push(to)
      }
    }
    menuList.forEach(menu => {
      getMenuPaths(menu)
    })
    return paths
  }

  const getMenuSelectedKeys = (menuList: any[]) => {
    const paths = getAllMenuPaths(menuList)
    const selectedKeys = paths.filter(path => matchPath(location.pathname, { path, exact: false }))
    return selectedKeys.length > 0 ? selectedKeys : []
  }

  const handleClickMenu = ({ key }: any) => {
    switch (key) {
      case 'logout':
        onLogout()
        return null
      case 'change-role':
        onChangeRole()
        break
      case 'add-role':
        onAddRole()
        break
      case 'access-request':
        handleAccessRequest()
        break
      default:
        throw new Error('Select key is not found!')
    }
  }

  const handleDropDownVisible = async (visible: boolean) => {
    if (visible && isUnbindUser) {
      try {
        const data = await roleControllerIsRoleRequestPending()
        const { isRoleRequestPending } = data
        setRoleRequestPending(isRoleRequestPending)
      } catch (err) {
        err.message && message.error(err.message)
      }
    }
  }

  const { dispatch } = React.useContext(GlobalContext)

  const getUserRoleList = React.useCallback(async () => {
    let userRoleBinding = { roles: [] }

    try {
      userRoleBinding = await getUserRoleBindingFn({ userId })
    } catch (err) {
      console.error(err)
    }

    const { roles } = userRoleBinding
    if (roles.length > 0) {
      setRoleList(roles)
      dispatch({ type: GLOBAL_CONTEXT_ACTION_TYPES.USER_ROLES, userRoles: roles })
    }
  }, [dispatch, getUserRoleBindingFn, userId])

  React.useEffect(() => {
    // request user roles which are used globally
    getUserRoleList()
  }, [getUserRoleList])

  return (
    <HeaderWrapper justifyContent={isUnbindUser ? undefined : 'space-between'}>
      <TitleWrapper>
        <TitleIcon />
        <HorizontalDivider size='8px' />
        <Title>Shopee Kubernetes Platform</Title>
      </TitleWrapper>
      {isUnbindUser && (
        <>
          <TenantSwitcher />
          <Divider
            type='vertical'
            style={{ borderLeft: '1px solid rgba(238, 238, 238, 0.2)', margin: '0', height: '32px' }}
          />
        </>
      )}
      {canViewPlatformManagement && (
        <>
          <MenuWrapper>
            <div style={{ minWidth: '320px' }}>
              <HeaderMenu mode='horizontal' theme='dark' selectedKeys={getMenuSelectedKeys(MENU)}>
                {MENU.map((menu: { displayName: string; to: string }) => {
                  const isEntryChanged = !location.pathname.includes(menu.to)
                  return canViewPlatformManagement || menu.displayName !== 'Platform Management' ? (
                    <Item key={menu.to}>
                      {isEntryChanged ? (
                        <Link to={menu.to} replace={menu.to === location.pathname}>
                          {menu.displayName}
                        </Link>
                      ) : (
                        <div>{menu.displayName}</div>
                      )}
                    </Item>
                  ) : null
                })}
              </HeaderMenu>
            </div>
          </MenuWrapper>
          <HeaderSearch />
        </>
      )}
      <HorizonCenterWrapper>
        <Dropdown
          onVisibleChange={handleDropDownVisible}
          overlay={
            <Menu onClick={handleClickMenu}>
              <Menu.Item key='user' disabled>
                <Text style={{ fontFamily: 'Roboto', fontSize: 16, fontWeight: 500 }}>{name}</Text>
                {roleList.map(role => (
                  <div key={role.tenantId + '-' + role.roleId}>
                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: 400 }} type='secondary'>
                      {role.tenantName ? role.tenantName + ' | ' + role.roleName : role.roleName}
                    </Text>
                  </div>
                ))}
              </Menu.Item>
              <Menu.Divider />
              {isUnbindUser ? (
                <Menu.Item key='change-role' disabled={roleRequestPending}>
                  <SwapOutlined style={{ marginRight: '10px' }} />
                  Edit Permission Group
                </Menu.Item>
              ) : (
                <Menu.Item key='access-request'>
                  <EditOutlined style={{ marginRight: '10px' }} />
                  Access Request
                </Menu.Item>
              )}
              {/* {isOldUser && (
                <Menu.Item key='add-role' disabled={roleRequestPending}>
                  <PlusOutlined />
                  Add Role
                </Menu.Item>
              )} */}
              <Menu.Item key='logout'>
                <LogoutOutlined style={{ marginRight: '10px' }} />
                log out
              </Menu.Item>
            </Menu>
          }
        >
          <LogoWrapper style={{ marginLeft: 24 }}>
            <Avatar src={avatar} size={32} />
            <HorizontalDivider size='8px' />
            <Text style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', whiteSpace: 'nowrap' }}>{name}</Text>
            <HorizontalDivider size='8px' />
            <DownOutlined style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }} />
          </LogoWrapper>
        </Dropdown>
        <HorizontalDivider size='16px' />
        <Divider
          type='vertical'
          style={{ borderLeft: '1px solid rgba(238, 238, 238, 0.2)', margin: '0', height: '32px' }}
        />
        <HorizontalDivider size='6px' />
        <ActionWrapper>
          {canViewOperationLog && (
            <>
              <Link to={OPERATION_LOGS} style={{ lineHeight: '100%' }}>
                <LogIcon style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </Link>
              <HorizontalDivider size='8px' />
            </>
          )}
          {canViewTicketCenter && (
            <Link to={PENDING_MY_ACTION_LIST} style={{ lineHeight: '100%' }}>
              <RequestOrApprovalWithBadge isApprover={true} />
            </Link>
          )}
          <HorizontalDivider size='16px' />
          <HubButton
            shape='round'
            target='_blank'
            href='https://confluence.shopee.io/pages/viewpage.action?pageId=650719122'
          >
            Education Hub
          </HubButton>
        </ActionWrapper>
      </HorizonCenterWrapper>
    </HeaderWrapper>
  )
}

export default Header
