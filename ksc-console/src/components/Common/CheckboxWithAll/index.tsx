import React from 'react'
import { Checkbox, Space } from 'infrad'
import { CheckboxGroupProps, CheckboxValueType } from 'infrad/lib/checkbox/Group'

type RequiredCheckboxGroupProps = Required<CheckboxGroupProps>
type PickedCheckboxGroupProps = Pick<
  CheckboxGroupProps,
  'name' | 'value' | 'onChange' | 'defaultValue' | 'disabled'
>
interface ICheckboxGroupWithAll extends PickedCheckboxGroupProps {
  options: RequiredCheckboxGroupProps['options']
}
const CheckboxGroupWithAll: React.FC<ICheckboxGroupWithAll> = (props) => {
  const { options, onChange, value: checkedValues, ...resetProps } = props
  const [isCheckAll, setIsCheckAll] = React.useState<boolean>(false)
  const [isIndeterminate, setIsIndeterminate] = React.useState(false)
  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([])

  const onCheckboxGroupChange = (checkedList) => {
    setCheckedList(checkedList)
    onChange && onChange(checkedList)
  }

  const onCheckAllChange = (checked) => {
    let lists: Array<CheckboxValueType> = []
    if (checked) {
      lists = options.map((item) => {
        if (typeof item === 'string') return item
        if (typeof item === 'number') return item
        return item.value
      })
      setCheckedList(lists)
    } else setCheckedList([])
    onChange && onChange(lists)
  }

  React.useEffect(() => {
    setIsIndeterminate(!!checkedList.length && checkedList.length < options.length)
    setIsCheckAll(checkedList.length === options.length)
  }, [checkedList, options])

  React.useEffect(() => {
    checkedValues && setCheckedList(checkedValues)
  }, [checkedValues])

  return (
    <Space>
      <Checkbox
        checked={isCheckAll}
        indeterminate={isIndeterminate}
        onChange={(e) => onCheckAllChange(e.target.checked)}
      >
        All
      </Checkbox>
      <Checkbox.Group
        options={options}
        onChange={onCheckboxGroupChange}
        value={checkedList}
        {...resetProps}
      />
    </Space>
  )
}

export default CheckboxGroupWithAll
