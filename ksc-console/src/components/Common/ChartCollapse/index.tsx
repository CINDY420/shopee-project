import React from 'react'
import { UpOutlined } from 'infra-design-icons'

import { CollapseButton, StyledCollapse } from 'components/Common/ChartCollapse/style'

const { Panel } = StyledCollapse

interface IChartCollapseProps {
  panel: React.ReactNode
}

const ChartCollapse: React.FC<IChartCollapseProps> = (props) => {
  const { panel } = props
  const [isActive, setIsActive] = React.useState(false)

  return (
    <StyledCollapse
      ghost
      expandIcon={({ isActive = false }) => {
        setIsActive(isActive)
        return <CollapseButton shape="circle" icon={<UpOutlined rotate={isActive ? 0 : 180} />} />
      }}
    >
      <Panel key="useless" header={isActive ? '' : 'Show Resource Charts'}>
        {panel}
      </Panel>
    </StyledCollapse>
  )
}

export default ChartCollapse
