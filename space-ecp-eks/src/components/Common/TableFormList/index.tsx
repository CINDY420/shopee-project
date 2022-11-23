import React from 'react'
import { Form, Table, TableProps, Button, TableColumnType } from 'infrad'
import { FormListProps } from 'infrad/lib/form'
import Icon, { PlusOutlined } from 'infra-design-icons'
import { ButtonProps } from 'infrad/lib/button'
import { FormListOperation, FormListFieldData } from 'infrad/lib/form/FormList'
import { ReactComponent as DeleteSvg } from 'src/assets/delete.svg'

import { StyledTable as DefaultTable } from 'src/components/Common/TableFormList/style'
import { CSSProperties } from 'styled-components'

const { List, ErrorList } = Form

const AddNewButton: React.FC<ButtonProps> = ({ children, ...others }) => (
  <Button
    type="link"
    style={{ border: '1px dashed #D9D9D9', color: 'rgba(0, 0, 0, 0.85)' }}
    block
    icon={<PlusOutlined />}
    {...others}
  >
    {children}
  </Button>
)

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

export type IColumns = TableProps<FormListFieldData>['columns']
export type IListAdd = FormListOperation['add']
export type IListRemove = FormListOperation['remove']
export type IActionRender = (triggerRemove?: () => void) => React.ReactNode
export type IAddNewRender = (triggerAdd?: () => void) => React.ReactNode
export type IAsyncOrSyncFn = () => void | Promise<void>
export type IAddNewColSpanKeys = [string, string]

interface ITableFormListProps {
  // antd Form.List name
  name: FormListProps['name']
  // antd Table columns
  columns: IColumns
  // antd Form.List rules
  rules?: FormListProps['rules']
  // antd Form.List initialValue
  initialValue?: FormListProps['initialValue']
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
  actionRenderTitle?: React.ReactNode
  // hook fn that will be triggered before add new item
  beforeAddNew?: IAsyncOrSyncFn
  // antd Table onHeaderRow
  onHeaderRow?: TableProps<FormListFieldData>['onHeaderRow']
  // antd Table onRow
  onRow?: TableProps<FormListFieldData>['onRow']
}

const generateColumnsWithAction = (
  columns: IColumns,
  remove: IListRemove,
  actionRender?: IActionRender,
  actionRenderTitle?: React.ReactNode,
) => {
  const actionColumn: TableColumnType<FormListFieldData> = {
    key: 'action',
    title: actionRenderTitle,
    onCell: () => ({ style: { textAlign: 'center' } }),
    render: (_, record) => {
      const recordName = record?.name
      if (actionRender) {
        const triggerRemove = () => remove(recordName)
        const ActionNode = actionRender(triggerRemove)
        return ActionNode
      }

      return (
        <Button
          shape="circle"
          onClick={() => remove(recordName)}
          icon={<Icon component={DeleteSvg} width={14} />}
          style={{ marginBottom: '24px' }}
        />
      )
    },
  }

  const actionColumns = [...columns, actionColumn]
  return actionColumns
}

const summaryRender = (
  add: IListAdd,
  addNewRender?: IAddNewRender,
  beforeAddNew?: IAsyncOrSyncFn,
) => {
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
const defaultOnHeaderRow = () => ({
  style: { color: '#999999', fontSize: '12px', fontWeight: 400 },
})

const computeAddNewColSpan = (
  columns: IColumns,
  colSpanKeys: IAddNewColSpanKeys,
): { offset: number; colSpan: number } => {
  const defaultColSpan = { offset: 0, colSpan: columns.length + 1 }
  if (colSpanKeys?.length !== 2) return defaultColSpan

  const [startColumnKey, endColumnKey] = colSpanKeys
  const startIndex = columns.findIndex((column) => column.key === startColumnKey)
  const endIndex = columns.findIndex((column) => column.key === endColumnKey)
  const offset = startIndex
  const colSpan = endIndex - startIndex + 1

  if (offset < 0 || colSpan < 0) return defaultColSpan

  return { offset, colSpan }
}

const TableFormList: React.FC<ITableFormListProps> = (props) => {
  const {
    name,
    columns,
    rules,
    initialValue,
    style,
    addNewVisible = true,
    actionVisible = true,
    AntdTable = DefaultTable,
    addNewColSpanKeys,
    addNewRender,
    actionRender,
    actionRenderTitle = '',
    beforeAddNew,
    onHeaderRow = defaultOnHeaderRow,
    onRow,
  } = props
  const { offset, colSpan } = computeAddNewColSpan(columns, addNewColSpanKeys)
  return (
    <div style={{ ...defaultStyle, ...style }}>
      <List name={name} rules={rules} initialValue={initialValue}>
        {(fields, { add, remove }, { errors }) => (
          <AntdTable
            rowKey="name"
            dataSource={fields}
            pagination={false}
            onHeaderRow={onHeaderRow}
            onRow={onRow}
            columns={
              actionVisible
                ? generateColumnsWithAction(columns, remove, actionRender, actionRenderTitle)
                : columns
            }
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
        )}
      </List>
    </div>
  )
}

export default TableFormList
