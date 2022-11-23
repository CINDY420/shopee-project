import styled from 'styled-components'
import { Tabs } from 'infrad'

interface IStyledTabsTabs {
  top?: number
}

export const StyledTabs = styled(Tabs)`
  padding: 0 24px 0 24px;
  & .ant-tabs-nav {
    margin-bottom: 0px;
    border-bottom: 0;
  }

  & .ant-tabs-content-holder {
    width: 100%;
    position: absolute;
    top: ${(props: IStyledTabsTabs) => `${props.top}px` || 0};
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
  }

  & .ant-tabs-content {
    height: 100%;
  }
`
