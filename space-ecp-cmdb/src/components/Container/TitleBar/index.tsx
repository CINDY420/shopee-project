import { Button, Space } from 'infrad'
import * as React from 'react'
import { Container, Title } from 'src/components/Container/TitleBar/style'
import { DeploymentUnitOutlined } from 'infra-design-icons'
import ReloadButton from 'src/components/Container/TitleBar/ReloadButton'
import BindSDUsModal from 'src/components/Container/TitleBar/BindSDUsModal'
import BulkRollbackModal from 'src/components/Container/TitleBar/BulkRollbackModal'
import DebouncedSearch from 'src/components/Common/DebouncedSearch'
import hooks from 'src/sharedModules/cmdb/hooks'
import constants from 'src/sharedModules/cmdb/constants'
import { useHistory } from 'react-router-dom'

const { useSelectedService } = hooks
const { routes } = constants

interface ITitleBarProps {
  count: number
  onSearchSdu: (name: string) => void
  sduSearchKey: string
  onReload: () => void
  onReloadRateChange: (rate: number) => void
  reloadRate: number
  isGroup: boolean
}

const TitleBar: React.FC<ITitleBarProps> = (props) => {
  const {
    count = 0,
    onSearchSdu,
    sduSearchKey,
    onReload,
    onReloadRateChange,
    reloadRate,
    isGroup,
  } = props
  const [bindSDUsModalVisible, setBindSDUsModalVisible] = React.useState(false)
  const [bulkRollbakModalVisible, setBulkRollbackModalVisible] = React.useState(false)

  const SearchComponent = (
    <DebouncedSearch
      allowClear
      placeholder="Search by SDU name"
      style={{ width: 264 }}
      debounceTime={300}
      callback={onSearchSdu}
      defaultValue={sduSearchKey}
    />
  )

  const history = useHistory()
  const { selectedService } = useSelectedService()
  const { service_name: serviceName } = selectedService

  const handleToDeployConfig = () => {
    const deployConfigPath = `${routes.BASE}/deployment/detail/${serviceName}/config`
    history.push(deployConfigPath)
  }

  return (
    <Container>
      {isGroup ? SearchComponent : <Title>Container({count} instances)</Title>}
      <Space size={8} wrap>
        {!isGroup && (
          <Space>
            <Space size={10} wrap>
              <Button type="link" icon={<DeploymentUnitOutlined />} onClick={handleToDeployConfig}>
                Deployment Config
              </Button>
              {SearchComponent}
            </Space>
            <Space size={8} wrap>
              <Button onClick={() => setBindSDUsModalVisible(true)}>Bind SDU</Button>
              <Button type="primary" onClick={() => setBulkRollbackModalVisible(true)}>
                Bulk Rollback
              </Button>
              <BindSDUsModal
                visible={bindSDUsModalVisible}
                onVisibleChange={setBindSDUsModalVisible}
                onReload={onReload}
              />
              <BulkRollbackModal
                visible={bulkRollbakModalVisible}
                onVisibleChange={setBulkRollbackModalVisible}
                onReload={onReload}
              />
            </Space>
          </Space>
        )}
        <ReloadButton
          onReload={onReload}
          onReloadRateChange={onReloadRateChange}
          reloadRate={reloadRate}
        />
      </Space>
    </Container>
  )
}

export default TitleBar
