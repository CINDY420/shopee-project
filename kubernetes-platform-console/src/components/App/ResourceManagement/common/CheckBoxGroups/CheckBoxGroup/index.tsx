import * as React from 'react'
import { Checkbox, Row, Col } from 'infrad'
import { IOptions, isPlainOption } from 'components/App/ResourceManagement/common/CheckBoxGroups'
import { CheckboxValueType } from 'infrad/lib/checkbox/Group'
import { CheckboxChangeEvent } from 'infrad/lib/checkbox'
import { zip } from 'lodash'

const { Group } = Checkbox

interface ICheckBoxGroupProps {
  title: string
  options: IOptions
  defaultCheckedList?: string[]
  value?: string[]
  onChange: (newGroupValue: CheckboxValueType[]) => void
}

const CheckBoxGroup: React.FC<ICheckBoxGroupProps> = ({ title, value, defaultCheckedList, options, onChange }) => {
  const defaultCheckedValue = defaultCheckedList || []

  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>(defaultCheckedValue)
  const [indeterminate, setIndeterminate] = React.useState(true)
  const [checkAll, setCheckAll] = React.useState(defaultCheckedValue.length === options.length)
  const optionValueList = options.map(option => (isPlainOption(option) ? option : option.name))
  const optionLabelList = options.map(option => (isPlainOption(option) ? option : option.label))

  React.useEffect(() => {
    setIndeterminate(!!checkedList.length && checkedList.length < options.length)
    setCheckAll(checkedList.length === options.length)
  }, [checkedList, options.length])

  const handleChange = (list: CheckboxValueType[]) => {
    setCheckedList(list)
    setIndeterminate(!!list.length && list.length < options.length)
    setCheckAll(list.length === options.length)
    onChange(list)
  }

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const list = e.target.checked ? optionValueList : []
    setCheckedList(list)
    setIndeterminate(false)
    setCheckAll(e.target.checked)
    onChange(list)
  }

  return (
    <Row>
      <Col span={24}>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          {title}
        </Checkbox>
      </Col>
      <Col span={24}>
        <Group onChange={handleChange} value={value || checkedList}>
          <Row>
            {zip(optionLabelList, optionValueList).map(option => {
              return (
                <Col span={24} key={option[1]}>
                  <Checkbox value={option[1]}>{option[0]}</Checkbox>
                </Col>
              )
            })}
          </Row>
        </Group>
      </Col>
    </Row>
  )
}

export default CheckBoxGroup
