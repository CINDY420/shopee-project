import * as React from 'react'
import { Menu, Dropdown, Avatar, Typography } from 'infrad'
import { IUserInfo } from 'helpers/session'
import { MenuInfo } from 'rc-menu/lib/interface'
import { ILogout, DownOutlined } from 'infra-design-icons'
import { HorizontalDivider } from 'common-styles/divider'
import {
  HorizonCenterWrapper,
  HeaderWrapper,
  TitleWrapper,
  TitleIcon,
  Title,
  LogoWrapper,
} from 'components/App/Layout/Header/style'

const { Text } = Typography

interface IHeaderProps {
  onLogout: () => void
  loginedUser: IUserInfo
}

const Header: React.FC<IHeaderProps> = ({ onLogout, loginedUser }) => {
  const { email, userId, avatar } = loginedUser
  const handleClickMenu = (e: MenuInfo) => {
    switch (e.key) {
      case 'logout':
        onLogout()
        return null
    }
  }

  const menu = (
    <Menu onClick={handleClickMenu}>
      <Menu.Item key="user" disabled>
        {email}
        <br />
        userId: {userId}
      </Menu.Item>
      <Menu.Item icon={<ILogout />} key="logout">
        Log out
      </Menu.Item>
    </Menu>
  )

  return (
    <HeaderWrapper>
      <TitleWrapper>
        <TitleIcon />
        <HorizontalDivider />
        <Title>Shopee Batch Platform</Title>
      </TitleWrapper>
      <HorizonCenterWrapper>
        <Dropdown overlay={menu}>
          <LogoWrapper>
            <Avatar size={32} src={avatar} />
            <HorizontalDivider size="8px" />
            <Text type="secondary">{email}</Text>
            <HorizontalDivider size="6px" />
            <DownOutlined style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }} />
          </LogoWrapper>
        </Dropdown>
        <HorizontalDivider size="24px" />
        {/* TODO: 之后加上 tiancheng.zhang@shopee.com */}
        {/* <Divider
          type='vertical'
          style={{ borderLeft: '1px solid rgba(238, 238, 238, 0.2)', margin: '0', height: '32px' }}
        /> */}
        {/* <HorizontalDivider size='25px' />
        <HorizontalDivider size='16px' /> */}
        {/* <HubButton
          shape='round'
          target='_blank'
          href='https://confluence.shopee.io/pages/viewpage.action?pageId=650719122'
        >
          Education Hub
        </HubButton> */}
      </HorizonCenterWrapper>
    </HeaderWrapper>
  )
}

export default Header
