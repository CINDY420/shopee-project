import * as React from 'react'
import { Form } from 'infrad'
import { FormOutlined } from 'infra-design-icons'

import { formatFloat } from 'helpers/format'
import { IResourceQuotas } from 'api/types/resource'

import EditableCell from './EditableCell'

import { Table } from 'common-styles/table'
import { MetricsWrapper, StyledButton, ButtonWrap, StyledFormItem, StyledInput, Name } from './style'
import { QUOTAS_DECIMAL_CHECK, formRuleMessage } from 'helpers/validate'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

interface IQuotasTableProps {
  quotaData: IResourceQuotas
  onUpdateQuotas: any
  isUpdating: boolean
  isCluster?: boolean
  hasMinimum?: boolean
  type: string
  onSaveCallback: () => void
}

const formatMetricsFormData = values => {
  let configMap = {}

  Object.entries(values).forEach(item => {
    const [key, value] = item
    if (value !== undefined) {
      const [name, count] = key.split('---')
      configMap = {
        ...configMap,
        [name]: {
          ...configMap[name],
          name,
          [`${count}Total`]: Number(value)
        }
      }
    }
  })

  return Object.values(configMap)
}

const QuotasTable: React.FC<IQuotasTableProps> = ({
  quotaData,
  onUpdateQuotas,
  isUpdating,
  isCluster = false,
  hasMinimum,
  onSaveCallback,
  type
}) => {
  const rowsCount = quotaData.resourceQuotas && quotaData.resourceQuotas.length
  const [isEditing, setEditing] = React.useState(false)

  const accessControlContext = React.useContext(AccessControlContext)
  const clusterQuotaActions = accessControlContext[RESOURCE_TYPE.CLUSTER_QUOTA] || []
  const canEditClusterQuota = clusterQuotaActions.includes(RESOURCE_ACTION.Edit)

  const projectQuotaActions = accessControlContext[RESOURCE_TYPE.PROJECT_QUOTA] || []
  const canEditProjectQuota = projectQuotaActions.includes(RESOURCE_ACTION.Edit)

  const canEditQuotaMap = {
    cluster: canEditClusterQuota,
    project: canEditProjectQuota
  }

  const [form] = Form.useForm()

  const handleSave = async id => {
    try {
      const values = await form.validateFields()
      const quotasConfig = formatMetricsFormData(values)

      await onUpdateQuotas({ quotasConfig, clusterName: id })

      onSaveCallback()
      setEditing(false)
    } catch (err) {}
  }

  const formatQuotasData = quotaData => {
    const { name, resourceQuotas, alias } = quotaData

    const splicingName = (envName: string) => `${name}:${envName}`

    return resourceQuotas.map(quotas => ({
      ...quotas,
      id: name,
      cpuFormItem: {
        name: `${splicingName(quotas.envName)}---cpu`,
        value: quotas.cpu.total
      },
      memoryFormItem: {
        name: `${splicingName(quotas.envName)}---memory`,
        value: quotas.memory.total
      },
      alias
    }))
  }

  const renderFirstRow = (children, index) => {
    const obj: any = {
      children,
      props: {}
    }

    if (index !== 0) {
      obj.props.rowSpan = 0
    } else {
      obj.props.rowSpan = rowsCount
    }

    return obj
  }

  const renderEmpty = () => ({
    props: {
      colSpan: 0
    }
  })

  const renderMetrics = (metrics, Unit, isEditing?: boolean, key?: string, itemName?: string, hasMinimum?: boolean) => {
    // const { used, assigned, total, limit } = metrics
    const { used, assigned, total } = metrics
    const formattedUsed = Number(formatFloat(used))
    const formattedAssigned = Number(formatFloat(assigned))
    const formattedTotal = Number(formatFloat(total))
    // const formattedLimit = Number(formatFloat(limit))

    // const checkObj = hasMinimum ? { message: `${itemName} must be less than ${formattedLimit}` } : { min: formattedAssigned, message: `${itemName} must be in range of ${formattedAssigned} to ${formattedLimit}` }

    const children = (
      <MetricsWrapper>
        <span>
          {formattedUsed} <span className='unit'>{Unit}</span>
        </span>
        <span>
          {formattedAssigned} <span className='unit'>{Unit}</span>
        </span>
        {isEditing ? (
          <span>
            <StyledFormItem
              name={key}
              rules={[
                { required: true, message: `Please input ${itemName}!` },
                // {
                //   max: formattedLimit,
                //   type: 'number',
                //   ...checkObj
                // },
                {
                  validator: (rule, value) => {
                    if (QUOTAS_DECIMAL_CHECK.test(value)) {
                      return Promise.resolve()
                    } else {
                      return Promise.reject(formRuleMessage.TWO_DECIMAL_PLACES_LIMIT)
                    }
                  }
                }
              ]}
              normalize={value => (value.length ? Number(value) : value)}
            >
              <StyledInput type='number' addonAfter={Unit} step={1} />
            </StyledFormItem>
          </span>
        ) : typeof total === 'number' ? (
          <span>
            {formattedTotal} <span className='unit'>{Unit}</span>
          </span>
        ) : (
          <span className='unit'>No limited</span>
        )}
      </MetricsWrapper>
    )

    return isEditing
      ? children
      : {
          children,
          props: {
            colSpan: 3
          }
        }
  }

  const columns = [
    {
      title: isCluster ? 'Cluster' : 'Tenant',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      textWrap: 'word-break',
      render: (id, record, index) => {
        const name = isCluster ? id : record.alias ? `${record.alias}(${id})` : id
        return renderFirstRow(<Name>{name}</Name>, index)
      }
    },
    {
      title: 'Environment',
      dataIndex: 'envName',
      key: 'envName',
      width: 100
    },
    {
      title: 'CPU(Used)',
      dataIndex: 'cpu',
      key: 'usedCPU',
      editable: true,
      width: 110,
      getInitialValue: record => record.cpu && record.cpu.total,
      EditingRender: record =>
        renderMetrics(record.cpu, 'Cores', true, record.cpuFormItem.name, 'CPU(Quota)', hasMinimum),
      render: cpu => renderMetrics(cpu, 'Cores')
    },
    {
      title: 'CPU(Assigned)',
      dataIndex: 'cpu',
      key: 'assignedCPU',
      width: 110,
      render: renderEmpty
    },
    {
      title: 'CPU(Quota)',
      dataIndex: 'cpu',
      key: 'quotaCPU',
      width: 110,
      render: renderEmpty
    },
    {
      title: 'Memory(Used)',
      dataIndex: 'memory',
      key: 'usedMemory',
      editable: true,
      width: 110,
      getInitialValue: record => record.memory && record.memory.total,
      EditingRender: record =>
        renderMetrics(record.memory, 'GiB', true, record.memoryFormItem.name, 'Memory(Quota)', hasMinimum),
      render: memory => renderMetrics(memory, 'GiB')
    },
    {
      title: 'Memory(Assigned)',
      dataIndex: 'memory',
      key: 'assignedMemory',
      width: 110,
      render: renderEmpty
    },
    {
      title: 'Memory(Quota)',
      dataIndex: 'memory',
      key: 'quotaMemory',
      width: 110,
      render: renderEmpty
    },
    {
      title: 'Action',
      key: 'action',
      width: 210,
      render: (record, _, index) => {
        const buttonDom = isEditing ? (
          <ButtonWrap>
            <StyledButton onClick={() => setEditing(false)} disabled={isUpdating} type='link'>
              Cancel
            </StyledButton>
            <StyledButton onClick={() => handleSave(record.id)} loading={isUpdating} type='link'>
              Save
            </StyledButton>
          </ButtonWrap>
        ) : (
          <StyledButton onClick={() => setEditing(true)} disabled={!canEditQuotaMap[type]} type='link'>
            <FormOutlined /> Quota Manage
          </StyledButton>
        )

        return renderFirstRow(buttonDom, index)
      }
    }
  ]

  const components = {
    body: {
      cell: EditableCell
    }
  }

  const formattedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        EditingRender: col.EditingRender,
        getInitialValue: col.getInitialValue,
        isEditing
      })
    }
  })

  const getFormInitialValue = () => {
    const quotas = formatQuotasData(quotaData)
    const initialValue: any = {}
    quotas.forEach(item => {
      const { cpuFormItem, memoryFormItem } = item

      initialValue[cpuFormItem.name] = Number(formatFloat(cpuFormItem.value))
      initialValue[memoryFormItem.name] = Number(formatFloat(memoryFormItem.value))
    })

    return initialValue
  }

  return (
    <Form form={form} component={false} initialValues={getFormInitialValue()}>
      <Table
        bordered
        rowKey='name'
        components={components}
        columns={formattedColumns}
        dataSource={formatQuotasData(quotaData)}
        pagination={false}
      />
    </Form>
  )
}

export default QuotasTable
