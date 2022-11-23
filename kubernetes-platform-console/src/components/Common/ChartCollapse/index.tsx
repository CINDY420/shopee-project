import React from 'react'
import { UpOutlined } from 'infra-design-icons'

import { CollapseButton, StyledCollapse } from './style'

const { Panel } = StyledCollapse

/**
 * This component is used for the chart collapse function in Group and Project pages of K8S system.
 */
interface IChartCollapseProps {
  /** The panel need to be collapsed */
  panel: any
  handleCollapseOpen?: (param?: string[]) => void
}

const ChartCollapse: React.FC<IChartCollapseProps> = props => {
  const { panel, handleCollapseOpen } = props
  const [isActive, setIsActive] = React.useState(false)

  const handleCollapseChange = (value: string[]) => {
    handleCollapseOpen?.(value)
    setIsActive(!!value?.length)
  }
  return (
    <StyledCollapse
      ghost
      expandIcon={({ isActive }) => {
        return <CollapseButton shape='circle' icon={<UpOutlined rotate={isActive ? 0 : 180} />} />
      }}
      onChange={(value: string[]) => handleCollapseChange(value)}
    >
      <Panel header={isActive ? '' : 'Show Resource Charts'}>{panel}</Panel>
    </StyledCollapse>
  )
}

export default ChartCollapse
