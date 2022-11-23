import React from 'react'

interface IEditableCellProps {
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: any
  EditingRender: any
  getInitialValue: any
  isEditing: boolean
}

const EditableCell: React.FC<IEditableCellProps> = ({
  editable,
  children,
  dataIndex,
  record,
  EditingRender,
  isEditing,
  getInitialValue,
  ...restProps
}) => {
  let childNode = children

  if (editable) {
    childNode = isEditing ? <EditingRender {...record} /> : children
  }

  return <td {...restProps}>{childNode}</td>
}

export default EditableCell
