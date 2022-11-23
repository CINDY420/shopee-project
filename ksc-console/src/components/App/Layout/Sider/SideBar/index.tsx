import React, { useState } from 'react'
import { ConfigProvider } from 'infrad'
import { MenuFoldOutlined } from 'infra-design-icons'
import { StyledSider, CollapseWrapper } from './style'

interface ISiderBarProps {
  width: number
  collapsedWidth: number
  menu: React.ReactNode
}

const SideBar: React.FC<ISiderBarProps> = ({ width, collapsedWidth, menu }) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false)
  const handleSiderCollapse = (collapsed: boolean) => {
    setIsMenuCollapsed(collapsed)
  }

  const Trigger = (
    <CollapseWrapper>
      {isMenuCollapsed ? (
        <MenuFoldOutlined rotate={180} />
      ) : (
        <span>
          <MenuFoldOutlined /> <span style={{ marginLeft: 12 }}>Collapse</span>
        </span>
      )}
    </CollapseWrapper>
  )

  return (
    <ConfigProvider getPopupContainer={() => document.body}>
      <StyledSider
        theme="light"
        collapsedWidth={collapsedWidth}
        width={width}
        collapsible
        collapsed={isMenuCollapsed}
        trigger={Trigger}
        onCollapse={handleSiderCollapse}
      >
        {menu}
      </StyledSider>
    </ConfigProvider>
  )
}

export default SideBar
