import styled from 'styled-components'
import { Tabs } from 'infrad'

export const Wrapper = styled.div`
  background-color: #ffffff;
  height: 100%;
  overflow: auto;
`
export const ContentWrapper = styled.div`
  padding: 0 24px;
  height: 100%;
`
export const StyledTabs = styled(Tabs)`
  & .ant-tabs-nav {
    margin-bottom: 24px;
  }
  .ant-tabs-nav-wrap {
    padding-left: 24px;
  }
`
