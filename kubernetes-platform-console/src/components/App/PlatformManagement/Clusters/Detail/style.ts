import styled from 'styled-components'
import { Tabs } from 'infrad'

export const Root = styled.div`
  width: 100%;
  height: calc(100% - 45px);
  overflow: hidden;
`

export const StyledTabs = styled(Tabs)`
  height: calc(100% - 52px);

  & .ant-tabs-bar {
    margin-bottom: 0;
    padding: 0 2em;
  }

  & .ant-tabs-content {
    padding: 1em;
    height: calc(100% - 44px);
    overflow: auto;

    > .ant-tabs-tabpane-active {
      height: 100%;
    }
  }
`
