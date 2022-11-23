import * as React from 'react'
import { Alert, AlertProps, Form, Input, message, Modal } from 'infrad'
import { IModels } from 'src/rapper/request'
import { DeploymentContext, getDispatchers } from 'src/components/Deployment/useDeploymentContext'
import { DeploymentActions, MoreActions } from 'src/constants/deployment'
import { InfoCircleOutlined } from 'infra-design-icons'
import { useRequest } from 'ahooks'
import { fetch } from 'src/rapper'
import { useHistory } from 'react-router-dom'

type DeploymentMeta = IModels['GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/meta']['Res']

interface IMoreActionProps {
  superiorRoute: string
  sduName: string
  deployId: string
  deploymentMeta: DeploymentMeta
}

interface IFormValues {
  sduName: string
  az: string
  componentType: string
}

type NoticesMap = Record<string, null | { type: AlertProps['type']; message: React.ReactNode }>

const MoreAction: React.FC<IMoreActionProps> = ({
  superiorRoute,
  sduName,
  deployId,
  deploymentMeta,
}) => {
  const { azV1: az, componentType, cluster } = deploymentMeta || {}
  const [form] = Form.useForm<IFormValues>()

  const history = useHistory()

  const { state, dispatch } = React.useContext(DeploymentContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { action } = state
  const modalVisible = MoreActions.includes(action)

  const Notices: NoticesMap = {
    [DeploymentActions.FULL_RELEASE]: null,
    [DeploymentActions.CANCEL_CANARY]: null,
    [DeploymentActions.SUSPEND]: {
      type: 'info',
      message:
        'Suspend service by scaling down to 0. Deploy Config will be updated at the same time.',
    },
    [DeploymentActions.STOP]: {
      type: 'warning',
      message:
        'Stop the SDUs of ECP by scaling down all deployments of that service to 0 and delete all deployments. Deploy Config will be updated at the same time. ',
    },
  }
  const actionNotice = Notices?.[action]

  const confirmFnMap: Record<string, () => Promise<{}>> = {
    [DeploymentActions.FULL_RELEASE]: () =>
      fetch['POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:fullRelease']({
        sduName,
        deployId,
      }),
    [DeploymentActions.CANCEL_CANARY]: () =>
      fetch['POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:cancelCanary']({
        sduName,
        deployId,
      }),
    [DeploymentActions.SUSPEND]: () =>
      fetch['POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:suspend']({ sduName, deployId }),
    [DeploymentActions.STOP]: () =>
      fetch['POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:stop']({ sduName, deployId }),
  }

  React.useEffect(() => {
    form.setFieldsValue({
      sduName,
      az: `${az}(${cluster})`,
      componentType,
    })
  }, [az, cluster, componentType, form, modalVisible, sduName])

  const handleCancel = () => {
    form.resetFields()
    dispatchers.exitEdit()
  }

  const { loading, runAsync: handleConfirm } = useRequest(
    async () => {
      await confirmFnMap[action]()
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(`${action} deployment succeeded.`)
        handleCancel()
        if (action === DeploymentActions.STOP) {
          history.push(superiorRoute)
        }
        dispatchers.requestRefresh()
      },
    },
  )

  return (
    <Modal
      visible={modalVisible}
      title={
        <>
          {action}
          <InfoCircleOutlined
            style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 8 }}
            onClick={() => {
              window.open(
                'https://confluence.shopee.io/pages/viewpage.action?pageId=1084134803#SDUOperationsonServiceCMDB-DeploymentLevel%EF%BC%88SZK8S%EF%BC%89',
              )
            }}
          />
        </>
      }
      onOk={handleConfirm}
      okText="Confirm"
      onCancel={handleCancel}
      confirmLoading={loading}
      width={800}
    >
      {actionNotice && (
        <Alert
          message={actionNotice.message}
          type={actionNotice.type}
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="SDU Name" name="sduName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="AZ" name="az">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Workload Type" name="componentType">
          <Input disabled />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MoreAction
