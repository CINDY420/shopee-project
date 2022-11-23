import styled from 'styled-components'
import { Cascader } from 'infrad'

export const StyledCascader: any = styled(Cascader)`
  /* increase height from 180px */
  .ant-cascader-menu {
    height: 280px;
  }

  /* gap of menu items */
  .ant-cascader-menu-item {
    padding: 8px 24px 8px 12px;
  }

  /* increase top */
  .ant-cascader-menu-item-expand .ant-cascader-menu-item-expand-icon,
  .ant-cascader-menu-item-loading-icon {
    position: absolute;
    top: 16px;
  }
`

export const PlatformUserHint = styled.div`
  color: #ff4742;
`
