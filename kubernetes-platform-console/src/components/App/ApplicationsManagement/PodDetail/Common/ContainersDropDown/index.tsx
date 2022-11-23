import * as React from 'react'

import { Dropdown, Button, Menu } from 'infrad'
import { DownOutlined } from 'infra-design-icons'

interface IContainersDropDownProps {
  containers: string[]
  selectedContainer: string
  onContainerSelect: (containerName: string) => void
}

const ContainersDropDown: React.FC<IContainersDropDownProps> = ({
  containers,
  selectedContainer,
  onContainerSelect
}) => {
  function handleMenuClick(info: { key: string }) {
    onContainerSelect(info.key)
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      {containers.map((container: string) => (
        <Menu.Item key={container}>{container}</Menu.Item>
      ))}
    </Menu>
  )

  return (
    <div>
      <span style={{ marginRight: '5px' }}>Container:</span>
      <Dropdown overlay={menu}>
        <Button>
          {selectedContainer} <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  )
}

export default ContainersDropDown
