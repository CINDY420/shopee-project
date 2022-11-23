import React from 'react'
import {
  Root,
  Title,
  Notice,
  Content
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SectionWrapper/style'
import {
  FORM_TYPE,
  FORM_ANCHOR_KEY
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import LabelWithTooltip from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/LabelWithTooltip'

interface ISectionWrapper {
  title: string | React.ReactNode
  subTitle?: React.ReactNode
  anchorKey: FORM_TYPE
  notice?: string | React.ReactNode
  tooltip?: string | React.ReactNode
}

const SectionWrapper: React.FC<ISectionWrapper> = ({ title, subTitle, anchorKey, notice, tooltip, children }) => {
  return (
    <Root>
      <Title>
        <span id={FORM_ANCHOR_KEY[anchorKey]} />
        {tooltip ? <LabelWithTooltip label={title} tooltip={tooltip} subTitle={subTitle} /> : title}
      </Title>
      <Notice>{notice}</Notice>
      <Content>{children}</Content>
    </Root>
  )
}

export default SectionWrapper
