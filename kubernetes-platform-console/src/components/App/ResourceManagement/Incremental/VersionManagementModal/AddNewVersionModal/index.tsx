import CampaignPicker from 'components/App/ResourceManagement/common/CampaignPicker'
import { HintMessage } from 'components/App/ResourceManagement/Incremental/VersionManagementModal/AddNewVersionModal/style'
import { getDispatchers, ResourceContext } from 'components/App/ResourceManagement/useResourceContext'
import { InfoCircleOutlined, LockOutlined, UnlockOutlined } from 'infra-design-icons'
import { Alert, Form, Input, message, Modal, ModalProps, Switch } from 'infrad'
import * as React from 'react'
import { sduResourceControllerCreateVersion, sduResourceControllerListVersion } from 'swagger-api/v1/apis/SduResource'

interface IVersionManagementModalProps extends ModalProps {
  isVisible: boolean
}
const AddNewVersionModal: React.FC<IVersionManagementModalProps> = ({ isVisible, onCancel, onOk }) => {
  const [form] = Form.useForm()
  const { dispatch } = React.useContext(ResourceContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  const handleOk = async (e: React.MouseEvent<HTMLElement, MouseEvent>, close) => {
    const data = await form.validateFields()
    const { datePeriod = [], versionName, state } = data
    const [startBigSaleId, endBigSaleId] = datePeriod
    const payload = {
      startBigSaleId,
      endBigSaleId,
      name: versionName,
      state: state ? 0 : 1
    }
    try {
      await sduResourceControllerCreateVersion({ payload })
      message.success('Add new version successfully')
      const { versions = [] } = await sduResourceControllerListVersion()
      dispatchers.updateVersions(versions)
      form.resetFields()
      onOk(e)
      close()
    } catch (e) {
      e.message && message.error(e.message)
    }
  }

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onCancel(e)
    form.resetFields()
  }

  return (
    <Modal
      visible={isVisible}
      title='Add New Version'
      width='600px'
      getContainer={() => document.body}
      okText='Confirm'
      onCancel={handleCancel}
      onOk={async e => {
        await form.validateFields()
        Modal.confirm({
          title: 'Notification Title',
          content:
            'Proactively incubate innovative processes for high-payoff architectures. Globally benchmark flexible.',
          onOk: close => handleOk(e, close),
          closable: true,
          icon: <InfoCircleOutlined style={{ fontSize: '21px', color: '#2673DD' }} />,
          okText: 'Confirm'
        })
      }}
    >
      <Alert
        style={{ marginBottom: '24px' }}
        showIcon
        type='warning'
        message='Please be cautious! If you create a new version, the currently working version will be frozen and cannot be modified.'
      />
      <Form
        form={form}
        name='addNewVersion'
        colon
        requiredMark={false}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label='New Version Name'
          name='versionName'
          rules={[{ required: true, message: 'Please input a version name!' }]}
        >
          <Input placeholder='Input' />
        </Form.Item>
        <Form.Item label='Date Period' name='datePeriod' rules={[{ required: true, message: 'Input a date period' }]}>
          <CampaignPicker />
        </Form.Item>
        <Form.Item label='State' name='state' initialValue={false} valuePropName='checked'>
          <Switch checkedChildren={<UnlockOutlined />} unCheckedChildren={<LockOutlined />} />
        </Form.Item>
        <HintMessage>Unlock this will lock other existed versions</HintMessage>
      </Form>
    </Modal>
  )
}

export default AddNewVersionModal
