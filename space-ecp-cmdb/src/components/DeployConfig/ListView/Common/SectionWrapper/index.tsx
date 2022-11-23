import React from 'react'
import {
  Root,
  Title,
  Notice,
  Content,
} from 'src/components/DeployConfig/ListView/Common/SectionWrapper/style'
import { FormType, FormAnchorKey } from 'src/components/DeployConfig/useDeployConfigContext'
import LabelWithTooltip from 'src/components/DeployConfig/ListView/Common/LabelWithTooltip'
import { VerticalDivider } from 'src/common-styles/divider'

interface ISectionWrapper {
  title: string | React.ReactNode
  subTitle?: React.ReactNode
  anchorKey: FormType
  notice?: string | React.ReactNode
  tooltip?: string | React.ReactNode
  children?: React.ReactNode
}

const SectionWrapper: React.FC<ISectionWrapper> = ({
  title,
  subTitle,
  anchorKey,
  notice,
  tooltip,
  children,
}) => (
  <Root>
    <Title>
      <span id={FormAnchorKey[anchorKey]} />
      {tooltip ? <LabelWithTooltip label={title} tooltip={tooltip} subTitle={subTitle} /> : title}
    </Title>
    <Notice>{notice}</Notice>
    <VerticalDivider size="1px" backgroundColor="#EEEEEE" />
    <Content>{children}</Content>
  </Root>
)

export default SectionWrapper
