import styled from 'styled-components'

import { Menu } from 'infrad'

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
