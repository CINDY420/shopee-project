import React from 'react'
import { IClusterTenantListItem, IGetTenantMetricsResponse } from 'swagger-api/models'
import { Table } from 'common-styles/table'
import { Checkbox, Form, FormInstance, Input, Space } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import { RESOURCE_CONFIG_LIST } from 'constants/resource'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { IFormData, IUpdateTenantEnvQuotas } from 'components/App/ClusterManagement/ClusterDetail'
import { DEFAULT_QUOTA, generateQuota } from 'helpers/generateQuota'

interface ITableData {
  name: number
  env: string
  checked: boolean
  quota: IGetTenantMetricsResponse
}
interface IQuotaFormTableProps {
  form: FormInstance<IFormData>
  tenantData: IClusterTenantListItem
  fields: FormListFieldData[]
}

const initialTableData = (tenantData: IClusterTenantListItem, formEnvs: string[]) => {
  const { envs: tenantEnvs = [], quotas } = tenantData
  return formEnvs.map((env: string) => {
    const tenantEnvIndex = tenantEnvs.indexOf(env)
    if (tenantEnvIndex > -1) {
      return {
        env,
        checked: true,
        quota: generateQuota(quotas[tenantEnvIndex]),
      }
    }
    return {
      env,
      checked: false,
      quota: DEFAULT_QUOTA,
    }
  })
}

const QuotaFormTable: React.FC<IQuotaFormTableProps> = ({ form, tenantData, fields }) => {
  const formEnvs: string[] = form.getFieldValue('envs') ?? []
  const { tenantId } = tenantData

  const [isCheckedAll, setIsCheckedAll] = React.useState(false)
  const [isCheckboxIndeterminate, setIsCheckboxIndeterminate] = React.useState(false)

  const generateTableData = React.useCallback(() => {
    const currentTableData: IUpdateTenantEnvQuotas[] =
      form.getFieldValue(['quotas', tenantId]) ?? []

    if (currentTableData.length === formEnvs.length) return

    let newTableDatas: IUpdateTenantEnvQuotas[] = []
    // stay current table data and add new table rows
    if (currentTableData.length > 0 && currentTableData.length < formEnvs.length) {
      const currentEnvs = currentTableData.map((item) => item.env)
      const newEnvs = formEnvs.filter((env) => currentEnvs.indexOf(env) === -1)
      newTableDatas = currentTableData.concat(
        newEnvs.map((env) => ({
          env,
          checked: false,
          quota: DEFAULT_QUOTA,
        })),
      )
    } else {
      // initial table data
      newTableDatas = initialTableData(tenantData, formEnvs)
    }
    form.setFieldsValue({ quotas: { [tenantId]: newTableDatas } })
  }, [formEnvs, form, tenantData, tenantId])

  const setCheckAllState = React.useCallback(() => {
    const currentTableData: IUpdateTenantEnvQuotas[] =
      form.getFieldValue(['quotas', tenantId]) ?? []

    const checkedTableData = currentTableData.filter((item) => item.checked)
    setIsCheckedAll(
      checkedTableData.length > 0 && checkedTableData.length === currentTableData.length,
    )
    setIsCheckboxIndeterminate(
      checkedTableData.length > 0 && checkedTableData.length !== currentTableData.length,
    )
  }, [form, tenantId])

  React.useEffect(() => {
    generateTableData()
    setCheckAllState()
  }, [generateTableData, setCheckAllState])

  const handleTitleCheckboxChange = (checked: boolean) => {
    const currentTableData: IUpdateTenantEnvQuotas[] = form.getFieldValue(['quotas', tenantId])
    const newTableDatas = currentTableData.map((item) => {
      item.checked = checked
      return item
    })
    form.setFieldsValue({ quotas: { [tenantId]: newTableDatas } })
    setIsCheckedAll(checked)
    setIsCheckboxIndeterminate(false)
  }

  const columns: ColumnsType<ITableData> = [
    {
      title: () => (
        <Space>
          <Checkbox
            checked={isCheckedAll}
            indeterminate={isCheckboxIndeterminate}
            onChange={(e) => handleTitleCheckboxChange(e.target.checked)}
          />
          Environment
        </Space>
      ),
      dataIndex: 'env',
      render: (_, record) => (
        <Space>
          <Form.Item
            name={[record.name, 'checked']}
            initialValue={record.checked}
            valuePropName="checked"
            noStyle
          >
            <Checkbox onChange={() => setCheckAllState()} />
          </Form.Item>
          <Form.Item name={[record.name, 'env']} noStyle>
            <Input readOnly bordered={false} style={{ color: '#000000' }} />
          </Form.Item>
        </Space>
      ),
    },
    {
      title: 'Resource Applied',
      dataIndex: 'quota',
      render: (_, record) => (
        <Form.Item noStyle>
          <Space>
            {RESOURCE_CONFIG_LIST.map((item) => (
              <Form.Item name={[record.name, 'quota', item.key]} noStyle key={item.key}>
                <Input width="112px" suffix={item.suffix} addonBefore={item.before} />
              </Form.Item>
            ))}
          </Space>
        </Form.Item>
      ),
    },
  ]
  return (
    <Table
      rowKey={(record) => `${record.name}-${record.env}`}
      bordered
      columns={columns}
      pagination={false}
      dataSource={fields}
    />
  )
}

export default QuotaFormTable
