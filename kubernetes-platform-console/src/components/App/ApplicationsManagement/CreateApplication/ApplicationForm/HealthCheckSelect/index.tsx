import * as React from 'react'
import { Input, Select } from 'infrad'
import { FormProps } from 'infrad/lib/form'

import { HEALTH_CHECK_TYPE, HEALTH_CHECK_TYPE_TEXT } from 'constants/application'
import { StyledItem as Item, GroupWrap, StyledGroupItem } from '../style'
import { VerticalDivider } from 'common-styles/divider'

const { Option } = Select

const formItemLayout = {
  labelCol: {
    span: 8,
    offset: 0
  },
  wrapperCol: {
    span: 12,
    offset: 0
  },
  labelAlign: 'right' as 'right' | 'left'
}

interface IProps extends FormProps {
  keyName?: string
  probe: any
}

const HealthCheckSelect: React.FC<IProps> = ({ keyName = 'readinessProbe', probe, form }) => {
  const [healthCheckType, setHealthCheckType] = React.useState(probe.type)

  const requiredRules = healthCheckType ? [{ required: true, message: 'required!' }] : []

  const checkTypeRules = []
  if (healthCheckType === HEALTH_CHECK_TYPE.TCP) {
    checkTypeRules.push(() => ({
      validator (rule, value) {
        if (value < 1 || value > 65535) {
          return Promise.reject(new Error('1 ≤ port ≤ 65535'))
        }
        return Promise.resolve()
      }
    }))
  } else {
    checkTypeRules.push(
      {
        max: 128,
        message: 'Must be less than or equal to 128 characters'
      },
      {
        min: 1,
        message: 'Must be more than or equal to 1 character'
      }
    )
  }

  const secondsRules = [
    () => ({
      validator (rule, value) {
        if (value < 0 || value > 10000) {
          return Promise.reject(new Error('0 ≤ limit ≤ 10000'))
        }
        return Promise.resolve()
      }
    })
  ]

  const handleTypeChange = value => {
    setHealthCheckType(value)
    form.setFields([
      {
        name: ['healthCheck', keyName, 'typeValue'],
        value: undefined,
        errors: []
      }
    ])
  }

  return (
    <>
      <Item
        label={`Health Check Type${keyName === 'readinessProbe' ? '(Readiness)' : '(Liveness)'}`}
        name={['healthCheck', keyName, 'type']}
        rules={keyName === 'readinessProbe' ? [{ required: true, message: 'Please select health check type' }] : []}
      >
        <Select onChange={handleTypeChange} placeholder='Select' allowClear={keyName !== 'readinessProbe'}>
          {Object.values(HEALTH_CHECK_TYPE).map((item: any) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      </Item>
      {healthCheckType && (
        <GroupWrap>
          <StyledGroupItem
            label={HEALTH_CHECK_TYPE_TEXT[healthCheckType]}
            name={['healthCheck', keyName, 'typeValue']}
            rules={[...requiredRules, ...checkTypeRules]}
            {...formItemLayout}
          >
            <Input placeholder='Input' type={healthCheckType === HEALTH_CHECK_TYPE.TCP ? 'number' : 'string'} />
          </StyledGroupItem>
          <StyledGroupItem
            label='initialDelaySeconds'
            rules={[...requiredRules, ...secondsRules]}
            normalize={value => (value.length ? Number(value) : undefined)}
            name={['healthCheck', keyName, 'initialDelaySeconds']}
            {...formItemLayout}
          >
            <Input placeholder='Input' type='number' />
          </StyledGroupItem>
          <StyledGroupItem
            label='periodSeconds'
            rules={[...requiredRules, ...secondsRules]}
            normalize={value => (value.length ? Number(value) : undefined)}
            name={['healthCheck', keyName, 'periodSeconds']}
            {...formItemLayout}
          >
            <Input placeholder='Input' type='number' />
          </StyledGroupItem>
          <StyledGroupItem
            label='successThreshold'
            rules={[...requiredRules, ...secondsRules]}
            normalize={value => (value.length ? Number(value) : undefined)}
            name={['healthCheck', keyName, 'successThreshold']}
            {...formItemLayout}
          >
            <Input placeholder='Input' type='number' />
          </StyledGroupItem>
          <StyledGroupItem
            label='timeoutSeconds'
            rules={[...requiredRules, ...secondsRules]}
            normalize={value => (value.length ? Number(value) : undefined)}
            name={['healthCheck', keyName, 'timeoutSeconds']}
            {...formItemLayout}
          >
            <Input placeholder='Input' type='number' />
          </StyledGroupItem>
        </GroupWrap>
      )}
      <VerticalDivider size='28px' />
    </>
  )
}

export default HealthCheckSelect
