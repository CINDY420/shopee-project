import React from 'react'
import SiderMenu from 'src/components/App/Layout/SiderMenu'
import Content from 'src/components/App/Layout/Content'
import { StyledLayout } from 'src/components/App/Layout/style'

const { Sider, Content: ContentWrapper } = StyledLayout

const Layout: React.FC = () => (
  <StyledLayout>
    <Sider
      style={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)', zIndex: 100 }}
      theme="light"
      width={104}
    >
      <SiderMenu />
    </Sider>
    <ContentWrapper>
      <Content />
    </ContentWrapper>
  </StyledLayout>
)

export default Layout
