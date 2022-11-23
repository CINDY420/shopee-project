import React from 'react'
import { Form, Table, TableProps, Button, TableColumnType } from 'infrad'
import Icon, { PlusOutlined } from 'infra-design-icons'

import { ButtonProps } from 'infrad/lib/button'
import { FormListProps } from 'infrad/lib/form'
import { FormListOperation, FormListFieldData } from 'infrad/lib/form/FormList'
import { StyledTable as DefaultTable } from '@/components/TableFormList/style'
import { CSSProperties } from 'styled-components'
import { ReactComponent as DeleteSvg } from '@/assets/delete.svg'

const { List, ErrorList } = Form

export const AddNewButton: React.FC<ButtonProps> = ({ children, ...others }) => (
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

export type IColumns = TableProps<FormListFieldData>['columns']
export type IListAdd = FormListOperation['add']
export type IListRemove = FormListOperation['remove']
export type IActionRender = (triggerRemove?: () => void) => React.ReactNode
export type IAddNewRender = (triggerAdd?: () => void, count?: number) => React.ReactNode
export type IAsyncOrSyncFn = () => void | Promise<void>
export type IAddNewColSpanKeys = [string, string]

// Generate Apis docs refer to https://d.umijs.org/zh-CN/guide/advanced#%E7%BB%84%E4%BB%B6-api-%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90
export interface ITableFormListProps extends TableProps<FormListFieldData> {
  /**
   * Same as antd Form.List name
   */
  name: FormListProps['name']
  /**
   * Same as antd Table columns
   */
  columns: IColumns
  /**
   * Same as antd Form.List rules
   */
  rules?: FormListProps['rules']
  /**
   * Element class name
   */
  className?: string
  /**
   * React style
   */
  style?: CSSProperties
  /**
   * Hide addNewButton or not
   */
  addNewVisible?: boolean
  /**
   * Hide action column or not
   */
  actionVisible?: boolean
  /**
   * Antd Table with custom style
   */
  AntdTable?: typeof Table
  /**
   * The addNewRow will span the columns from addNewColSpanKeys[0] to addNewColSpanKeys[1]
   */
  addNewColSpanKeys?: IAddNewColSpanKeys
  /**
   * Custom render addNewButton ReactNode
   */
  addNewRender?: IAddNewRender
  /**
   * Custom render Table remove column ReactNode
   */
  actionRender?: IActionRender
  /**
   * Function that will be triggered before add new item
   */
  beforeAddNew?: IAsyncOrSyncFn
  /**
   * The props for "Action" column, same as antd Table column
   */
  actionColumnProps?: TableColumnType<FormListFieldData>
}

interface IGenerateColumnsWithActionArgs {
  columns: IColumns
  remove: IListRemove
  actionRender?: IActionRender
  actionColumnProps?: TableColumnType<FormListFieldData>
}

const generateColumnsWithAction = ({
  columns = [],
  remove,
  actionRender,
  actionColumnProps,
}: IGenerateColumnsWithActionArgs) => {
  const actionColumn: TableColumnType<FormListFieldData> = {
    key: 'action',
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
    ...actionColumnProps,
  }

  const actionColumns = [...columns, actionColumn]
  return actionColumns
}

interface ISummaryRenderData {
  count: number
}

interface ISummaryRenderArgs {
  triggerAdd: IListAdd
  addNewRender?: IAddNewRender
  beforeAddNew?: IAsyncOrSyncFn
  data?: ISummaryRenderData
}

const summaryRender = ({ triggerAdd, addNewRender, beforeAddNew, data }: ISummaryRenderArgs) => {
  if (addNewRender) {
    return addNewRender(triggerAdd, data?.count)
  }
  return (
    <AddNewButton
      onClick={async () => {
        beforeAddNew && (await beforeAddNew())
        triggerAdd()
      }}
    >
      Add
    </AddNewButton>
  )
}

const defaultOnHeaderRow = () => ({
  style: { color: '#999999', fontSize: '12px', fontWeight: 400 },
})

interface IComputeAddNewColSpanArgs {
  columns: IColumns
  colSpanKeys?: IAddNewColSpanKeys
}
const computeAddNewColSpan = ({
  columns = [],
  colSpanKeys,
}: IComputeAddNewColSpanArgs): { offset: number; colSpan: number } => {
  const defaultColSpan = { offset: 0, colSpan: columns.length + 1 }
  if (colSpanKeys?.length !== 2) return defaultColSpan

  const columnsWithAction = [...columns, { key: 'action' }]

  const [startColumnKey, endColumnKey] = colSpanKeys
  const startIndex = columnsWithAction.findIndex((column) => column.key === startColumnKey)
  const endIndex = columnsWithAction.findIndex((column) => column.key === endColumnKey)
  const offset = startIndex
  const colSpan = endIndex - startIndex + 1

  if (offset < 0 || colSpan < 0) return defaultColSpan

  return { offset, colSpan }
}

const TableFormList: React.FC<ITableFormListProps> = (props) => {
  const {
    name,
    columns = [],
    rules,
    className,
    style,
    addNewVisible = true,
    actionVisible = true,
    AntdTable = DefaultTable,
    addNewColSpanKeys,
    addNewRender,
    actionRender,
    beforeAddNew,
    actionColumnProps,
    ...otherTableProps
  } = props
  const { offset, colSpan } = computeAddNewColSpan({ columns, colSpanKeys: addNewColSpanKeys })
  return (
    <div style={{ ...style }} className={className}>
      <List name={name} rules={rules}>
        {(fields, { add, remove }, { errors }) => (
          <AntdTable
            dataSource={fields}
            pagination={false}
            onHeaderRow={defaultOnHeaderRow}
            columns={
              actionVisible
                ? generateColumnsWithAction({
                    columns,
                    remove,
                    actionRender,
                    actionColumnProps,
                  })
                : columns
            }
            summary={() => (
              <Table.Summary.Row>
                {offset > 0 && <Table.Summary.Cell index={0} colSpan={offset} />}
                <Table.Summary.Cell index={offset + 1} colSpan={colSpan}>
                  {addNewVisible &&
                    summaryRender({
                      triggerAdd: add,
                      addNewRender,
                      beforeAddNew,
                      data: { count: fields?.length },
                    })}
                  <ErrorList errors={errors} />
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
            {...otherTableProps}
          />
        )}
      </List>
    </div>
  )
}

export default TableFormList
