import React from 'react'
import { Form, FormInstance, Select } from 'infrad'
import { clusterControllerListClusterTenants } from 'swagger-api/apis/Cluster'
import { IClusterTenantListItem } from 'swagger-api/models'
import CheckboxGroupWithAll from 'components/Common/CheckboxWithAll'
import ClusterFormList from 'components/App/ClusterManagement/ClusterDetail/EditClusterModal/ClusterFormList'
import { StyledFormItem } from 'components/App/ClusterManagement/ClusterDetail/EditClusterModal/style'
import { IFormData } from 'components/App/ClusterManagement/ClusterDetail'
import { CHECKBOX_ENVS_LIST } from 'constants/node'

const WRAPPER_COL = { span: 16 }
const LABEL_COL = { span: 5 }

const { Option } = Select

interface IEditClusterModalProps {
  form: FormInstance<IFormData>
  clusterId: string
}
const EditClusterModal: React.FC<IEditClusterModalProps> = ({ form, clusterId }) => {
  const [tenantsList, setTenantsList] = React.useState<IClusterTenantListItem[]>([])
  const [selectedTenants, setSelectedTenants] = React.useState<IClusterTenantListItem[]>([])

  const listClusterTenants = React.useCallback(async () => {
    const { items = [] } = await clusterControllerListClusterTenants({ clusterId })
    setTenantsList(items)
  }, [clusterId])

  const handleSelectedTenantChange = (selectedTenantIds: string[]) => {
    const selectedTenants = tenantsList.filter(
      (item) => selectedTenantIds.indexOf(item.tenantId) > -1,
    )
    const envs = [...new Set(selectedTenants.map((item) => item.envs).flat())]
    const selectedTenantsIdAndNameMap = {}
    selectedTenants.forEach((item) => {
      selectedTenantsIdAndNameMap[item.tenantId] = item.displayName
    })
    form.setFieldsValue({
      ...form.getFieldsValue(),
      envs,
      tenants: selectedTenantIds,
      tenantsIdAndNameMap: selectedTenantsIdAndNameMap,
    })
    setSelectedTenants(selectedTenants)
  }

  React.useEffect(() => {
    listClusterTenants()
  }, [listClusterTenants])

  return (
    <Form
      name="editCluster"
      form={form}
      labelCol={LABEL_COL}
      style={{ marginTop: 32, marginBottom: 32 }}
    >
      <Form.Item name="tenantsIdAndNameMap" noStyle />
      <Form.Item
        label="Tenant"
        name="tenants"
        wrapperCol={WRAPPER_COL}
        rules={[
          {
            required: true,
            message: 'Please select tenants',
          },
        ]}
      >
        <Select
          mode="multiple"
          allowClear
          placeholder="Please select tenants"
          onChange={handleSelectedTenantChange}
          filterOption={(input, option) =>
            option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {tenantsList.map((item) => (
            <Option key={item.tenantId} value={item.tenantId}>
              {item.tenantCmdbName || item.displayName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Environment"
        name="envs"
        rules={[
          {
            required: true,
            message: 'Please select environment',
          },
        ]}
      >
        <CheckboxGroupWithAll options={CHECKBOX_ENVS_LIST} />
      </Form.Item>
      <StyledFormItem shouldUpdate>
        {({ getFieldValue }) => {
          const envs = getFieldValue('envs')?.length
          const tenants = getFieldValue('tenants')?.length
          return envs && tenants ? (
            <Form.Item label="Quota" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL} required>
              <ClusterFormList form={form} tenantsList={selectedTenants} />
            </Form.Item>
          ) : null
        }}
      </StyledFormItem>
    </Form>
  )
}

export default EditClusterModal
