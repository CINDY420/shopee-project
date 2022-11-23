import styled from 'styled-components'
import { Layout, PageHeader } from 'infrad'

const { Content } = Layout

export const StyledLayout = styled(Layout)`
  height: 100%;
`

export const ContentWrapper = styled(Content)`
  padding: 24px;
  background-color: rgb(240, 242, 245);
  height: 100%;
  overflow-y: auto;
`

export const StyledContent = styled(Content)`
  padding: 16px 24px;
  background-color: #ffffff;
  overflow-x: auto;
`

export const StyledPageHeader = styled(PageHeader)`
  background-color: #ffffff;

  .ant-page-header-heading-title {
    font-size: 24px;
  }

  .ant-page-header-heading-left,
  .ant-page-header-heading-extra {
    margin: 0;
  }
`
