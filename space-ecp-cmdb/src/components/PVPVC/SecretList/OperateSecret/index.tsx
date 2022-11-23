import * as React from 'react'
import { Button, Form, Input, message, Select, Space } from 'infrad'
import { InfoCircleOutlined } from 'infra-design-icons'
import { Secret } from 'src/components/PVPVC/SecretList'
import { StyledModal } from 'src/components/PVPVC/SecretList/OperateSecret/style'
import hooks from 'src/sharedModules/cmdb/hooks'
import { fetch } from 'src/rapper'
import { useRequest } from 'ahooks'

const { useSelectedService } = hooks

interface IOperateSecretProps {
  azList: string[]
  envList: string[]
  secret?: Secret
  visible: boolean
  onVisibleChange: (visible: boolean) => void
  onRefresh: () => Promise<void>
}

interface IFormData {
  name: string
  ussAppid: string
  ussAppSecret: string
  intranetDomain: string
  env: string
  azs: string[]
}

const OperateSecret: React.FC<IOperateSecretProps> = (props) => {
  const { envList, azList, secret, visible, onVisibleChange, onRefresh } = props
  const { selectedService } = useSelectedService()
  const { path: serviceName, service_id: serviceId, identifier = '' } = selectedService
  const [project, module] = identifier.split('-')

  const isEdit = secret !== undefined
  const [form] = Form.useForm<IFormData>()
  const ussAppid = Form.useWatch('ussAppid', form)
  const env = Form.useWatch('env', form)

  React.useEffect(() => {
    let name: string
    if (!ussAppid || !env) {
      name = ''
    } else {
      name = `${serviceId}-${ussAppid}-${env}`
    }
    form.setFieldsValue({ name })
  }, [ussAppid, env, form, serviceId])

  const displayNameFormItem = (
    <Form.Item label="Secret Display Name" name="name">
      <Input disabled />
    </Form.Item>
  )

  React.useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        ...secret,
        azs: secret?.az?.split(','),
      })
    }
  }, [form, isEdit, secret, serviceId])

  const { data: isAppidExist } = useRequest(
    async () => {
      if (!ussAppid || !env || isEdit) return false
      const { exist } = await fetch[
        'POST/api/ecp-cmdb/services/{serviceId}/pvSecrets/{ussAppid}:isExist'
      ]({
        serviceId,
        ussAppid,
        env,
      })
      return exist
    },
    {
      debounceWait: 1000,
      refreshDeps: [ussAppid, env],
    },
  )

  const handleCancel = () => {
    onVisibleChange(false)
    form.resetFields()
  }

  const handleConfirm = async () => {
    if (isAppidExist) return
    const data = await form.validateFields()
    const { azs, ...rest } = data
    const az = azs.join(',')
    if (isEdit) {
      const { uuid } = secret
      await fetch['PUT/api/ecp-cmdb/services/{serviceId}/pvSecrets/{uuid}']({
        serviceId,
        uuid,
        project,
        module,
        serviceName,
        az,
        ...rest,
      })
      message.success('Edit succeeded.')
    } else {
      await fetch['POST/api/ecp-cmdb/services/{serviceId}/pvSecrets']({
        serviceId,
        project,
        module,
        serviceName,
        az,
        ...rest,
      })
      message.success('Create succeeded.')
    }
    handleCancel()
    onRefresh()
  }

  const ussGuideIcon = (title: string) => (
    <Space size={5}>
      <div>{title}</div>
      <InfoCircleOutlined
        style={{ color: 'rgba(0, 0, 0, 0.45)' }}
        onClick={() =>
          window.open('https://confluence.shopee.io/pages/viewpage.action?pageId=1059957811')
        }
      />
    </Space>
  )

  return (
    <StyledModal
      title={
        <>
          {isEdit ? 'Edit' : 'Create'} Secret
          <a href="https://confluence.shopee.io/pages/viewpage.action?pageId=1307628369">
            <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 10 }} />
          </a>
        </>
      }
      visible={visible}
      onCancel={handleCancel}
      width={880}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>
          Confirm
        </Button>,
      ]}
    >
      <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
        {isEdit && displayNameFormItem}
        <Form.Item
          label={ussGuideIcon('USSFS AppID')}
          name="ussAppid"
          rules={[{ required: true, message: 'Please input AppID.' }]}
          validateStatus={isAppidExist ? 'error' : undefined}
          help={isAppidExist ? 'AppID already used, please edit previous one.' : undefined}
        >
          <Input disabled={isEdit} />
        </Form.Item>
        <Form.Item
          label={ussGuideIcon('USSFS AppSecret')}
          name="ussAppSecret"
          rules={[{ required: true, message: 'Please input App Secret.' }]}
        >
          <Input.Password disabled={isEdit} />
        </Form.Item>
        <Form.Item
          label="Intranet Domain"
          name="intranetDomain"
          rules={[
            { required: true, message: 'Please input domain.' },
            { min: 2, max: 64, message: 'Domain should be 2-64 characters.' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Env"
          name="env"
          rules={[{ required: true, message: 'Please select env.' }]}
        >
          <Select disabled={isEdit}>
            {envList.map((item) => (
              <Select.Option key={item} value={item}>
                {item.toLocaleUpperCase()}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="AZ" name="azs" rules={[{ required: true, message: 'Please select az.' }]}>
          <Select mode="multiple" showArrow>
            {azList.map((item) => (
              <Select.Option key={item}>{item}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        {!isEdit && displayNameFormItem}
      </Form>
    </StyledModal>
  )
}

export default OperateSecret
