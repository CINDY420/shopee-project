import * as React from 'react'
import { Form } from 'infrad'
import { FormItemProps } from 'infrad/lib/form'

import { BATCH_SCALE_FORM } from 'constants/deployment'

import { StyledForm, StyledInput } from './style'

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}

interface IProps {
  onFinish: (values: any) => void
}

interface IValidate {
  validateStatus: FormItemProps['validateStatus']
  message: string
}

const BatchScaleForm: React.FC<IProps> = ({ onFinish }) => {
  const [form] = Form.useForm()

  const [validateState, setValidateState] = React.useState<IValidate>()

  return (
    <StyledForm
      form={form}
      hideRequiredMark
      id={BATCH_SCALE_FORM}
      onFinish={values => onFinish(values)}
      initialValues={{ releaseCount: 0 }}
      {...layout}
    >
      <Form.Item
        label='Scale To'
        name='releaseCount'
        rules={[
          { required: true, message: 'required!' },
          { type: 'number', min: 0, max: 1000, message: 'Must be range of 0 to 1000!' },
          ({ getFieldValue }) => ({
            validator (rule, value) {
              if (value === 0) {
                setValidateState({
                  validateStatus: 'warning',
                  message: 'Make sure to scale to 0.'
                })
              } else {
                setValidateState(null)
              }

              return Promise.resolve()
            }
          })
        ]}
        getValueFromEvent={(e: React.FormEvent<HTMLInputElement>) => {
          const convertedValue = Number(e.currentTarget.value)
          if (isNaN(convertedValue)) {
            const prevValue = Number(form.getFieldValue('releaseCount'))
            return isNaN(prevValue) ? 0 : prevValue
          } else {
            return convertedValue
          }
        }}
        validateStatus={validateState?.validateStatus || null}
        help={validateState?.message || null}
      >
        <StyledInput />
      </Form.Item>
    </StyledForm>
  )
}

export default BatchScaleForm
