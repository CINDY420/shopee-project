import React, { useEffect, useState } from 'react'
import { FormInstance } from 'infrad/lib/form'

import { pipelinesControllerGetAllPipelineEngines } from 'swagger-api/v3/apis/Pipelines'

import { StyledForm } from 'common-styles/form'
import { Input, Select } from 'infrad'
import { IEngine } from 'api/types/application/pipeline'

const { Item } = StyledForm

interface IMigratePipelineForm {
  form: FormInstance
  tenantId: number
  pipelineName: string
  engine: string
  onFieldsChange: (disabled: boolean) => void
}

const MigratePipelineForm: React.FC<IMigratePipelineForm> = ({
  form,
  tenantId,
  pipelineName,
  engine,
  onFieldsChange
}) => {
  const [engines, setEngines] = useState<IEngine[]>([])

  const getEnginesFn = async () => {
    const engines = await pipelinesControllerGetAllPipelineEngines({ tenantId })
    setEngines(engines)
  }

  useEffect(() => {
    getEnginesFn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId])

  const getIsError = () => {
    const errors = form.getFieldsError()
    return errors.filter(error => error.errors.length > 0).length > 0
  }

  const getIsRequiredNotEmpty = (values: any) => {
    const { destEngine } = values

    return destEngine
  }

  const handleFieldsChange = () => {
    const values = form.getFieldsValue()
    const isError = getIsError()
    const isRequiredFieldsNotEmpty = getIsRequiredNotEmpty(values)
    onFieldsChange && onFieldsChange(isError || !isRequiredFieldsNotEmpty)
  }

  useEffect(() => {
    form.setFieldsValue({ pipelineName })
  }, [form, pipelineName])

  return (
    <StyledForm form={form} layout='vertical' onFieldsChange={handleFieldsChange}>
      <Item name='pipelineName' label='Name' rules={[{ required: true, message: 'Name is required.' }]}>
        <Input disabled={true} value={pipelineName} />
      </Item>
      <Item
        name='destEngine'
        label='Target Engine'
        rules={[{ required: true, message: 'Please select the target engine' }]}
      >
        <Select placeholder='Please select.'>
          {engines.map(item => (
            <Select.Option key={item.name} value={item.name} disabled={item.name === engine}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Item>
    </StyledForm>
  )
}

export default MigratePipelineForm
