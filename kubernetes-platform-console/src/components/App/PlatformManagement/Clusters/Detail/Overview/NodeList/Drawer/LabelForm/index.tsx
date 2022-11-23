import * as React from 'react'
import { Input, Button } from 'infrad'
import { FormInstance } from 'infrad/lib/form'
import { DeleteOutlined, PlusOutlined } from 'infra-design-icons'

import { INPUT_PLACEHOLDER } from 'constants/nodeActions'
import { throttle } from 'helpers/functionUtils'
import { StyledForm, StyledButton, StyledLabel } from './style'

interface ILabelFormProps {
  form: FormInstance
  setFormResult: (formResult: any) => void
}

const LabelForm: React.FC<ILabelFormProps> = props => {
  const { form, setFormResult } = props
  const addLabel = React.useRef<HTMLDivElement>()

  const formatAndSetResult = result => {
    const draft = {}
    const labels = result.labels
    labels.forEach(label => {
      if (label && label.key) {
        draft[label.key] = label.value || ''
      }
    })
    setFormResult({ labels: draft })
  }

  const handleValuesChange = (changedValues, allValues) => {
    const callback = throttle(500, formatAndSetResult)
    callback(allValues)
  }

  return (
    <StyledForm form={form} onValuesChange={handleValuesChange} initialValues={{ labels: [undefined] }}>
      {/* init StyledForm.List, to have */}
      <StyledLabel>Labels</StyledLabel>
      <StyledForm.List name='labels'>
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map(field => (
                <StyledForm.Item key={field.key} className='formGroup'>
                  <StyledForm.Item label='Key' name={[field.name, 'key']} fieldKey={[field.fieldKey, 'key']}>
                    <Input placeholder={INPUT_PLACEHOLDER} />
                  </StyledForm.Item>
                  <StyledForm.Item label='Value' name={[field.name, 'value']} fieldKey={[field.fieldKey, 'value']}>
                    <Input placeholder={INPUT_PLACEHOLDER} />
                  </StyledForm.Item>
                  {fields.length > 1 ? (
                    <Button
                      shape='circle'
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        remove(field.name)
                      }}
                      className='deleteBtn'
                    />
                  ) : null}
                </StyledForm.Item>
              ))}
              <StyledForm.Item>
                <StyledButton
                  type='dashed'
                  onClick={() => {
                    add()
                  }}
                  ref={addLabel}
                >
                  <PlusOutlined /> Add
                </StyledButton>
              </StyledForm.Item>
            </div>
          )
        }}
      </StyledForm.List>
    </StyledForm>
  )
}

export default LabelForm
