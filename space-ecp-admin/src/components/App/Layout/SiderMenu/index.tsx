import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import InfraDesignIcon, { ClusterOutlined, ICrm, IGridview } from 'infra-design-icons'
import { StyledMenu, IconWrapper, ItemText } from 'src/components/App/Layout/SiderMenu/style'
import { CLUSTER, SEGMENT, TENANT } from 'src/constants/routes/routes'
import { matchPath } from 'react-router'

const { Item } = StyledMenu

// Add menu item here
const menuItems: { route: string; Icon: typeof InfraDesignIcon; text: string }[] = [
  {
    route: CLUSTER,
    Icon: ClusterOutlined,
    text: 'Cluster',
  },
  {
    route: TENANT,
    Icon: ICrm,
    text: 'Tenant',
  },
  {
    route: SEGMENT,
    Icon: IGridview,
    text: 'Segment',
  },
]

const SiderMenu: React.FC = () => {
  const location = useLocation()
  const pathname = location.pathname
  const selectedMenu = menuItems
    .sort((menu1, menu2) => menu2.route.length - menu1.route.length)
    .find(
      ({ route }) =>
        matchPath(pathname, {
          path: route,
        }) !== null,
    )
  const selectedKey = selectedMenu ? selectedMenu.route : pathname

  return (
    <StyledMenu mode="inline" selectedKeys={[selectedKey]}>
      {menuItems.map(({ route, Icon, text }) => (
        <Item key={route}>
          <IconWrapper>
            <Icon style={{ fontSize: 20 }} />
          </IconWrapper>
          <ItemText>
            <Link to={route}>{text}</Link>
          </ItemText>
        </Item>
      ))}
    </StyledMenu>
  )
}

export default SiderMenu
