import React from 'react'
import { Content } from 'src/components/DeployConfig/ListView/Common/RowFormField/style'
import LabelWithTooltip from 'src/components/DeployConfig/ListView/Common/LabelWithTooltip'

interface IRowFormFieldProps {
  rowKey?: string | React.ReactNode
  width?: string
  hasBackground?: boolean
  tooltip?: string | React.ReactNode
  children?: React.ReactNode
}

const RowFormField: React.FC<IRowFormFieldProps> = (props) => {
  const { rowKey = '', width = '85%', hasBackground = true, tooltip, children } = props

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '8px' }}>
        {tooltip ? <LabelWithTooltip label={rowKey} tooltip={tooltip} /> : rowKey}
      </div>
      <Content width={width} hasBackground={hasBackground}>
        {children}
      </Content>
    </div>
  )
}

export default RowFormField
