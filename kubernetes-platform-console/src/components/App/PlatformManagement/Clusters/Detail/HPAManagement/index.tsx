import React, { useContext } from 'react'
import { Switch, Popconfirm, Card, message } from 'infrad'
import {
  HPAControllerWrapper,
  HPAControllerText
} from 'components/App/PlatformManagement/Clusters/Detail/HPAManagement/style'
import { clusterControllerGetGlobalHpa, clusterControllerUpdateGlobalHpa } from 'swagger-api/v1/apis/Cluster'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

interface IHPAManagement {
  cluster: string
}

const HPAManagement: React.FC<IHPAManagement> = ({ cluster }) => {
  const accessControlContext = useContext(AccessControlContext)
  const hpaControllerActions = accessControlContext[RESOURCE_TYPE.HPA_CONTROLLER] || []
  const canEditHpaController = hpaControllerActions.includes(RESOURCE_ACTION.Edit)

  const [hpaControllerEnable, setHpaControllerEnable] = React.useState(false)

  const getGlobalHpa = React.useCallback(async () => {
    const { hpaStatus } = await clusterControllerGetGlobalHpa({ cluster })
    setHpaControllerEnable(hpaStatus)
  }, [cluster])

  React.useEffect(() => {
    getGlobalHpa()
  }, [getGlobalHpa])

  const handleConfirm = async () => {
    const payload = { hpaStatus: !hpaControllerEnable }
    try {
      await clusterControllerUpdateGlobalHpa({ cluster, payload })
      setHpaControllerEnable(!hpaControllerEnable)
    } catch (error) {
      error?.message && message.error(error?.message)
    }
  }

  return (
    <Card style={{ marginTop: '16px' }}>
      <HPAControllerWrapper>
        <HPAControllerText>HPA Controller:</HPAControllerText>
        <Popconfirm
          title={`Are you sure ${hpaControllerEnable ? 'disable' : 'recover'} HPA? `}
          okText='Yes'
          cancelText='No'
          getPopupContainer={() => document.body}
          onConfirm={handleConfirm}
          disabled={!canEditHpaController}
        >
          <Switch
            disabled={!canEditHpaController}
            checkedChildren='ON'
            unCheckedChildren='OFF'
            checked={hpaControllerEnable}
          />
        </Popconfirm>
      </HPAControllerWrapper>
    </Card>
  )
}

export default HPAManagement
