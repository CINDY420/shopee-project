import React from 'react'
import { FormInstance } from 'infrad/lib/form'

import { ITenant } from 'api/types/application/group'

import { StyledForm } from 'common-styles/form'
import { OptionName, OptionId, StyledSelect } from './style'

const { Item } = StyledForm
const { Option } = StyledSelect

interface IMovePipelineForm {
  form: FormInstance
  tenants: ITenant[]
  tenantId: number
  onFieldsChange: (disabled: boolean) => void
}

const MovePipelineForm: React.FC<IMovePipelineForm> = ({ form, tenants, tenantId, onFieldsChange }) => {
  const getIsError = () => {
    const errors = form.getFieldsError()
    return errors.filter(error => error.errors.length > 0).length > 0
  }

  const getIsRequiredNotEmpty = (values: any) => {
    const { targetTenantId } = values

    return targetTenantId
  }

  const handleFieldsChange = () => {
    const values = form.getFieldsValue()
    const isError = getIsError()
    const isRequiredFieldsNotEmpty = getIsRequiredNotEmpty(values)
    onFieldsChange && onFieldsChange(isError || !isRequiredFieldsNotEmpty)
  }

  return (
    <StyledForm form={form} layout='vertical' onFieldsChange={handleFieldsChange}>
      <Item
        name='targetTenantId'
        label='Move Pipeline To Tenant'
        rules={[{ required: true, message: 'Please select the target tenant' }]}
      >
        <StyledSelect placeholder='Please select the target tenant' showArrow>
          {tenants.map(tenant => {
            const { name, id } = tenant
            const disabled = id === tenantId
            return (
              <Option key={id} value={id} disabled={disabled}>
                <OptionName disabled={disabled}>{name}</OptionName>
                <OptionId>ID: {id}</OptionId>
              </Option>
            )
          })}
        </StyledSelect>
      </Item>
    </StyledForm>
  )
}

export default MovePipelineForm
