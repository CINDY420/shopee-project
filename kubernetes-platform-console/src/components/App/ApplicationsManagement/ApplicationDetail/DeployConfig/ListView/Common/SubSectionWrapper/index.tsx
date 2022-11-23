import { VerticalDivider } from 'common-styles/divider'
import React from 'react'
import {
  Root,
  Title,
  Content,
  Hint
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SubSectionWrapper/style'

interface ISubSectionWrapper {
  subTitle: string | React.ReactNode
  notice?: string | React.ReactNode
}

const SubSectionWrapper: React.FC<ISubSectionWrapper> = ({ subTitle, notice, children }) => {
  return (
    <>
      <VerticalDivider size='1px' backgroundColor='#EEEEEE' />
      <Root>
        <Title>{subTitle}</Title>
        <Hint>{notice}</Hint>
        <Content>{children}</Content>
      </Root>
    </>
  )
}

export default SubSectionWrapper
