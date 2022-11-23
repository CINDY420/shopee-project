import * as React from 'react'
import { Modal, Input, Form, Checkbox, message } from 'infrad'
import { DeploymentContext, getDispatchers } from 'src/components/Deployment/useDeploymentContext'
import { DeploymentActions } from 'src/constants/deployment'
import { InfoCircleOutlined } from 'infra-design-icons'
import { IModels } from 'src/rapper/request'
import { StyledCheckboxGroup } from 'src/components/Deployment/Action/Restart/style'
import { useRequest } from 'ahooks'
import { fetch } from 'src/rapper'

type DeploymentMeta = IModels['GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/meta']['Res']
interface IRestartProps {
  sduName: string
  deployId: string
  deploymentMeta: DeploymentMeta
}

interface IFormValues {
  sduName: string
  az: string
  componentType: string
  phases: string[]
}

const Restart: React.FC<IRestartProps> = ({ sduName, deployId, deploymentMeta }) => {
  const { azV1: az, componentType, containers, cluster } = deploymentMeta || {}
  const [form] = Form.useForm<IFormValues>()

  const { state, dispatch } = React.useContext(DeploymentContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { action } = state
  const modalVisible = action === DeploymentActions.RESTART

  const deduplicatedPhases = React.useMemo(() => {
    const phases = containers.map((item) => item.phase)
    return Array.from(new Set(phases))
  }, [containers])

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

  const { loading, runAsync: restartDeploymentFn } = useRequest(
    async (phases: string[]) => {
      await fetch['POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:restart']({
        sduName,
        deployId,
        phases,
      })
    },
    {
      manual: true,
      onSuccess: () => {
        handleCancel()
        message.success('Restart deploymeny succeeded.')
      },
    },
  )

  const handleConfirm = async () => {
    const values = await form.validateFields()
    const { phases } = values
    await restartDeploymentFn(phases)
    dispatchers.requestRefresh()
  }

  return (
    <Modal
      visible={modalVisible}
      title={
        <>
          Restart
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
      onCancel={handleCancel}
      onOk={handleConfirm}
      okText="Confirm"
      width={800}
      confirmLoading={loading}
    >
      <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} requiredMark={false}>
        <Form.Item label="SDU Name" name="sduName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="AZ" name="az">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Workload Type" name="componentType">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Phase"
          name="phases"
          valuePropName="checked"
          rules={[{ required: true, message: 'Please select phases.' }]}
        >
          <StyledCheckboxGroup>
            {deduplicatedPhases?.map((item) => (
              <Checkbox key={item} value={item}>
                {item}
              </Checkbox>
            ))}
          </StyledCheckboxGroup>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Restart
