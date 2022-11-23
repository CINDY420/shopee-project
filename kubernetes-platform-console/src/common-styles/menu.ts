import styled from 'styled-components'

import { Menu } from 'infrad'

export const StyledMenu = styled(Menu)`
  .ant-dropdown-menu-item:hover {
    color: #1890ff;
    background: #f1f2f5;
  }
`
export const SideMenu = styled(Menu)`
  width: 100%;

  .ant-menu-item,
  .ant-menu-submenu-title {
    padding: 0 16px !important;
    margin: 0 !important;
  }

  .ant-menu-selected::after,
  .ant-menu-item-selected::after {
    left: 0;
    right: inherit;
  }

  .ant-menu-sub .ant-menu-item {
    padding-left: 42px !important;
  }

  .ant-menu-item-selected {
    font-weight: 500;
  }

  .ant-menu-item-selected::before {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    border-right: 3px solid #2673dd;
    content: '';
  }

  .ant-menu-item-selected span::before {
    color: inherit;
  }

  &.ant-menu-inline-collapsed {
    width: 48px;
  }

  .ant-menu-item-group-title {
    font-size: 12px;
  }
`

export const SideSubmenu = styled(Menu.SubMenu)`
  width: 100%;

  &.ant-menu-submenu-vertical.ant-menu-submenu-selected .ant-menu-submenu-title::before {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    border-right: 3px solid #2673dd;
    content: '';
  }
`

export const StyledSpan: any = styled.span`
  &::before {
    display: ${(props: any) => (props.marked ? 'none' : 'block')};
    content: '\u2219';
    position: absolute;
    color: #b7b7b7;
    left: 20px;
  }
`

export const DividerLine = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &::after {
    content: '';
    display: block;
    width: 16px;
    border-top: 1px solid #e5e5e5;
  }
`
