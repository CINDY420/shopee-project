import React, { useState, useCallback, useEffect } from 'react'
import { StyledTable, RequiredKey, InfoWrapper, LimitInput, StyledError } from './style'
import { Form, Select, InputNumber, Popover } from 'infrad'
import { InfoCircleFilled, IQuestionMark } from 'infra-design-icons'
import { PROFILE_OBJECT } from 'constants/deployment'
import { pprofControllerGetPprofObject } from 'swagger-api/v3/apis/Pprof'
import { FormInstance } from 'infrad/lib/form'

interface IProfilingSettingForm {
  form: FormInstance
  tenantId: number
  projectName: string
  appName: string
  deployName: string
  onChangeValidateState?: (message: string) => void
}

const PROFILING_PORT = [9088, 9090]

const TRACE_INFO = 'There will be no flame graph for this type of profile.'
const USAGE_LINIT_INFO = 'Please enter a positive number between 1 and 100.'

const ObjectInfo: React.FC<{ info: string }> = ({ info }) => (
  <InfoWrapper>
    <InfoCircleFilled style={{ color: '#2673DD' }} /> {info}
  </InfoWrapper>
)

const ProfilingSettingForm: React.FC<IProfilingSettingForm> = ({
  form,
  tenantId,
  projectName,
  appName,
  deployName,
  onChangeValidateState
}) => {
  const [selectedObject, setSelectedObject] = useState(PROFILE_OBJECT.CPU)
  const [objectList, setObjectList] = useState<string[]>([])
  const [validateState, setValidateState] = useState<string>(null)

  const isCpuObject = selectedObject === PROFILE_OBJECT.CPU

  const getObjectList = useCallback(async () => {
    const { data: objects } = await pprofControllerGetPprofObject({
      tenantId: tenantId + '',
      projectName,
      appName,
      deployName
    })
    setObjectList(objects || [])
  }, [appName, deployName, projectName, tenantId])

  useEffect(() => {
    getObjectList()
  }, [getObjectList])

  const updateValidateState = () => {
    setValidateState(USAGE_LINIT_INFO)
    onChangeValidateState && onChangeValidateState(USAGE_LINIT_INFO)
  }

  const usageLimitValidateFn = (anotherValue: number) => ({
    validator(_, value) {
      value = Number(value)
      if (!value || value > 100 || value < 1) {
        updateValidateState()
        return Promise.reject()
      } else if (!anotherValue || anotherValue > 100 || anotherValue < 1) {
        updateValidateState()
      } else {
        setValidateState(null)
        onChangeValidateState && onChangeValidateState(null)
      }
      return Promise.resolve()
    }
  })

  return (
    <StyledTable bordered={false}>
      <tbody>
        <tr>
          <td className='required-key'>
            <RequiredKey>Port</RequiredKey>
          </td>
          <td>
            <Form.Item
              name='port'
              rules={[
                {
                  required: true
                }
              ]}
              initialValue={9088}
            >
              <Select style={{ width: '160px' }}>
                {PROFILING_PORT.map(port => (
                  <Select.Option key={port} value={port}>
                    {port}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </td>
        </tr>
        <tr>
          <td className='required-key'>
            <RequiredKey>Sample Time (s)</RequiredKey>
          </td>
          <td>
            <Form.Item
              name='sampleTime'
              rules={[
                {
                  required: true,
                  type: 'integer',
                  min: 1,
                  max: isCpuObject ? 120 : undefined,
                  message: isCpuObject
                    ? 'Please enter a positive integer between 1 and 120.'
                    : 'must be a positive integer number!'
                }
              ]}
              initialValue={30}
            >
              <InputNumber style={{ width: '120px' }} />
            </Form.Item>
          </td>
        </tr>
        <tr>
          <td className='required-key'>
            <RequiredKey marginTop={selectedObject === PROFILE_OBJECT.TRACE ? '-44px' : '-24px'}>
              Object(For Golang Only)
            </RequiredKey>
          </td>
          <td>
            <Form.Item
              name='object'
              initialValue={PROFILE_OBJECT.CPU}
              rules={[{ required: true, message: 'required!' }]}
              style={{ width: '360px' }}
              extra={selectedObject === PROFILE_OBJECT.TRACE && <ObjectInfo info={TRACE_INFO} />}
            >
              <Select style={{ width: '240px' }} onSelect={object => setSelectedObject(object as PROFILE_OBJECT)}>
                {objectList.map(object => (
                  <Select.Option value={object} key={object}>
                    {object}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </td>
        </tr>
        <tr>
          <td className='required-key'>
            <RequiredKey>
              Resource Usage Limit
              <Popover content='When the resource usage exceeds the limited value, the pprof operation will be unavailable.'>
                <IQuestionMark style={{ color: '#B7B7B7', marginLeft: 5, cursor: 'pointer' }} />
              </Popover>
            </RequiredKey>
          </td>
          <td>
            <Form.Item
              label='CPU'
              name='cpuLimit'
              initialValue={80}
              colon={false}
              rules={[usageLimitValidateFn(Number(form.getFieldValue('memoryLimit')))]}
              style={{ display: 'inline-flex' }}
            >
              <LimitInput addonAfter='%' />
            </Form.Item>
            <Form.Item
              label='Memory'
              name='memoryLimit'
              initialValue={80}
              colon={false}
              rules={[usageLimitValidateFn(Number(form.getFieldValue('cpuLimit')))]}
              style={{ display: 'inline-flex', marginLeft: '24px' }}
            >
              <LimitInput addonAfter='%' />
            </Form.Item>
            {validateState && <StyledError>{validateState}</StyledError>}
          </td>
        </tr>
      </tbody>
    </StyledTable>
  )
}

export default ProfilingSettingForm
