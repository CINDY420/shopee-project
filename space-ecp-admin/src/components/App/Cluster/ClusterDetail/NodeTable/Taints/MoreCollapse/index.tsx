import React from 'react'
import { Button } from 'infrad'
import { DownOutlined, UpOutlined } from 'infra-design-icons'

import {
  Root,
  Panel,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/Taints/MoreCollapse/style'

interface IMoreCollapseProps {
  panel: React.ReactNode
  needMore: boolean
}

const MoreCollapse: React.FC<IMoreCollapseProps> = (props) => {
  const { panel, needMore } = props
  const [collapsed, setCollapsed] = React.useState(needMore)

  const handleCollapseChange = () => {
    setCollapsed(!collapsed)
  }
  return (
    <Root collapsed={collapsed} height={needMore ? '100px' : 'auto'}>
      <Panel collapsed={collapsed}>{panel}</Panel>
      {needMore ? (
        <Button type="link" onClick={handleCollapseChange}>
          {collapsed ? 'More' : 'Collapse'}
          {collapsed ? <DownOutlined /> : <UpOutlined />}
        </Button>
      ) : null}
    </Root>
  )
}

export default MoreCollapse
