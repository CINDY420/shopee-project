import React, { useState } from 'react'
import { ConfigProvider } from 'infrad'
import { MenuFoldOutlined } from 'infra-design-icons'
import { StyledSider, CollapseWrapper } from './style'

interface ISiderBar {
  width: number
  collapsedWidth: number
  menu: React.ReactNode
  onCollapse?: (collapsed: boolean) => void
}

const SideBar: React.FC<ISiderBar> = ({ width, collapsedWidth, menu, onCollapse }) => {
  const [menuCollapsed, setMenuCollapsed] = useState(false)
  const handleSiderCollapse = (collapsed: boolean) => {
    setMenuCollapsed(collapsed)
    onCollapse && onCollapse(collapsed)
  }

  const Trigger = (
    <CollapseWrapper>
      {menuCollapsed ? (
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
        theme='light'
        collapsedWidth={collapsedWidth}
        width={width}
        collapsible={true}
        collapsed={menuCollapsed}
        trigger={Trigger}
        onCollapse={handleSiderCollapse}
      >
        {menu}
      </StyledSider>
    </ConfigProvider>
  )
}

export default SideBar
