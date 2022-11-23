import React from 'react'
import { CheckOutlined, CloseOutlined, EditOutlined } from 'infra-design-icons'
import { StyledInput, StyledSpace, StyledUnit } from 'components/Common/EditableTableCell/style'

interface IEditableTableCellProps {
  value: number | string
  unit?: string
  isCanEdit?: boolean
  onCancel?: () => void
  onOk?: (value) => void
}

const ICON_STYLE = { style: { color: '#2673DD' } }
const EditableTableCell: React.FC<IEditableTableCellProps> = ({
  value,
  unit,
  isCanEdit,
  onCancel,
  onOk,
}) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [tableCellValue, setTableCellValue] = React.useState(value)

  const handleInputValueChange = (value: string) => {
    setTableCellValue(value)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTableCellValue(value)
    onCancel?.()
  }

  const handleOk = () => {
    setIsEditing(false)
    onOk?.(tableCellValue)
  }

  return (
    <StyledSpace>
      {!isEditing ? (
        <>
          {tableCellValue}
          <StyledUnit>{unit}</StyledUnit>
          {isCanEdit && <EditOutlined onClick={() => setIsEditing(true)} {...ICON_STYLE} />}
        </>
      ) : (
        <>
          <StyledInput
            ref={(node) => {
              node?.focus()
            }}
            defaultValue={tableCellValue}
            onChange={(e) => handleInputValueChange(e.target.value)}
          />
          <CloseOutlined onClick={handleCancel} {...ICON_STYLE} />
          <CheckOutlined onClick={handleOk} {...ICON_STYLE} />
        </>
      )}
    </StyledSpace>
  )
}

export default EditableTableCell
