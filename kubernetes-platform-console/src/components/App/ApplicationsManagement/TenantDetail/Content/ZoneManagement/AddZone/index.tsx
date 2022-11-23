import React from 'react'
import { ZoneFormItem } from 'components/App/ApplicationsManagement/TenantDetail/Content/ZoneManagement/AddZone/style'
import { Alert, Button, Form, Input, message, Modal, Select } from 'infrad'
import { useRecoilValue } from 'recoil'
import { selectedTenant } from 'states/applicationState/tenant'
import { zoneControllerCreateZone, zoneControllerListEnableZoneAZs } from 'swagger-api/v1/apis/Zone'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'constants/accessControl'

interface IAddZoneProps {
  onSucceed: () => void
}

const AddZone: React.FC<IAddZoneProps> = ({ onSucceed }) => {
  const [modalVisible, setModalVisible] = React.useState(false)
  const [azs, setAZs] = React.useState<string[]>([])
  const [form] = Form.useForm()

  const accessControlContext = React.useContext(AccessControlContext)
  const zonePermissions = accessControlContext[RESOURCE_TYPE.ZONE] || []
  const canCreate = zonePermissions.includes(RESOURCE_ACTION.Create)

  const groupInfo = useRecoilValue(selectedTenant)
  const { id: tenantId } = groupInfo

  const getAZs = React.useCallback(async () => {
    try {
      const { azs = [] } = await zoneControllerListEnableZoneAZs({ tenantId })
      const selectableAZs = Array.from(new Set(azs.filter(az => az.type !== 'bromo').map(az => az.name)))
      setAZs(selectableAZs)
    } catch (error) {}
  }, [tenantId])

  React.useEffect(() => {
    getAZs()
  }, [getAZs])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    try {
      await zoneControllerCreateZone({
        tenantId,
        payload: values
      })
      message.success('Add zone successfully')
      onSucceed()
      handleCloseModal()
    } catch (error) {
      message.error(error?.message)
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    form.resetFields()
  }

  return (
    <>
      <Button
        type='primary'
        style={{ float: 'right', marginTop: 8, marginBottom: 24 }}
        onClick={() => setModalVisible(true)}
        disabled={!canCreate}
      >
        Add Zone
      </Button>
      <Modal
        visible={modalVisible}
        title='Add Zone'
        getContainer={() => document.body}
        width={600}
        centered
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        okText='Confirm'
      >
        <Alert
          message='Final zone name format: {Name Prefix}-{Tenant ID}-{AZ}. Example: zonea-1000-sg2'
          type='info'
          style={{ marginBottom: 24 }}
        />
        <Form form={form} labelCol={{ span: 4 }} labelAlign='left' requiredMark={false}>
          <ZoneFormItem label='AZ' name='azs' help='Batch add zone to diffierent AZ.' rules={[{ required: true }]}>
            <Select mode='multiple' showArrow={true}>
              {azs.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </ZoneFormItem>
          <ZoneFormItem
            label='Name Prefix'
            name='namePrefix'
            help='Length: 2-32 Characters. Composed with lowercase letters(a-z).'
            rules={[{ required: true, pattern: /^[a-z]+$/, type: 'string', min: 2, max: 32 }]}
          >
            <Input />
          </ZoneFormItem>
          <ZoneFormItem
            label='Description'
            name='description'
            help='Length: 2-128 Characters.'
            rules={[{ required: true, min: 2, max: 128, type: 'string' }]}
          >
            <Input.TextArea />
          </ZoneFormItem>
        </Form>
      </Modal>
    </>
  )
}

export default AddZone
