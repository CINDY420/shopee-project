import * as React from 'react'
import { PlusOutlined, DeleteOutlined } from 'infra-design-icons'
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList'
import { ColumnsType, TableProps } from 'antd/lib/table'
import { Button, Form, Table } from 'antd'
import { StyledTable } from 'components/Common/TableFormList/style'

interface ITableFormListProps {
  onAdd: FormListOperation['add']
  onRemove?: FormListOperation['remove']
  dataSource: TableProps<FormListFieldData>['dataSource']
  dataColumns: ColumnsType
  addButtonText?: string
  actionColumns?: ColumnsType
  canDeleteAll?: boolean
}

const TableFormList: React.FC<ITableFormListProps> = (props) => {
  const { onAdd, onRemove, dataSource, dataColumns, addButtonText = 'Add', actionColumns, canDeleteAll = true } = props

  const isLastRow = dataSource.length === 1
  const deleteDisabled = canDeleteAll ? !canDeleteAll : isLastRow

  const actionColumn = () => ({
    title: '',
    dataIndex: 'action',
    key: 'action',
    render: (_: unknown, record: FormListFieldData) => {
      const { name } = record

      return (
        <Form.Item>
          <Button shape='circle' onClick={() => onRemove?.(name)} icon={<DeleteOutlined />} disabled={deleteDisabled} />
        </Form.Item>
      )
    }
  })

  const addRowButton = () => (
    <Table.Summary>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={dataColumns.length}>
          <Button type='dashed' block icon={<PlusOutlined />} onClick={() => onAdd()}>
            {addButtonText}
          </Button>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  )

  return (
    <StyledTable
      rowKey='name'
      dataSource={dataSource}
      columns={dataColumns.concat(actionColumns || actionColumn())}
      summary={() => addRowButton()}
      pagination={false}
      locale={{ emptyText: () => null }}
      size='small'
    />
  )
}

export default TableFormList
