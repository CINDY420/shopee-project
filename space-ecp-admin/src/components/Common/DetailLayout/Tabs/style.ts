import styled from 'styled-components'
import { Tabs } from 'infrad'

export const StyledTabs = styled(Tabs)`
  overflow: hidden;

  .ant-tabs-tab {
    font-size: 16px;
  }

  .ant-tabs-nav {
    padding: 0 24px;
    background-color: #ffffff;
    margin-bottom: 24px;
  }

  .ant-tabs-content-holder {
    overflow-y: auto;
    padding: 0 24px 24px;
  }
`
