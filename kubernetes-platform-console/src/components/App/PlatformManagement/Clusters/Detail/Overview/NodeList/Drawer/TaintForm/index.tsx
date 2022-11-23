import * as React from 'react'
import { Radio, Input, Select } from 'infrad'
import { FormInstance } from 'infrad/lib/form'

import { StyledForm } from 'common-styles/form'

import { throttle } from 'helpers/functionUtils'
import { START_WITH_ALPHA_NUMERIC, CLUSTER_TAINT_WORD, CLUSTER_TAINT_KEY, formRuleMessage } from 'helpers/validate'

const { Option } = Select

const EFFECTS = ['NoSchedule', 'PreferNoSchedule', 'NoExecute']

const genTaintRules = (maxLength: number, isKey: boolean) => {
  const pattern = isKey
    ? {
        pattern: CLUSTER_TAINT_KEY,
        message: formRuleMessage.CLUSTER_TAINT_KEY
      }
    : {
        pattern: CLUSTER_TAINT_WORD,
        message: formRuleMessage.CLUSTER_TAINT_WORD
      }
  return [
    {
      max: maxLength,
      message: formRuleMessage.maxLength(maxLength)
    },
    {
      pattern: START_WITH_ALPHA_NUMERIC,
      message: formRuleMessage.START_WITH_ALPHA_NUMERIC
    },
    pattern
  ]
}

const EFFECT_RULE = {
  required: true,
  message: 'Please select an effect'
}

interface ITaintFormProps {
  form: FormInstance
  setFormResult: (formResult: any) => void
}

const TaintForm: React.FC<ITaintFormProps> = props => {
  const { form, setFormResult } = props
  const [effectRules, setEffectRules] = React.useState([])

  const formatAndSetResult = result => {
    const draft = { action: null, taint: {} }
    if (result.action) {
      draft.action = result.action
    }
    for (const key in result) {
      if (key !== 'action') {
        draft.taint[key] = result[key]
      }
    }
    setFormResult(draft)
  }

  const handleValuesChange = (changedValues, allValues) => {
    const callback = throttle(500, formatAndSetResult)
    callback(allValues)
    changeEffectRules(allValues.action)
  }

  const changeEffectRules = action => {
    switch (action) {
      case 'update':
        setEffectRules([EFFECT_RULE])
        break
      default:
        setEffectRules([])
        break
    }
  }

  return (
    <StyledForm layout='vertical' form={form} onValuesChange={handleValuesChange}>
      <StyledForm.Item
        name='action'
        label='Action'
        rules={[
          {
            required: true,
            message: 'Please select an action'
          }
        ]}
      >
        <Radio.Group>
          <Radio value='update'>Update</Radio>
          <Radio value='remove'>Remove</Radio>
        </Radio.Group>
      </StyledForm.Item>
      <StyledForm.Item>
        <StyledForm.Item
          name='key'
          label='Key'
          rules={[
            {
              required: true,
              message: 'Please input a key'
            },
            ...genTaintRules(253, true)
          ]}
        >
          <Input.TextArea placeholder={formRuleMessage.CLUSTER_TAINT_KEY} autoSize={true} className='none-resize' />
        </StyledForm.Item>
        <StyledForm.Item name='value' label='Value' rules={[...genTaintRules(63, false)]}>
          <Input.TextArea placeholder={formRuleMessage.CLUSTER_TAINT_WORD} autoSize={true} className='none-resize' />
        </StyledForm.Item>
        <StyledForm.Item name='effect' label='Effect' rules={effectRules}>
          <Select placeholder='Select'>
            {EFFECTS.map(effect => (
              <Option value={effect} key={effect}>
                {effect}
              </Option>
            ))}
          </Select>
        </StyledForm.Item>
      </StyledForm.Item>
    </StyledForm>
  )
}

export default TaintForm
