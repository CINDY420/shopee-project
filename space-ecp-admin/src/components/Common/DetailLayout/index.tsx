import React from 'react'
import { StyledLayout, Header, TitleWrapper } from 'src/components/Common/DetailLayout/style'
import TabsDetail, { ITabsDetailProps } from 'src/components/Common/DetailLayout/Tabs'

interface IDetailLayoutProps extends ITabsDetailProps {
  title: React.ReactNode
  breadCrumb?: React.ReactNode
}

export const DetailLayout: React.FC<IDetailLayoutProps> = ({
  breadCrumb,
  title,
  tabs,
  defaultActiveKey,
}) => (
  <StyledLayout>
    <Header>
      {breadCrumb}
      <TitleWrapper hasBreadCrumb={!!breadCrumb}>{title}</TitleWrapper>
    </Header>
    {tabs && <TabsDetail tabs={tabs} defaultActiveKey={defaultActiveKey} />}
  </StyledLayout>
)
