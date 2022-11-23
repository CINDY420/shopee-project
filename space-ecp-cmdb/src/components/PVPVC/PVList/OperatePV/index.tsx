import * as React from 'react'
import { Alert, Button, Form, Input, message, Select, Empty } from 'infrad'
import { InfoCircleOutlined } from 'infra-design-icons'
import { StyledModal } from 'src/components/PVPVC/PVList/OperatePV/style'
import hooks from 'src/sharedModules/cmdb/hooks'
import { fetch } from 'src/rapper'
import { PV } from 'src/components/PVPVC/PVList'
import { FilterTypes, getFilterItem, getFilterUrlParam } from 'src/helpers/tableProps'

const { useSelectedService } = hooks

const AccessMode = {
  READ_WRITE_MANY: 'ReadWriteMany',
  READ_WRITE_ONCE: 'ReadWriteOnce',
  READ_ONLY_MANY: 'ReadOnlyMany',
}

interface IOperatePVProps {
  envList: string[]
  azList: string[]
  cidList: string[]
  pv?: PV
  visible: boolean
  onVisibleChange: (visible: boolean) => void
  onRefresh: () => Promise<void>
}

interface IFormData {
  name: string
  env: string
  cids: string[]
  azs: string[]
  secret: string
  accessMode: string
  subpath: string
}

const OperatePV: React.FC<IOperatePVProps> = (props) => {
  const { envList, azList, cidList, pv, visible, onVisibleChange, onRefresh } = props
  const { selectedService } = useSelectedService()
  const { path: serviceName, service_id: serviceId, identifier = '' } = selectedService
  const [project, module] = identifier.split('-')
  const [secretList, setSecretList] = React.useState<string[]>([])
  const isRetry = pv !== undefined

  const [form] = Form.useForm<IFormData>()
  const env = Form.useWatch('env', form)

  React.useEffect(() => {
    if (isRetry) {
      const { az, cid, name } = pv
      const pvNameItems = name?.split('-')
      const prefix = pvNameItems?.slice(0, pvNameItems.length - 3)?.join('-')
      const azs = az.split(',')
      const cids = cid.split(',')
      form.setFieldsValue({ ...pv, name: prefix, azs, cids })
    }
  }, [form, isRetry, pv])

  const handleCancel = () => {
    form.resetFields()
    onVisibleChange(false)
  }

  const handleConfirm = async () => {
    const data = await form.validateFields()
    const { azs, cids, ...rest } = data
    const payload = {
      serviceId,
      project,
      module,
      serviceName,
      az: azs.join(','),
      cid: cids.join(','),
      ...rest,
    }
    if (isRetry) {
      const { uuid } = pv
      await fetch['POST/api/ecp-cmdb/services/{serviceId}/pvs/{uuid}']({
        uuid,
        ...payload,
      })
    } else {
      await fetch['POST/api/ecp-cmdb/services/{serviceId}/pvs']({ ...payload })
    }
    message.success('Create succeeded.')
    onRefresh()
    handleCancel()
  }

  const getSecretList = React.useCallback(async () => {
    const filterBy = getFilterUrlParam({
      env: getFilterItem('env', env, FilterTypes.EQUAL),
    })
    const { items } = await fetch['GET/api/ecp-cmdb/services/{serviceId}/allPvSecrets']({
      serviceId,
      filterBy,
    })
    const secretList = items.map((item) => item.name)
    setSecretList(secretList)
  }, [env, form, serviceId])

  React.useEffect(() => {
    getSecretList()
  }, [getSecretList])

  return (
    <StyledModal
      title={
        <>
          Create PV/PVC
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
      <Alert
        showIcon
        type="info"
        message="PV / PVC Name will be like {{PV Prefix Name}}-{{Environment}}-{{CID}}-{{AZ}}."
        style={{ marginBottom: 32 }}
      />
      <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} disabled={isRetry}>
        <Form.Item
          label="PV Prefix Name"
          name="name"
          rules={[
            { required: true, message: 'Please input PV Prefix Name.' },
            { min: 1, max: 31, message: 'Name should be 1-31 characters.' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Environment"
          name="env"
          rules={[{ required: true, message: 'Please select env.' }]}
        >
          <Select onChange={() => form.resetFields(['secret'])}>
            {envList.map((item) => (
              <Select.Option key={item} value={item}>
                {item.toLocaleUpperCase()}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="CID"
          name="cids"
          rules={[{ required: true, message: 'Please select cid.' }]}
        >
          <Select mode="multiple" showArrow>
            {cidList.map((item) => (
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
        <Form.Item
          label="Secret"
          name="secret"
          rules={[{ required: true, message: 'Please select secret.' }]}
        >
          <Select
            notFoundContent={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{
                  height: 50,
                }}
                description="No available secret for current env, please create first."
              />
            }
          >
            {secretList.map((item) => (
              <Select.Option key={item}>{item}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Access Mode"
          name="accessMode"
          rules={[{ required: true, message: 'Please select access mode.' }]}
          initialValue={AccessMode.READ_WRITE_MANY}
        >
          <Select>
            {Object.values(AccessMode).map((item) => (
              <Select.Option key={item}>{item}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Sub Path"
          name="subpath"
          rules={[
            { required: true, message: 'Please input sub path.' },
            { min: 1, max: 255, message: 'Sub path should be 1-255 characters.' },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </StyledModal>
  )
}

export default OperatePV
