import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import SideBar from 'components/Common/SideBar'
import '@testing-library/jest-dom/extend-expect'
import { SideMenu } from 'common-styles/menu'
import { CodeOutlined, SendOutlined } from 'infra-design-icons'
const { Item, ItemGroup } = SideMenu

const MockMenuItem = (
  <SideMenu mode='inline'>
    <Item key='item1' icon={<CodeOutlined />}>
      item1
    </Item>
    <ItemGroup>
      <Item key='item2' icon={<SendOutlined />}>
        item2
      </Item>
    </ItemGroup>
  </SideMenu>
)
const mockWidth = 210
const mockCollapseWidth = 48

describe('SideBar render UI result', () => {
  it('should display side bar correctly', async () => {
    render(<SideBar width={mockWidth} collapsedWidth={mockCollapseWidth} menu={MockMenuItem} />)

    await waitFor(() => {
      expect(screen.queryByText('Collapse')).toBeTruthy()
    })
    expect(screen.queryByText('Collapse')).toBeTruthy()
    expect(document.querySelector('.ant-layout-sider-children > ul')).toHaveClass('ant-menu-inline')
    expect(document.getElementsByClassName('ant-layout-sider-trigger')[0]).toHaveStyle(`width: ${mockWidth}px`)

    fireEvent.click(document.getElementsByClassName('ant-layout-sider-trigger')[0])
    expect(screen.queryByText('Collapse')).not.toBeTruthy()
    expect(document.querySelector('.ant-layout-sider-children > ul')).toHaveClass('ant-menu-vertical')
    expect(document.getElementsByClassName('ant-layout-sider-trigger')[0]).toHaveStyle(`width: ${mockCollapseWidth}px`)

    fireEvent.click(document.getElementsByClassName('ant-layout-sider-trigger')[0])
    expect(screen.queryByText('Collapse')).toBeTruthy()
    expect(document.querySelector('.ant-layout-sider-children > ul')).toHaveClass('ant-menu-inline')
    expect(document.getElementsByClassName('ant-layout-sider-trigger')[0]).toHaveStyle(`width: ${mockWidth}px`)
  })
})
