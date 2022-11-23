import React from 'react'
import { Tooltip, TooltipProps } from 'infrad'
import { InfoCircleOutlined } from 'infra-design-icons'
import { CSSProperties } from 'styled-components'

interface IInfoTooltipProps {
  info: string
  placement?: TooltipProps['placement']
  fontSize?: number | string
  getPopupContainer?: TooltipProps['getPopupContainer']
  style?: CSSProperties
}

const InfoTooltip: React.FC<IInfoTooltipProps> = ({
  info,
  placement = 'top',
  fontSize = 12.5,
  getPopupContainer,
  style,
}) => (
  <Tooltip
    title={info}
    placement={placement}
    overlayInnerStyle={{ whiteSpace: 'pre-wrap' }}
    getPopupContainer={getPopupContainer}
  >
    <InfoCircleOutlined
      style={{
        fontSize,
        color: 'rgba(0, 0, 0, 0.45)',
        marginLeft: 5,
        verticalAlign: 'middle',
        ...style,
      }}
    />
  </Tooltip>
)

export default InfoTooltip
