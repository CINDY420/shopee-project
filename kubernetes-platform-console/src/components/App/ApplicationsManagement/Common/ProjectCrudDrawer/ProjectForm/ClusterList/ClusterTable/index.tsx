import * as React from 'react'
import { Checkbox } from 'infrad'
import { FormProps } from 'infrad/lib/form'
import { IIDetail } from 'swagger-api/v3/models'
import { formatFloat } from 'helpers/format'
import { QUOTAS_DECIMAL_CHECK, formRuleMessage } from 'helpers/validate'
import { RowWrapper, StyledFormItem, StyledInput, Root, StyledTable } from './style'

interface IClusterTableProps extends FormProps {
  resourceQuotas: IIDetail[]
  clusterName: string
  selectedRowKeys: string[]
  preSelectedResourceQuotaNames: string[]
  onResourceChange: (clusterName: string, recordName: string, checked: boolean) => void
}

interface IColumnsDefaultConfig {
  name: string
  unit: string
}

interface IColumnsConfig extends IColumnsDefaultConfig {
  formItemName: string
}

enum COLUMNS {
  CPU = 'cpu',
  MEMORY = 'memory'
}

const columnsDefaultConfigs: Record<COLUMNS, IColumnsDefaultConfig> = {
  cpu: {
    name: 'cpu',
    unit: 'Cores'
  },
  memory: {
    name: 'memory',
    unit: 'GiB'
  }
}

function generateFormItemName(clusterName: string, recordName: string, key: string): string {
  return `${clusterName}---${recordName}---${key}`
}

const ClusterTable: React.FC<IClusterTableProps> = ({
  resourceQuotas,
  clusterName,
  selectedRowKeys,
  preSelectedResourceQuotaNames,
  onResourceChange,
  form
}) => {
  const renderFormItem = (columnConfig: IColumnsConfig) => {
    return (
      <StyledFormItem
        key={columnConfig.name}
        name={columnConfig.formItemName}
        normalize={value => (value.length ? Number(value) : value)}
        rules={[
          () => ({
            validator(rule, value) {
              if (!QUOTAS_DECIMAL_CHECK.test(value)) {
                return Promise.reject(formRuleMessage.TWO_DECIMAL_PLACES_LIMIT)
              }
              return Promise.resolve()
            }
          })
        ]}
      >
        <StyledInput type='number' addonAfter={columnConfig.unit} step={1} />
      </StyledFormItem>
    )
  }

  const renderRow = React.useCallback(
    ({ name, envName }) => {
      const columnsConfigs: Array<IColumnsConfig> = Object.keys(columnsDefaultConfigs).map(key => {
        return {
          formItemName: generateFormItemName(clusterName, name, key),
          ...columnsDefaultConfigs[key]
        }
      })
      const children = (
        <RowWrapper>
          <span>{envName}</span>
          {columnsConfigs.map(item => renderFormItem(item))}
        </RowWrapper>
      )

      return {
        children,
        props: {
          colSpan: 3
        }
      }
    },
    [clusterName]
  )

  const renderEmpty = () => ({
    props: {
      colSpan: 0
    }
  })

  const columns = [
    {
      title: 'Env',
      dataIndex: 'name',
      key: 'name',
      width: 110,
      render: (_, record: IIDetail) => renderRow(record)
    },
    {
      title: 'CPU(Quota)',
      dataIndex: 'cpu',
      key: 'cpu',
      width: 110,
      render: renderEmpty
    },
    {
      title: 'Memory(Quota)',
      dataIndex: 'memory',
      key: 'memory',
      width: 110,
      render: renderEmpty
    }
  ]

  React.useEffect(() => {
    resourceQuotas.forEach(item => {
      Object.keys(columnsDefaultConfigs).forEach(key => {
        const formItemName = generateFormItemName(clusterName, item.name, key)
        form.setFieldsValue({ ...form.getFieldsValue(), [formItemName]: formatFloat(item[key].total) })
      })
    })
  }, [clusterName, resourceQuotas, form])

  return (
    <Root>
      <StyledTable
        rowSelection={{
          hideSelectAll: true,
          selectedRowKeys: selectedRowKeys?.length ? selectedRowKeys : preSelectedResourceQuotaNames,
          renderCell: (checked, record: any) => {
            const defaultChecked = preSelectedResourceQuotaNames.includes(record.name)
            return (
              <Checkbox
                onChange={e => onResourceChange(clusterName, record.name, e.target.checked)}
                checked={checked || defaultChecked}
                disabled={defaultChecked}
              />
            )
          }
        }}
        bordered
        rowKey='name'
        columns={columns}
        dataSource={resourceQuotas}
        pagination={false}
      />
    </Root>
  )
}

export default ClusterTable
