import styled from 'styled-components'

import { Menu } from 'infrad'

export const StyledMenu = styled(Menu)`
  .ant-menu-selected::after,
  .ant-menu-item-selected::after {
    display: none;
  }

  &:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: inherit;
  }

  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: none;
  }
`

export const Wrapper = styled.div`
  background-color: #fafafa;
  min-height: 304px;
  max-height: 688px;
`

export const Title = styled.div`
  padding: 0 16px;
  line-height: 40px;
  white-space: nowrap;
  color: #b7b7b7;
`

export const SubTitle = styled.div`
  padding: 0 16px;
  line-height: 40px;
  white-space: nowrap;
`

export const Content = styled.div`
  display: flex;
`

export const MenuWrapper = styled.div`
  overflow: auto;
  padding: 4px 0;
  width: 200px;
  min-height: 264px;
  max-height: 648px;
  border-right: 1px solid #f0f0f0;
`
