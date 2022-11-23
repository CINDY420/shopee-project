import React from 'react'
import { Tooltip } from 'infrad'
import { InfoCircleOutlined } from 'infra-design-icons'
import { TooltipPlacement } from 'infrad/lib/tooltip'

interface IInfoToolTipProps {
  title: string
  info: string
  placement?: TooltipPlacement
  isRequired?: boolean
}

const InfoToolTip: React.FC<IInfoToolTipProps> = ({ isRequired, title, info, placement }) => {
  return (
    <span>
      {isRequired && <span style={{ color: '#FF4D4F', marginRight: '4px' }}>*</span>}
      {title}
      <Tooltip placement={placement} title={info}>
        {' '}
        <InfoCircleOutlined />
      </Tooltip>
    </span>
  )
}

export default InfoToolTip
