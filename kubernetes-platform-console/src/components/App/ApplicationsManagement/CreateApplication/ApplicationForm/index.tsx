import * as React from 'react'
import { Input } from 'infrad'
import { FormInstance } from 'infrad/lib/form'

import { STRATEGY_TYPE } from 'constants/deployment'
import { HEALTH_CHECK_TYPE } from 'constants/application'
import { START_WITH_LOWER_ALPHA, ONLY_LOWER_ALPHA_NUMERIC, formRuleMessage } from 'helpers/validate'

import { StyledForm } from 'common-styles/form'
import { FormWrapper, StyledItem as Item } from './style'

const formItemLayout = {
  labelCol: {
    span: 24
  },
  wrapperCol: {
    span: 24
  }
}

const initialValues = {
  name: '',
  strategyType: {
    type: STRATEGY_TYPE.RollingUpdate,
    value: {
      maxSurge: '25%',
      maxUnavailable: '0'
    }
  },
  healthCheck: {
    readinessProbe: {
      type: HEALTH_CHECK_TYPE.HTTP,
      initialDelaySeconds: 15,
      periodSeconds: 5,
      successThreshold: 1,
      timeoutSeconds: 5
    },
    livenessProbe: {
      initialDelaySeconds: 15,
      periodSeconds: 5,
      successThreshold: 1,
      timeoutSeconds: 5
    }
  }
}

interface IProps {
  onFieldsChange: (isError: boolean) => void
  form: FormInstance
}

const ApplicationForm: React.FC<IProps> = ({ form, onFieldsChange }) => {
  const { resetFields, getFieldsError } = form

  React.useEffect(() => {
    resetFields()
  }, [resetFields])

  const getIsError = () => {
    const errors = getFieldsError()
    return errors.filter(error => error.errors.length > 0).length > 0
  }

  const handleFieldsChange = () => {
    const isError = getIsError()
    onFieldsChange && onFieldsChange(isError)
  }

  return (
    <FormWrapper>
      <StyledForm
        {...formItemLayout}
        form={form}
        labelAlign='left'
        colon={false}
        initialValues={initialValues}
        onFieldsChange={handleFieldsChange}
      >
        <Item
          label='Name'
          name='appName'
          rules={[
            { required: true, message: 'Please input application name' },
            {
              pattern: START_WITH_LOWER_ALPHA,
              message: formRuleMessage.START_WITH_LOWER_ALPHA
            },
            {
              pattern: ONLY_LOWER_ALPHA_NUMERIC,
              message: formRuleMessage.ONLY_LOWER_ALPHA_NUMERIC
            },
            {
              max: 31,
              message: formRuleMessage.MAX_LENGTH_31
            },
            {
              min: 2,
              message: formRuleMessage.MIN_LENGTH
            }
          ]}
        >
          <Input placeholder='Can only contain lowercase alphanumeric(a-z0-9).' />
        </Item>
      </StyledForm>
    </FormWrapper>
  )
}

export default ApplicationForm
