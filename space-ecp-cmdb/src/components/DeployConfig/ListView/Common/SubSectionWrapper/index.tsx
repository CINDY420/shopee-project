import React from 'react'
import {
  Root,
  Title,
  Content,
  Hint,
} from 'src/components/DeployConfig/ListView/Common/SubSectionWrapper/style'

interface ISubSectionWrapper {
  subTitle: string | React.ReactNode
  notice?: string | React.ReactNode
  children?: React.ReactNode
}

const SubSectionWrapper: React.FC<ISubSectionWrapper> = ({ subTitle, notice, children }) => (
  <>
    <Root>
      <Title>{subTitle}</Title>
      <Hint>{notice}</Hint>
      <Content>{children}</Content>
    </Root>
  </>
)

export default SubSectionWrapper
