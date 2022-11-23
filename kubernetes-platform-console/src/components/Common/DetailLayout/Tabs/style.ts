import styled from 'styled-components'
import { Tabs } from 'infrad'

export const DetailPageRoot = styled.div`
  min-width: 70em;
  height: 100%;
  overflow: auto;
`
interface IDetailPageTabs {
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
    top: ${(props: IDetailPageTabs) => props.top || 0};
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
`

interface IProps {
  background?: boolean
}

export const DetailPageTabPaneRoot = styled.div<IProps>`
  width: 100%;
  padding: 2em;
  height: 100%;
  background-color: ${props => (props.background ? '#f1f5f5' : 'transparent')};
`
