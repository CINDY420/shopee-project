import React from 'react'
import { Form, Table, TableProps, Button, TableColumnType } from 'infrad'
import { FormListProps } from 'infrad/lib/form'
import { FormListOperation, FormListFieldData } from 'infrad/lib/form/FormList'
import Icon from 'infra-design-icons'
import deleteSvg from 'assets/delete.antd.svg'
import AddNewButton from 'components/Common/AddNewButton'

import { StyledTable as DefaultTable } from 'components/Common/TableFormList/style'
import { CSSProperties } from 'styled-components'

const { List, ErrorList } = Form

// TODO huadong.chen add tests

/**
 * Usage example:
 *  <TableFormList
 *    name='cronRules'
 *    columns={columns}
 *    addNewRender={(triggerAdd) => <Button onClick={() => triggerAdd()}>add new item</Button>}
 *    actionRender={(triggerRemove) => (
 *      <div>
 *        <Button onClick={() => triggerRemove()}>remove</Button>
 *        <Button onClick={() => console.log('edit')}>edit</Button>
 *      </div>
 *    )}
 *  />
 */

type IColumns = TableProps<FormListFieldData>['columns']
type IListAdd = FormListOperation['add']
type IListRemove = FormListOperation['remove']
type IActionRender = (triggerRemove?: () => void) => React.ReactNode
type IAddNewRender = (triggerAdd?: () => void) => React.ReactNode
type IAsyncOrSyncFn = () => void | Promise<void>
type IAddNewColSpanKeys = [string, string]

interface ITableFormListProps {
  // antd Form.List name
  name: FormListProps['name']
  // antd Table columns
  columns: IColumns
  // antd Form.List rules
  rules?: FormListProps['rules']
  // react style
  style?: CSSProperties
  // hide addNewButton or not
  addNewVisible?: boolean
  // hide action column or not
  actionVisible?: boolean
  // antd Table with custom style
  AntdTable?: typeof Table
  // the addNewRow will span the columns from addNewColSpanKeys[0] to addNewColSpanKeys[1]
  addNewColSpanKeys?: IAddNewColSpanKeys
  // custom render addNewButton ReactNode
  addNewRender?: IAddNewRender
  // custom render Table remove column ReactNode
  actionRender?: IActionRender
  // hook fn that will be triggered before add new item
  beforeAddNew?: IAsyncOrSyncFn
  // antd Table onHeaderRow
  onHeaderRow?: TableProps<FormListFieldData>['onHeaderRow']
  // antd Table onRow
  onRow?: TableProps<FormListFieldData>['onRow']
}

const generateColumnsWithAction = (columns: IColumns, remove: IListRemove, actionRender?: IActionRender) => {
  const actionColumn: TableColumnType<FormListFieldData> = {
    key: 'action',
    title: '',
    onCell: () => {
      return { style: { textAlign: 'center' } }
    },
    render: (_, record) => {
      const recordName = record?.name
      if (actionRender) {
        const triggerRemove = () => remove(recordName)
        const ActionNode = actionRender(triggerRemove)
        return ActionNode
      }

      return (
        <Button
          shape='circle'
          onClick={() => remove(recordName)}
          icon={<Icon component={deleteSvg} width={14} />}
          style={{ marginBottom: '24px' }}
        />
      )
    }
  }

  const actionColumns = [...columns, actionColumn]
  return actionColumns
}

const summaryRender = (add: IListAdd, addNewRender?: IAddNewRender, beforeAddNew?: IAsyncOrSyncFn) => {
  if (addNewRender) {
    return addNewRender(add)
  }
  return (
    <AddNewButton
      onClick={async () => {
        beforeAddNew && (await beforeAddNew())
        add()
      }}
    >
      Add
    </AddNewButton>
  )
}

const defaultStyle = { paddingLeft: '8px', backgroundColor: '#fafafa' }
const defaultOnHeaderRow = () => ({ style: { color: '#999999', fontSize: '12px', fontWeight: 400 } })

const computeAddNewColSpan = (
  columns: IColumns,
  colSpanKeys: IAddNewColSpanKeys
): { offset: number; colSpan: number } => {
  const defaultColSpan = { offset: 0, colSpan: columns.length }
  if (colSpanKeys?.length !== 2) return defaultColSpan

  const [startColumnKey, endColumnKey] = colSpanKeys
  const startIndex = columns.findIndex(column => column.key === startColumnKey)
  const endIndex = columns.findIndex(column => column.key === endColumnKey)
  const offset = startIndex
  const colSpan = endIndex - startIndex + 1
  if (offset < 0 || colSpan < 0) return defaultColSpan

  return { offset, colSpan }
}

const TableFormList: React.FC<ITableFormListProps> = props => {
  const {
    name,
    columns,
    rules,
    style,
    addNewVisible = true,
    actionVisible = true,
    AntdTable = DefaultTable,
    addNewColSpanKeys,
    addNewRender,
    actionRender,
    beforeAddNew,
    onHeaderRow = defaultOnHeaderRow,
    onRow
  } = props
  const { offset, colSpan } = computeAddNewColSpan(columns, addNewColSpanKeys)
  return (
    <div style={{ ...defaultStyle, ...style }}>
      <List name={name} rules={rules}>
        {(fields, { add, remove }, { errors }) => {
          return (
            <AntdTable
              dataSource={fields}
              pagination={false}
              onHeaderRow={onHeaderRow}
              onRow={onRow}
              columns={actionVisible ? generateColumnsWithAction(columns, remove, actionRender) : columns}
              summary={() => (
                <Table.Summary.Row>
                  {offset > 0 && <Table.Summary.Cell index={0} colSpan={offset} />}
                  <Table.Summary.Cell index={offset + 1} colSpan={colSpan}>
                    {addNewVisible && summaryRender(add, addNewRender, beforeAddNew)}
                    <ErrorList errors={errors} />
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          )
        }}
      </List>
    </div>
  )
}

export default TableFormList
