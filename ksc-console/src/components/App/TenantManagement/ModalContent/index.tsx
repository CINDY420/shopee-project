import * as React from 'react'
import { StyledInput, ContentWrapper } from 'components/App/TenantManagement/ModalContent/style'
import { Form, Select, FormInstance, Checkbox } from 'infrad'
import { CheckboxOptionType } from 'infrad/lib/checkbox'
import { HorizontalDivider, VerticalDivider } from 'common-styles/divider'
import { globalControllerListAllEnvs } from 'swagger-api/apis/Global'
import { MODAL_TYPE } from 'components/App/TenantManagement'
import {
  IResponseEnvQuota,
  IOpenApiCMDBTenantListItem,
  ITenantListItem,
  IClusterListItem,
  IGetTenantResponse,
  IPayloadEnvQuota,
} from 'swagger-api/models'
import { clusterControllerListClusters } from 'swagger-api/apis/Cluster'
import {
  tenantControllerGetTenant,
  tenantControllerListAllCMDBTenants,
} from 'swagger-api/apis/Tenant'
import ClusterSelector from 'components/App/TenantManagement/ModalContent/ClusterSelector'
import { upperCaseFirstCharacter } from 'helpers/format'

const { Option } = Select
interface IModalContentProps {
  form: FormInstance
  modalType: string | undefined
  tenantItem?: ITenantListItem
}
const ModalContent: React.FC<IModalContentProps> = ({ form, modalType, tenantItem }) => {
  const [tenantList, setTenantList] = React.useState<IOpenApiCMDBTenantListItem[]>([])
  const [envList, setEnvList] = React.useState<Array<CheckboxOptionType>>([])
  const [checkedEnvList, setCheckedEnvList] = React.useState<string[]>([])
  const [clusters, setClusters] = React.useState<Array<IClusterListItem>>([])
  const [initialClusterDataList, setInitialClusterDataList] = React.useState<IResponseEnvQuota[]>(
    [],
  )

  const shouldEnvQuotasUpdate = (prevValue: IPayloadEnvQuota, currentValue: IPayloadEnvQuota) =>
    prevValue?.env?.length !== currentValue?.env?.length

  const listAllClusters = async () => {
    const { items } = await clusterControllerListClusters({})
    setClusters(items)
  }

  const initFormFieldsValue = React.useCallback(
    (value: IGetTenantResponse, envs: Array<string>) => {
      form.setFieldsValue({
        env: envs,
        description: value.description,
        envQuotas: value.envQuotas,
        tenantCmdbName: value.tenantCmdbName || value.displayName,
      })
    },
    [form],
  )

  const getTenantEnvsAndQuotas = React.useCallback(async () => {
    if (tenantItem) {
      const value = await tenantControllerGetTenant({
        tenantId: tenantItem?.tenantId,
      })
      const envs = value.envQuotas.map((item: IResponseEnvQuota) => item.env)
      setInitialClusterDataList(value.envQuotas)
      setCheckedEnvList(envs)
      initFormFieldsValue(value, envs)
    }
  }, [tenantItem, initFormFieldsValue])

  const listAllCMDBTenants = async () => {
    const { items } = await tenantControllerListAllCMDBTenants()
    setTenantList(items)
  }
  const listAllEnvs = async () => {
    const { items } = await globalControllerListAllEnvs()
    const envs = items.map((item) => ({
      value: item,
      label: upperCaseFirstCharacter(item),
    }))
    setEnvList(envs)
  }

  React.useEffect(() => {
    form.resetFields()
    listAllCMDBTenants()
    listAllEnvs()
    listAllClusters()
  }, [form])

  React.useEffect(() => {
    if (modalType === MODAL_TYPE.EDIT_MODAL) getTenantEnvsAndQuotas()
  }, [getTenantEnvsAndQuotas, modalType])

  const handleCheckEnv = (values: string[]) => {
    setCheckedEnvList(values)
  }

  const handleTenantNameChange = (value) => {
    const tenantCmdbId = tenantList.find((tenant) => tenant.tenantName === value)?.tenantId
    form.setFieldsValue({ tenantCmdbId: `${tenantCmdbId}` })
  }

  return (
    <ContentWrapper>
      <HorizontalDivider size="32px" />
      <Form name="basic" form={form} labelCol={{ span: 4 }}>
        <Form.Item name="tenantCmdbId" noStyle />
        <Form.Item
          label="Tenant Name"
          name="tenantCmdbName"
          rules={[{ required: true, message: 'Please select tenant name!' }]}
        >
          <Select
            placeholder="Select"
            style={{ width: '240px' }}
            disabled={modalType === MODAL_TYPE.EDIT_MODAL}
            onChange={handleTenantNameChange}
          >
            {tenantList?.map((tenant: IOpenApiCMDBTenantListItem) => (
              <Option key={tenant.tenantId} value={tenant.tenantName}>
                {tenant.tenantName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Comment"
          name="description"
          rules={[{ required: true, message: 'Please input comment!' }]}
        >
          <StyledInput width="480px" placeholder="Input" />
        </Form.Item>
        <Form.Item label="Oversold ratio" name="oversoldRatio">
          <StyledInput type="number" width="480px" placeholder="Input" />
        </Form.Item>
        <Form.Item
          label="Environment"
          name="env"
          rules={[{ required: true, message: 'Please select env' }]}
        >
          <Checkbox.Group options={envList} onChange={handleCheckEnv} />
        </Form.Item>
        <Form.Item shouldUpdate={shouldEnvQuotasUpdate} noStyle>
          {({ getFieldValue }) =>
            getFieldValue('env')?.length > 0 && (
              <Form.Item
                label="Cluster"
                name="envQuotas"
                rules={[{ required: true, message: 'Please select cluster!' }]}
              >
                <ClusterSelector
                  form={form}
                  checkedEnvList={checkedEnvList}
                  listClusters={clusters}
                  initialClusterData={initialClusterDataList}
                />
              </Form.Item>
            )
          }
        </Form.Item>
      </Form>
      <VerticalDivider size="8px" />
    </ContentWrapper>
  )
}

export default ModalContent
