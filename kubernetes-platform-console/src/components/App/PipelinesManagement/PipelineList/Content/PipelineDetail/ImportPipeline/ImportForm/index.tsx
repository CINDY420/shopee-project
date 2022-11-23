import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { selectedTenant } from 'states/applicationState/tenant'

import { StyledForm } from 'common-styles/form'
import NameInput from './NameInput'
import { Input, Radio, Button } from 'infrad'
import { FormInstance } from 'infrad/lib/form'
import { SwapOutlined } from 'infra-design-icons'
import { StyledWrapper, StyledLabel } from './style'

const { Item } = StyledForm

const DEFAULT_ENGINE = {
  SG_LIVE_JENKINS: 'Jenkins-SG-Live',
  SG_NONLIVE_JENKINS: 'Jenkins-SG-Nonlive'
}

interface IImportForm {
  form: FormInstance
  onFieldsChange: (disabled: boolean) => void
}

const ImportForm: React.FC<IImportForm> = ({ form, onFieldsChange }) => {
  const tenant = useRecoilValue(selectedTenant)
  const { name: tenantName } = tenant

  const [isBatchNameInput, setNameInputType] = useState<boolean>(true)

  useEffect(() => {
    form.setFieldsValue({
      tenantName
    })
  }, [form, tenantName])

  const getIsError = () => {
    const errors = form.getFieldsError()
    return errors.filter(error => error.errors.length > 0).length > 0
  }

  const getIsRequiredNotEmpty = (values: any) => {
    const { engine, project, names } = values

    return engine && project && names
  }

  const handleFieldsChange = () => {
    const values = form.getFieldsValue()
    const isError = getIsError()
    const isRequiredFieldsNotEmpty = getIsRequiredNotEmpty(values)
    onFieldsChange && onFieldsChange(isError || !isRequiredFieldsNotEmpty)
  }

  const handleNameInputTypeChange = async () => {
    const names = form.getFieldValue('names')

    let validNames = names ? names.filter(name => !!name) : []

    if (validNames.length === 0 && isBatchNameInput) {
      validNames = [undefined, undefined, undefined]
    }

    form.setFieldsValue({ names: validNames })
    setNameInputType(value => !value)
  }

  return (
    <StyledForm form={form} layout='vertical' onFieldsChange={handleFieldsChange}>
      <Item name='tenantName' label='Tenant' rules={[{ required: true, message: 'Tenant is required.' }]}>
        <Input disabled={true} />
      </Item>
      <Item name='engine' label='Engine' rules={[{ required: true, massage: 'Engine is required.' }]}>
        <Radio.Group>
          {Object.entries(DEFAULT_ENGINE).map(([keyName, label]) => (
            <Radio key={keyName} value={label}>
              {label}
            </Radio>
          ))}
        </Radio.Group>
      </Item>
      <Item
        name='project'
        label='Project'
        rules={[
          { required: true, message: 'Project is required.' },
          {
            pattern: /^[a-z]+/,
            message: 'Must start with lowercase alpha a-z.'
          },
          {
            pattern: /^[a-z0-9]+/,
            message: 'Can only contain lowercase alphanumeric(a-z0-9).'
          },
          {
            max: 31,
            message: 'Must be less than or equal to 31 characters.'
          },
          {
            min: 2,
            message: 'Must be more than 1 character.'
          }
        ]}
      >
        <Input placeholder='Input project name' />
      </Item>
      <Item>
        <StyledWrapper>
          <StyledLabel>
            <span style={{ color: '#EE4D2D' }}>*</span> Name
          </StyledLabel>
          <Button icon={<SwapOutlined />} type='link' onClick={handleNameInputTypeChange}>
            {isBatchNameInput ? 'Input in Order' : 'Batch Input'}
          </Button>
        </StyledWrapper>
        <NameInput isBatchNameInput={isBatchNameInput} form={form} />
      </Item>
    </StyledForm>
  )
}

export default ImportForm
