import * as React from 'react'
import { Row, Col } from 'infrad'
import { CheckboxValueType } from 'infrad/lib/checkbox/Group'
import CheckBoxGroup from 'components/App/ResourceManagement/common/CheckBoxGroups/CheckBoxGroup'

interface ICheckBoxGroup {
  title: string
  name: string
}

export interface IOption {
  name: string
  label: string
  disabled?: boolean
}

export type IOptions = (IOption | string)[]

interface ICheckBoxGroupsProps {
  groups: ICheckBoxGroup[]
  options: Record<string, IOptions>
  values: Record<string, string[]>
  onChange: (group: string, newGroupValue: CheckboxValueType[]) => void
}

export const isPlainOption = (option: IOption | string): option is string => {
  return typeof option === 'string'
}

const CheckBoxGroups: React.FC<ICheckBoxGroupsProps> = ({ groups, options, values, onChange }) => {
  return (
    <Row wrap={false}>
      {groups.map((group, index) => {
        const { title, name } = group
        const groupOptions = options?.[name] || []
        const value = values?.[name] || []

        return (
          <Col key={name} flex={index === 0 ? '3 1 0' : '5 1 0'} style={{ marginRight: '12px' }}>
            <CheckBoxGroup
              key={name}
              options={groupOptions}
              title={title}
              onChange={newGroupValue => onChange(name, newGroupValue)}
              defaultCheckedList={value}
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default CheckBoxGroups
