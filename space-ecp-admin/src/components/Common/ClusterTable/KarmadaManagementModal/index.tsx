import { Modal, Select, Form } from 'infrad'
import { TitleText } from 'src/components/Common/ClusterTable/KarmadaManagementModal/style'
import { IEnableKarmadaBody } from 'src/swagger-api/models'

const { Option } = Select

interface IKarmadaManagementModalProps {
  visible?: boolean
  onCancel?: () => void
  onComfirm?: (values: IEnableKarmadaBody) => void
}

const schedulerValue = {
  bromo: 'bromo-scheduler',
  kube: 'kube-scheduler',
}

const KarmadaManagementModal: React.FC<IKarmadaManagementModalProps> = ({
  visible,
  onCancel,
  onComfirm,
}) => {
  const [form] = Form.useForm<IEnableKarmadaBody>()

  const handleOk = async () => {
    const values = await form.validateFields()
    onComfirm && onComfirm({ ...values })
    form.resetFields()
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel && onCancel()
  }

  return (
    <Modal
      title="Enable Karmada Management"
      visible={visible}
      getContainer={() => document.body}
      centered
      width={800}
      onCancel={handleCancel}
      onOk={handleOk}
      maskClosable={false}
      okText="Confirm"
    >
      <TitleText>Karmada Config</TitleText>
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Scheduler"
          name="scheduler"
          rules={[{ required: true }]}
          initialValue={schedulerValue.bromo}
        >
          <Select placeholder="Please select Scheduler" allowClear>
            {Object.values(schedulerValue).map((item) => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="SchedulerLease"
          name="schedulerLease"
          rules={[{ required: true }]}
          initialValue={schedulerValue.bromo}
        >
          <Select placeholder="Please select SchedulerLease" allowClear>
            {Object.values(schedulerValue).map((item) => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default KarmadaManagementModal
