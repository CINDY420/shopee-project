import styled from 'styled-components'
import { Tabs } from 'infrad'

interface IDetailPageTabsProps {
  top?: string
}

export const DetailPageTabs = styled(Tabs)`
  & .ant-tabs-nav {
    margin-bottom: 0px;
    border-bottom: 0;
  }

  & .ant-tabs-nav-wrap {
    border-bottom: 0;
  }

  & .ant-tabs-content {
    height: 97%;
  }

  & .ant-tabs-content-holder {
    width: 100%;
    position: absolute;
    top: ${(props: IDetailPageTabsProps) => props.top || 0};
    bottom: 0;
    left: 0;
    right: 0;
  }
`
