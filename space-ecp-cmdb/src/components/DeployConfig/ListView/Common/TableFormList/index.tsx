import * as React from 'react'
import { Table, Form, Button } from 'infrad'
import { PlusOutlined, DeleteOutlined } from 'infra-design-icons'

import { ColumnsType, TableProps } from 'infrad/lib/table'
import { StyledTable } from 'src/components/DeployConfig/ListView/Common/TableFormList/style'
import { FormListOperation, FormListFieldData } from 'infrad/lib/form/FormList'
import {
  DeployConfigContext,
  FormType,
  getDispatchers,
} from 'src/components/DeployConfig/useDeployConfigContext'

interface ITableFormListProps {
  onAdd: FormListOperation['add']
  onRemove?: FormListOperation['remove']
  dataSource: TableProps<FormListFieldData>['dataSource']
  dataColumns: ColumnsType
  addButtonText?: string
  actionColumns?: ColumnsType
  canDeleteAll?: boolean
  formType: FormType
}

const TableFormList: React.FC<ITableFormListProps> = (props) => {
  const {
    onAdd,
    onRemove,
    dataSource,
    dataColumns,
    addButtonText = 'Add',
    actionColumns,
    canDeleteAll = true,
    formType,
  } = props

  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { isEditing } = state

  const isLastRow = dataSource.length === 1
  const deleteDisabled = canDeleteAll ? !canDeleteAll : isLastRow

  React.useEffect(() => {
    dispatchers.updateErrors(formType)
  }, [dispatchers, formType, dataSource.length])

  const actionColumn = () => ({
    title: '',
    dataIndex: 'action',
    key: 'action',
    render: (_: unknown, record: FormListFieldData) => {
      const { name } = record

      return (
        <Form.Item>
          <Button
            shape="circle"
            onClick={() => onRemove?.(name)}
            icon={<DeleteOutlined />}
            disabled={deleteDisabled}
          />
        </Form.Item>
      )
    },
  })

  const addRowButton = () => (
    <Table.Summary>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={dataColumns.length}>
          <Button type="dashed" block icon={<PlusOutlined />} onClick={() => onAdd()}>
            {addButtonText}
          </Button>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  )

  return (
    <StyledTable
      rowKey="name"
      dataSource={dataSource}
      columns={isEditing ? dataColumns.concat(actionColumns || actionColumn()) : dataColumns}
      summary={isEditing ? () => addRowButton() : null}
      pagination={false}
      locale={{ emptyText: () => null }}
      size="small"
    />
  )
}

export default TableFormList
