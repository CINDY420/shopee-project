import styled from 'styled-components'
import { Menu } from 'infrad'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StyledMenu = styled(Menu as any)`
  &&& {
    width: 100%;

    .ant-menu-item {
      height: 82px;
      margin: 0 !important;
      padding: 0 !important;
      line-height: 14px;
    }

    .ant-menu-selected::after,
    .ant-menu-item-selected::after {
      left: 0;
      right: inherit;
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
  }
`

export const IconWrapper = styled.div`
  text-align: center;
`
export const ItemText = styled.div`
  margin-top: 10px;
  line-height: 18px;
  text-align: center;
  font-size: 12px;
`
