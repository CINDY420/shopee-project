import * as React from 'react'
import { Dropdown, Radio } from 'infrad'
import { ReloadOutlined, SettingOutlined } from 'infra-design-icons'
import {
  StyledMenu,
  MenuTitle,
  StyledRadioGroup,
} from 'src/components/Container/TitleBar/ReloadButton/style'

interface IReloadButtonProps {
  onReload: () => void
  onReloadRateChange: (rate: number) => void
  reloadRate: number
}

const ReloadButton: React.FC<IReloadButtonProps> = (props) => {
  const { onReload, onReloadRateChange, reloadRate } = props

  const reloadMenu = (
    <StyledMenu>
      <MenuTitle>Refresh Interval</MenuTitle>
      <StyledRadioGroup value={reloadRate} onChange={(e) => onReloadRateChange(e.target.value)}>
        <Radio value={undefined}>off</Radio>
        <Radio value={5000}>5 Seconds</Radio>
        <Radio value={10000}>10 Seconds</Radio>
        <Radio value={15000}>15 Seconds</Radio>
        <Radio value={30000}>30 Seconds</Radio>
        <Radio value={60000}>1 Minutes</Radio>
      </StyledRadioGroup>
    </StyledMenu>
  )

  return (
    <Dropdown.Button onClick={onReload} overlay={reloadMenu} icon={<SettingOutlined />}>
      <ReloadOutlined />
      Reload
    </Dropdown.Button>
  )
}

export default ReloadButton
