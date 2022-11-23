import { StyledModalRoot } from 'components/App/Platform/PlatformConfig/ConfigList/style'
import { Alert, Checkbox, Form, Select } from 'infrad'
import React from 'react'
import { tenantControllerListTenants } from 'swagger-api/apis/Tenant'
import { ITenantListItem } from 'swagger-api/models'

const ENVS = [
  { label: 'Test', value: 'test' },
  { label: 'Live', value: 'live' },
]

const { Option } = Select
const FuseModalForm = ({ form }) => {
  const [tenantList, setTenantList] = React.useState<ITenantListItem[]>([])
  const listAllCMDBTenants = async () => {
    const { items } = await tenantControllerListTenants({ limit: '1000' })
    setTenantList(items)
  }

  React.useEffect(() => {
    listAllCMDBTenants()
  }, [])

  return (
    <StyledModalRoot>
      <Alert
        message="Please notice this action will forbid Tenant/Env submit job"
        type="info"
        showIcon
      />
      <br />
      <Form name="fuse" form={form} layout="vertical">
        <Form.Item
          label="Tenant"
          name="tenantIds"
          rules={[
            {
              required: true,
              message: 'Please select tenants',
            },
          ]}
        >
          <Select style={{ width: '592px' }} placeholder="Please select tenant" mode="multiple">
            {tenantList.map((tenant) => (
              <Option key={tenant.tenantId} value={`${tenant.tenantId}`}>
                {tenant.displayName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Env"
          name="fuseEnvs"
          rules={[
            {
              required: true,
              message: 'Please select env',
            },
          ]}
        >
          <Checkbox.Group options={ENVS} />
        </Form.Item>
      </Form>
    </StyledModalRoot>
  )
}

export default FuseModalForm
