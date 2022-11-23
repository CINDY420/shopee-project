import styled from 'styled-components'
import { Tabs } from 'infrad'

export const Root = styled.div`
  width: 100%;
  height: 100%;
  padding: 2em;
  background-color: #ffffff;
  min-height: 460px;
`
export const Operations = styled.div``

export const RadioTabs = styled.div``

export const StyledTabs = styled(Tabs)`
  height: calc(100% - 32px);

  .ant-tabs-content-holder {
    position: inherit !important;
    border: 1px solid #eee;
    min-height: 500px;
  }

  .ant-tabs-content-holder .ant-tabs-content {
    height: 100%;
  }
`

export const StyledTabPan = styled(Tabs.TabPane)`
  padding: 16px !important;
`
