import * as React from 'react'
import { Modal, Form, Input, Select, Checkbox, Tooltip, message, Spin } from 'infrad'
import { InfoCircleOutlined } from 'infra-design-icons'
import hooks from 'src/sharedModules/cmdb/hooks'
import { fetch } from 'src/rapper'
import { useRequest } from 'ahooks'

const { useSelectedService } = hooks

interface IBindSDUModalProps {
  visible: boolean
  onVisibleChange: (visible: boolean) => void
  onReload: () => void
}

const BindSDUsModal: React.FC<IBindSDUModalProps> = (props) => {
  const { visible, onVisibleChange, onReload } = props
  const [form] = Form.useForm()
  const { selectedService, serviceMeta } = useSelectedService()
  const { service_name: serviceName } = selectedService
  const { container: containers } = serviceMeta

  const { data: unboundSDUs, loading: getUnboundSDUsLoading } = useRequest(
    async () => {
      if (visible) {
        const sduPrefix = containers?.length
          ? `${containers?.[0]?.sdu.split('-').slice(0, 2).join('-')}-`
          : ''
        const { sdus } = await fetch['GET/api/ecp-cmdb/sdus:unbound']({
          sduPrefix,
        })
        return sdus
      }
    },
    {
      refreshDeps: [visible],
    },
  )

  const handleCancel = () => {
    onVisibleChange(false)
    form.resetFields()
  }

  const { loading: bindSDUsLoading, runAsync: bindSDUs } = useRequest(
    async (sdus: string[], force: boolean) => {
      await fetch['POST/api/ecp-cmdb/services/{serviceName}/sdus:bind']({
        serviceName,
        sdus,
        force,
      })
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('Bind SDUs succeeded.')
        handleCancel()
        onReload()
      },
    },
  )

  const handleConfirm = async () => {
    const data = await form.validateFields()
    const { sdus, force } = data
    await bindSDUs(sdus, force)
  }

  return (
    <Modal
      title="Bind SDU to Service"
      visible={visible}
      width={1024}
      onCancel={handleCancel}
      onOk={handleConfirm}
      okText="Confirm"
      confirmLoading={bindSDUsLoading}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item label="Service Name">
          <Input disabled style={{ width: 400 }} value={serviceName} />
        </Form.Item>
        <Form.Item label="Select SDU">
          <Form.Item
            name="sdus"
            style={{ marginBottom: 16 }}
            rules={[{ required: true, message: 'Please select sdu.' }]}
          >
            <Select
              mode="multiple"
              allowClear
              loading={getUnboundSDUsLoading}
              dropdownRender={(menu: React.ReactElement) =>
                getUnboundSDUsLoading ? <Spin /> : menu
              }
              dropdownStyle={{ textAlign: getUnboundSDUsLoading ? 'center' : 'unset' }}
              style={{ width: 784 }}
            >
              {unboundSDUs?.map((sdu) => (
                <Select.Option key={sdu}>{sdu}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="force" valuePropName="checked" noStyle>
            <Checkbox>
              Bind Related SDUs
              <Tooltip title="Bind all related SDUs to service (e.g. bind smm-bromo-api-live-sg will bind all smm-bromo-api SDUs)">
                <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 8 }} />
              </Tooltip>
            </Checkbox>
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BindSDUsModal
