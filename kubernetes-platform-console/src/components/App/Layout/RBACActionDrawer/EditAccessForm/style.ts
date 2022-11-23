import styled from 'styled-components'
import { Cascader } from 'infrad'

export const FlexDiv: any = styled.div`
  .ant-form-item-control-input-content {
    display: flex;
  }

  .anticon-delete {
    margin: 5px 10px 0px 25px;
    svg {
      width: 20px;
      height: 20px;
    }
  }

  .ant-form-item-required {
  }
  .ant-form-item-label > label::before {
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
`

export const StyledCascader: any = styled(Cascader)`
  width: 80%;

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
