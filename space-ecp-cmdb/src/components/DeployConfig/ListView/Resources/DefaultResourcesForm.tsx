import React from 'react'

import { Form, Select } from 'infrad'
import {
  StyledFormItem,
  StyledExtraMessage,
  StyledAutoDisabledInput,
} from 'src/components/DeployConfig/ListView/Resources/style'
import { get } from 'lodash'
import {
  AutoDisabledInput,
  AutoDisabledSelect,
} from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { HorizonCenterWrapper } from 'src/common-styles/flexWrapper'

interface IDefaultResourcesFormProps {
  namePath: string[]
  isEditing: boolean
}

const POSITIVE_NUMBER_VALIDATE_MESSAGE = 'Please enter a positive integer'
const POSITIVE_NUMBER_VALIDATE = [
  { required: true, message: POSITIVE_NUMBER_VALIDATE_MESSAGE },
  { pattern: /^[1-9]\d*$/, message: POSITIVE_NUMBER_VALIDATE_MESSAGE },
]
const NON_NAVIGATIVE_NUMBER_VALIDATE_MESSAGE = 'Please enter a non-negative integer.'
const NON_NAVIGATIVE_NUMBER_VALIDATE = (isRequired: boolean) => [
  { required: isRequired, message: NON_NAVIGATIVE_NUMBER_VALIDATE_MESSAGE },
  { pattern: /^\d+$/, message: NON_NAVIGATIVE_NUMBER_VALIDATE_MESSAGE },
]

export enum UNIT {
  MB = 'MB',
  GB = 'GB',
}

const DefaultResourcesForm: React.FC<IDefaultResourcesFormProps> = ({ namePath, isEditing }) => {
  const normalizeStringNumber = (value: string) => {
    if (value.length) {
      const numberValue = Number(value)
      return isNaN(numberValue) ? value : numberValue
    }
    return value
  }

  return (
    <>
      <StyledFormItem
        name={namePath.concat('cpu')}
        label="CPU"
        rules={POSITIVE_NUMBER_VALIDATE}
        normalize={normalizeStringNumber}
      >
        <AutoDisabledInput style={{ width: 120 }} />
      </StyledFormItem>
      <StyledFormItem label="GPU">
        <Form.Item
          validateFirst
          name={namePath.concat('gpu')}
          noStyle
          rules={NON_NAVIGATIVE_NUMBER_VALIDATE(false)}
          normalize={normalizeStringNumber}
        >
          <AutoDisabledInput suffix={UNIT.GB} style={{ width: 160 }} />
        </Form.Item>
        <Form.Item noStyle>
          <StyledExtraMessage>Leave GPU empty if this service doesnt use GPU</StyledExtraMessage>
        </Form.Item>
      </StyledFormItem>
      <StyledFormItem label="Mem">
        <Form.Item
          name={namePath.concat('mem')}
          validateFirst
          noStyle
          rules={NON_NAVIGATIVE_NUMBER_VALIDATE(true)}
          normalize={normalizeStringNumber}
        >
          <StyledAutoDisabledInput
            $isEditing={isEditing}
            addonAfter={
              <StyledFormItem name={namePath.concat('mem_unit')} initialValue={UNIT.GB} noStyle>
                <AutoDisabledSelect style={{ width: '70px' }}>
                  {Object.values(UNIT).map((unit) => (
                    <Select.Option value={unit} key={unit}>
                      {unit}
                    </Select.Option>
                  ))}
                </AutoDisabledSelect>
              </StyledFormItem>
            }
            style={{ width: 170 }}
          />
        </Form.Item>
      </StyledFormItem>
      <StyledFormItem label="Shared Mem">
        <HorizonCenterWrapper>
          <Form.Item
            name={namePath.concat('shared_mem')}
            validateFirst
            noStyle
            dependencies={[
              namePath.concat('mem'),
              namePath.concat('mem_unit'),
              namePath.concat('shared_mem_unit'),
            ]}
            rules={[
              { pattern: /^\d+$/, message: NON_NAVIGATIVE_NUMBER_VALIDATE_MESSAGE },
              ({ getFieldValue }) => {
                const mem = getFieldValue(namePath.concat('mem'))
                const memUnit = getFieldValue(namePath.concat('mem_unit'))
                const sharedMem = getFieldValue(namePath.concat('shared_mem'))
                const sharedMemUnit = getFieldValue(namePath.concat('shared_mem_unit'))
                return {
                  validator: () => {
                    const isValid =
                      Number(sharedMemUnit === UNIT.MB ? sharedMem : sharedMem * 1024) <=
                      Number(memUnit === UNIT.MB ? mem : mem * 1024)
                    if (!sharedMem || isValid) {
                      return Promise.resolve()
                    }
                    return Promise.reject()
                  },
                  message: 'Must be less than Mem',
                }
              },
            ]}
            normalize={normalizeStringNumber}
          >
            <StyledAutoDisabledInput
              $isEditing={isEditing}
              addonAfter={
                <StyledFormItem
                  name={namePath.concat('shared_mem_unit')}
                  initialValue={UNIT.GB}
                  noStyle
                >
                  <AutoDisabledSelect style={{ width: '70px' }}>
                    {Object.values(UNIT).map((unit) => (
                      <Select.Option value={unit} key={unit}>
                        {unit}
                      </Select.Option>
                    ))}
                  </AutoDisabledSelect>
                </StyledFormItem>
              }
              style={{ width: 170 }}
            />
          </Form.Item>
          <Form.Item noStyle>
            <StyledExtraMessage>
              Leave Shared Mem empty if this service doesn&lsquo;t use Shared Memory.
            </StyledExtraMessage>
          </Form.Item>
        </HorizonCenterWrapper>
      </StyledFormItem>
      <StyledFormItem label="Disk">
        <Form.Item
          name={namePath.concat('disk')}
          noStyle
          rules={NON_NAVIGATIVE_NUMBER_VALIDATE(false)}
          normalize={normalizeStringNumber}
        >
          <AutoDisabledInput suffix={UNIT.GB} style={{ width: 160 }} />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            get(prevValues, namePath.concat('disk')) !== get(curValues, namePath.concat('disk'))
          }
        >
          {({ getFieldValue }) => {
            const diskValue = getFieldValue(namePath.concat('disk'))
            return diskValue === 0 ? (
              <StyledExtraMessage>Do note: Value 0 stands for unlimited</StyledExtraMessage>
            ) : (
              <StyledExtraMessage>
                Leave Disk empty if this service doesnt use Disk.
              </StyledExtraMessage>
            )
          }}
        </Form.Item>
      </StyledFormItem>
    </>
  )
}

export default DefaultResourcesForm
