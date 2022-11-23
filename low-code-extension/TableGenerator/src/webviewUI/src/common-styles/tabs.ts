import styled from 'styled-components'
import { Tabs as AntdTabs } from 'antd'

export const Tabs = styled(AntdTabs)`
  .ant-tabs-nav {
    margin: 0 0 24px 0;
    line-height: 18px;
  }
  .ant-tabs-tab {
    padding: 0 19px 16px 19px;
  }
  .ant-tabs-tab + .ant-tabs-tab {
    margin: 0;
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn span {
    color: #2673dd;
  }
`
