import * as React from 'react'
import { Input, Select } from 'infrad'
import { FormProps } from 'infrad/lib/form'

import { STRATEGY_TYPE } from 'constants/deployment'
import { INTEGER_NUMBER_OR_PERCENTAGE, formRuleMessage } from 'helpers/validate'

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

const isZero = value => value !== '' && (Number(value) === 0 || value === '0%')

const StrategySelect: React.FC<FormProps> = ({ form }) => {
  const [type, setType] = React.useState<any>(STRATEGY_TYPE.RollingUpdate)

  const rules = [
    {
      required: true,
      message: 'required!'
    },
    {
      pattern: INTEGER_NUMBER_OR_PERCENTAGE,
      message: formRuleMessage.INTEGER_NUMBER_OR_PERCENTAGE
    },
    ({ getFieldValue }) => ({
      validator (rule, value) {
        const maxSurge = getFieldValue(['strategyType', 'value', 'maxSurge'])
        const maxUnavailable = getFieldValue(['strategyType', 'value', 'maxUnavailable'])
        if (isZero(maxSurge) && isZero(maxUnavailable)) {
          return Promise.reject(new Error('MaxSurge and MaxUnavailable cannot both be 0'))
        }

        if (maxSurge !== undefined && INTEGER_NUMBER_OR_PERCENTAGE.test(maxSurge)) {
          form.setFields([
            {
              name: ['strategyType', 'value', 'maxSurge'],
              errors: []
            }
          ])
        }

        if (maxUnavailable !== undefined && INTEGER_NUMBER_OR_PERCENTAGE.test(maxUnavailable)) {
          form.setFields([
            {
              name: ['strategyType', 'value', 'maxUnavailable'],
              errors: []
            }
          ])
        }

        return Promise.resolve()
      }
    })
  ]

  return (
    <>
      <Item
        label='Strategy Type'
        name={['strategyType', 'type']}
        rules={[{ required: true, message: 'Please select strategy type' }]}
      >
        <Select onChange={value => setType(value)}>
          {Object.values(STRATEGY_TYPE).map((item: any) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      </Item>
      {type === STRATEGY_TYPE.RollingUpdate && (
        <>
          <GroupWrap>
            <StyledGroupItem
              label='MaxSurge'
              name={['strategyType', 'value', 'maxSurge']}
              rules={rules}
              {...formItemLayout}
            >
              <Input placeholder='input number or percentage' />
            </StyledGroupItem>
            <StyledGroupItem
              label='MaxUnavailable'
              name={['strategyType', 'value', 'maxUnavailable']}
              rules={rules}
              {...formItemLayout}
            >
              <Input placeholder='input number or percentage' />
            </StyledGroupItem>
          </GroupWrap>
          <span style={{ fontSize: '12px', color: '#999' }}>MaxSurge and MaxUnavailable cannot both be 0.</span>
        </>
      )}
      <VerticalDivider size='28px' />
    </>
  )
}

export default StrategySelect
