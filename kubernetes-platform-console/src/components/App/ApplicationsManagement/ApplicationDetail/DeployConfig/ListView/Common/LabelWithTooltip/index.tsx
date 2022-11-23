import React from 'react'
import { HorizonCenterWrapper } from 'common-styles/flexWrapper'
import {
  StyledQuestionCircleOutlined,
  StyledTooltip
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/LabelWithTooltip/style'

interface ILabelWithTooltipProps {
  label: string | React.ReactNode
  tooltip: string | React.ReactNode
  subTitle?: React.ReactNode
}

const LabelWithTooltip: React.FC<ILabelWithTooltipProps> = props => {
  const { label, tooltip, subTitle } = props

  return (
    <HorizonCenterWrapper>
      {label}
      <StyledTooltip placement='top' title={tooltip}>
        <StyledQuestionCircleOutlined />
      </StyledTooltip>
      {subTitle}
    </HorizonCenterWrapper>
  )
}

export default LabelWithTooltip
