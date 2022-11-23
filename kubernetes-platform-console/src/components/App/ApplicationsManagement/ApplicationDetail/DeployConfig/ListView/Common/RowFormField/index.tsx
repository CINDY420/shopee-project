import React from 'react'
import {
  Row,
  Key,
  Content
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/RowFormField/style'
import LabelWithTooltip from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/LabelWithTooltip'

interface IRowFormFieldProps {
  rowKey?: string | React.ReactNode
  width?: string
  hasBackground?: boolean
  tooltip?: string | React.ReactNode
}

const RowFormField: React.FC<IRowFormFieldProps> = props => {
  const { rowKey = '', width = '70%', hasBackground = true, children, tooltip } = props

  return (
    <Row>
      <Key>{tooltip ? <LabelWithTooltip label={rowKey} tooltip={tooltip} /> : rowKey}</Key>
      <Content width={width} hasBackground={hasBackground}>
        {children}
      </Content>
    </Row>
  )
}

export default RowFormField
