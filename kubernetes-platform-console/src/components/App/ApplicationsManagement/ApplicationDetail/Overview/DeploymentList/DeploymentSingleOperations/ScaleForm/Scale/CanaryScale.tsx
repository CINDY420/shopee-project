import * as React from 'react'
import { Form, Input } from 'infrad'
import { FormItemProps } from 'infrad/lib/form'

import {
  StyledSpan,
  StyledFormItem
} from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/ScaleForm/Scale/style'
import {
  InlineFormItem,
  Label
} from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/style'

interface IValidate {
  validateStatus: FormItemProps['validateStatus']
  message: string
}

const Scale: React.FC = () => {
  const [validateState, setValidateState] = React.useState<IValidate>({
    validateStatus: 'success',
    message: ''
  })

  return (
    <StyledFormItem extra='Adjust Total to scale release deployment. Adjust Canary to change the ratio of canary'>
      <InlineFormItem label={<Label>Release</Label>} width='156px' margin='0'>
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
        <StyledSpan>+</StyledSpan>
      </InlineFormItem>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.canaryCount !== currentValues.canaryCount}
      >
        {form => {
          return (
            <InlineFormItem label={<Label>Canary</Label>} width='156px' margin='0'>
              <InlineFormItem
                margin='0'
                name='canaryCount'
                dependencies={['podCount']}
                getValueFromEvent={(e: React.FormEvent<HTMLInputElement>) => {
                  const convertedValue = Number(e.currentTarget.value)
                  if (isNaN(convertedValue)) {
                    return Number(form.getFieldValue('canaryCount'))
                  } else {
                    return convertedValue
                  }
                }}
                rules={[
                  { required: true, message: 'required!' },
                  { type: 'number', min: 0, message: 'Must be integer!' },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const total = getFieldValue('podCount')

                      if (!value || value < total) {
                        return Promise.resolve()
                      }

                      return Promise.reject(new Error('Must be less than total pods.'))
                    }
                  })
                ]}
              >
                <Input
                  onChange={e => {
                    const canaryCount = e.target.value
                    const totalCount = form.getFieldValue('podCount')
                    const releaseCount = Number(totalCount) - Number(canaryCount)

                    if (!isNaN(releaseCount)) {
                      form.setFieldsValue({
                        releaseCount
                      })
                    }
                  }}
                />
              </InlineFormItem>
              <StyledSpan>=</StyledSpan>
            </InlineFormItem>
          )
        }}
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.podCount !== currentValues.podCount}>
        {form => {
          return (
            <InlineFormItem
              margin='0'
              label={<Label>Total</Label>}
              name='podCount'
              required={false}
              dependencies={['canaryCount']}
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
                    const canary = getFieldValue('canaryCount')

                    if (value === 0) {
                      setValidateState({
                        validateStatus: 'warning',
                        message: 'Make sure to scale to 0.'
                      })
                      return Promise.resolve()
                    }

                    if (!value || value > canary) {
                      setValidateState({
                        validateStatus: 'success',
                        message: ''
                      })
                      return Promise.resolve()
                    }

                    setValidateState({
                      validateStatus: 'error',
                      message: 'Must be no less than canary pods.'
                    })
                    return Promise.reject()
                  }
                })
              ]}
              validateStatus={validateState.validateStatus}
              help={validateState.message}
            >
              <Input
                onChange={e => {
                  const totalCount = e.target.value
                  const canaryCount = form.getFieldValue('canaryCount')
                  const releaseCount = Number(totalCount) - Number(canaryCount)

                  if (!isNaN(releaseCount)) {
                    form.setFieldsValue({
                      releaseCount
                    })
                  }
                }}
              />
            </InlineFormItem>
          )
        }}
      </Form.Item>
    </StyledFormItem>
  )
}

export default Scale
