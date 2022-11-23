import * as React from 'react'
import { Button } from 'infrad'
import { DownOutlined, UpOutlined } from 'infra-design-icons'

import { Wrapper, Panel } from './style'

interface ITaintCollapseProps {
  panel: any
  needMore: boolean
}

const TaintCollapse: React.FC<ITaintCollapseProps> = props => {
  const { panel, needMore } = props
  const [collapsed, setCollapsed] = React.useState(needMore)

  const changeCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Wrapper collapsed={collapsed} height={needMore ? '100px' : 'auto'}>
      <Panel collapsed={collapsed}>{panel}</Panel>
      {needMore ? (
        <Button type='link' onClick={changeCollapsed}>
          {collapsed ? 'More' : 'Collapse'}
          {collapsed ? <DownOutlined /> : <UpOutlined />}
        </Button>
      ) : null}
    </Wrapper>
  )
}

export default TaintCollapse
