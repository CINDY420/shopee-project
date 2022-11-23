import React from 'react'
import { Tooltip, TooltipProps } from 'infrad'
import { InfoCircleOutlined } from 'infra-design-icons'

interface IInfoTooltipProps {
  info: string
  placement?: TooltipProps['placement']
  fontSize?: number | string
  getPopupContainer?: TooltipProps['getPopupContainer']
}

const InfoTooltip: React.FC<IInfoTooltipProps> = ({
  info,
  placement = 'top',
  fontSize = 12.5,
  getPopupContainer,
}) => (
  <Tooltip
    title={info}
    placement={placement}
    overlayInnerStyle={{ whiteSpace: 'pre-wrap' }}
    getPopupContainer={getPopupContainer}
  >
    <InfoCircleOutlined
      style={{ fontSize, color: 'rgba(0, 0, 0, 0.45)', marginLeft: 5, verticalAlign: 'inherit' }}
    />
  </Tooltip>
)

export default InfoTooltip
