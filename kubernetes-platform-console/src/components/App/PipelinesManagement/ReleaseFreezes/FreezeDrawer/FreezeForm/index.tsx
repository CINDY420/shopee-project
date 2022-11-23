import React, { useEffect, useState, useCallback } from 'react'

import { IReleaseFreezeDetail } from 'api/types/application/pipeline'

import { StyledForm } from 'common-styles/form'
import { Input, DatePicker, Checkbox } from 'infrad'
import { StyledDiv, TextareaCount } from './style'
import { ClockCircleOutlined } from 'infra-design-icons'

import moment from 'moment'

const { Item } = StyledForm
const { RangePicker } = DatePicker
const { TextArea } = Input
const CheckboxGroup = Checkbox.Group

interface IFreezeForm {
  form: any
  selectedFreeze?: IReleaseFreezeDetail
  onFieldsChange: (disabled: boolean) => void
  visible: boolean
}

const FreezeForm: React.FC<IFreezeForm> = ({ form, selectedFreeze, onFieldsChange, visible }) => {
  const { env, reason, startTime, endTime } = selectedFreeze || {}
  const [count, setCount] = useState<number>(0)

  const envOptions = {
    liveEnv: 'Live',
    nonLiveEnv: 'Non-live'
  }

  useEffect(() => {
    form.setFieldsValue({
      env,
      timeSlot: startTime && endTime ? [moment(startTime), moment(endTime)] : undefined,
      reason
    })
    handleFieldsChange()
    setCount(reason ? reason.length : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, env, startTime, endTime, reason, visible])

  const handleReasonChange = useCallback(val => {
    setCount(val.length)
  }, [])

  const getIsError = () => {
    const errors = form.getFieldsError()
    return errors.filter(error => error.errors.length > 0).length > 0
  }

  const getIsRequiredNotEmpty = (values: any) => {
    const { env, timeSlot, reason } = values

    return env && timeSlot && reason
  }

  const disabledDate = current => {
    return current && current < moment().startOf('day')
  }

  const handleFieldsChange = () => {
    const values = form.getFieldsValue()
    const isError = getIsError()
    const isRequiredFieldsNotEmpty = getIsRequiredNotEmpty(values)
    onFieldsChange && onFieldsChange(isError || !isRequiredFieldsNotEmpty)
  }

  return (
    <StyledForm form={form} layout='vertical' onFieldsChange={handleFieldsChange}>
      <Item name='env' label='ENV' rules={[{ required: true, message: 'ENV is required.' }]}>
        <CheckboxGroup options={['Live', 'Non-live']} disabled={!!env}>
          {Object.entries(envOptions).map(([keyName, label]) => (
            <Checkbox key={keyName} value={keyName}>
              {label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Item>
      <Item name='timeSlot' label='Time Slot' rules={[{ required: true, message: 'Time Slot is required.' }]}>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format='YYYY-MM-DD HH:mm'
          disabledDate={disabledDate}
          style={{ width: '100%' }}
          suffixIcon={<ClockCircleOutlined />}
        />
      </Item>
      <StyledDiv>
        <Item
          name='reason'
          label='Reason'
          rules={[
            { required: true, message: 'Reason is required.' },
            { max: 128, message: 'Must be no more than 128 characters.' },
            { min: 2, message: 'Must be at least 2 characters.' }
          ]}
        >
          <TextArea autoSize={{ minRows: 4 }} onChange={event => handleReasonChange(event.target.value)} />
        </Item>
        <TextareaCount>{count}/128</TextareaCount>
      </StyledDiv>
    </StyledForm>
  )
}

export default FreezeForm
