import React from 'react'

import { IEngine } from 'api/types/application/pipeline'

import { StyledForm } from './style'
import { FormInstance } from 'infrad/lib/form'
import { Select } from 'infrad'

const { Item } = StyledForm
const { Option } = Select

interface IBatchMigrateForm {
  form: FormInstance
  onFieldsChange: (disabled: boolean) => void
  engines: IEngine[]
}

const BatchMigrateForm: React.FC<IBatchMigrateForm> = ({ form, onFieldsChange, engines }) => {
  const handleFieldsChange = () => {
    const values = form.getFieldsValue()
    const { destEngine } = values
    onFieldsChange && onFieldsChange(!destEngine)
  }

  return (
    <StyledForm form={form} hideRequiredMark onFieldsChange={handleFieldsChange}>
      <Item name='destEngine' label='Target Engine' rules={[{ required: true, message: 'Target Engine is required.' }]}>
        <Select placeholder='Please select.' style={{ width: 300 }} getPopupContainer={() => document.body}>
          {engines.map(engine => (
            <Option value={engine.name} key={engine.name}>
              {engine.name}
            </Option>
          ))}
        </Select>
      </Item>
    </StyledForm>
  )
}

export default BatchMigrateForm
