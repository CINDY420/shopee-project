import * as React from 'react'
import { Form, Input } from 'infrad'
import { FormItemProps } from 'infrad/lib/form'
import { FormInstance } from 'rc-field-form/es/interface'

import {
  StyledSpan,
  StyledFormItem
} from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/ScaleForm/Scale/style'
import {
  InlineFormItem,
  Label
} from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/style'
import { PHASE_RELEASE } from 'constants/deployment'

interface IValidate {
  validateStatus: FormItemProps['validateStatus']
  message: string
}

interface IProps {
  phase: string
}

const Scale: React.FC<IProps> = ({ phase }) => {
  const [validateState, setValidateState] = React.useState<IValidate>({
    validateStatus: 'success',
    message: ''
  })

  const isRelease = phase === PHASE_RELEASE

  const handleInputChange = (form: FormInstance, event: React.ChangeEvent<HTMLInputElement>) => {
    const totalCount = Number(event.target.value)
    if (!isNaN(totalCount)) {
      form.setFieldsValue({
        releaseCount: Number(totalCount)
      })
    }
  }

  return (
    <StyledFormItem>
      <InlineFormItem label={<Label>{isRelease ? 'Release' : 'FTE'}</Label>} width='156px' margin='0'>
        <InlineFormItem
          margin='0'
          name='releaseCount'
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input disabled />
        </InlineFormItem>
        <StyledSpan>=</StyledSpan>
      </InlineFormItem>
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.podCount !== currentValues.podCount}>
        {form => {
          return (
            <InlineFormItem
              margin='0'
              label={<Label>Total</Label>}
              name='podCount'
              required={false}
              getValueFromEvent={(e: React.FormEvent<HTMLInputElement>) => {
                const convertedValue = Number(e.currentTarget.value)

                if (isNaN(convertedValue)) {
                  return Number(form.getFieldValue('podCount'))
                } else {
                  return convertedValue
                }
              }}
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (value === 0) {
                      setValidateState({
                        validateStatus: 'warning',
                        message: 'Make sure to scale to 0.'
                      })
                    } else {
                      setValidateState({
                        validateStatus: 'success',
                        message: ''
                      })
                    }
                    return Promise.resolve()
                  }
                })
              ]}
              validateStatus={validateState.validateStatus}
              help={validateState.message}
            >
              <Input onChange={e => handleInputChange(form, e)} onPressEnter={e => e.preventDefault()} />
            </InlineFormItem>
          )
        }}
      </Form.Item>
    </StyledFormItem>
  )
}

export default Scale
