import React from 'react'

import { Col, Form, Row, Select } from 'infrad'
import {
  StyledFormItem,
  StyledExtraMessage
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Resources/style'
import { get } from 'lodash'
import {
  AutoDisabledInput,
  AutoDisabledSelect
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'

interface IDefaultResourcesFormProps {
  namePath: string[]
}

const POSITIVE_NUMBER_VALIDATE_MESSAGE = 'Please enter a positive integer'
const POSITIVE_NUMBER_VALIDATE = [
  { required: true, message: POSITIVE_NUMBER_VALIDATE_MESSAGE },
  { pattern: /^[1-9]\d*$/, message: POSITIVE_NUMBER_VALIDATE_MESSAGE }
]
const NON_NAVIGATIVE_NUMBER_VALIDATE_MESSAGE = 'Please enter a non-negative number'
const NON_NAVIGATIVE_NUMBER_VALIDATE = (isRequired: boolean) => [
  { required: isRequired, message: NON_NAVIGATIVE_NUMBER_VALIDATE_MESSAGE },
  { pattern: /^\d+$/, message: NON_NAVIGATIVE_NUMBER_VALIDATE_MESSAGE }
]

export const MEMORY_LIST = {
  1024: '1GB',
  2048: '2GB',
  4096: '4GB',
  8192: '8GB',
  16384: '16GB',
  32768: '32GB',
  65536: '64GB'
}

enum UNIT {
  MB = 'MB',
  GB = 'GB'
}

const DefaultResourcesForm: React.FC<IDefaultResourcesFormProps> = ({ namePath }) => {
  const normalizeStringNumber = (value: string) => {
    if (value.length) {
      const numberValue = Number(value)
      return isNaN(numberValue) ? value : numberValue
    } else {
      return value
    }
  }

  return (
    <>
      <StyledFormItem
        name={namePath.concat('cpu')}
        label='CPU'
        rules={POSITIVE_NUMBER_VALIDATE}
        normalize={normalizeStringNumber}
      >
        <AutoDisabledInput style={{ width: 120 }} />
      </StyledFormItem>
      <StyledFormItem label='GPU'>
        <Form.Item
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
      <StyledFormItem label='Mem'>
        <Row>
          <Col>
            <StyledFormItem name={namePath.concat('mem')} style={{ width: 160, marginRight: 16, marginBottom: 0 }}>
              <AutoDisabledSelect>
                {Object.entries(MEMORY_LIST).map(([key, value]) => (
                  <Select.Option value={Number(key)} key={key}>
                    {value}
                  </Select.Option>
                ))}
                <Select.Option value=''>Others</Select.Option>
              </AutoDisabledSelect>
            </StyledFormItem>
          </Col>
          <Col>
            <StyledFormItem
              noStyle
              shouldUpdate={(prevValue, curValue) =>
                get(prevValue, namePath.concat('mem')) !== get(curValue, namePath.concat('mem'))
              }
            >
              {({ getFieldValue }) => {
                const mem = getFieldValue(namePath.concat('mem'))
                return (
                  mem === '' && (
                    <Form.Item
                      name={namePath.concat('otherMemory')}
                      rules={POSITIVE_NUMBER_VALIDATE}
                      style={{ marginBottom: 0 }}
                      normalize={normalizeStringNumber}
                    >
                      <AutoDisabledInput suffix={UNIT.MB} style={{ width: 160 }} />
                    </Form.Item>
                  )
                )
              }}
            </StyledFormItem>
          </Col>
        </Row>
      </StyledFormItem>
      <StyledFormItem label='Disk'>
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
              <StyledExtraMessage>Leave Disk empty if this service doesnt use Disk.</StyledExtraMessage>
            )
          }}
        </Form.Item>
      </StyledFormItem>
    </>
  )
}

export default DefaultResourcesForm
