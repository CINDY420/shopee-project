import React from 'react'
import { ITenant } from 'api/types/application/group'

import { useRecoilValue } from 'recoil'
import { selectedProject } from 'states/applicationState/project'

import { StyledForm } from 'common-styles/form'
import { Select } from 'infrad'
import { OptionName, OptionId } from './style'

const { Item } = StyledForm
const { Option } = Select

interface IMoveForm {
  form: any
  tenants: ITenant[]
}

const MoveForm: React.FC<IMoveForm> = ({ form, tenants }) => {
  const project = useRecoilValue(selectedProject)
  const { tenantId } = project || {}

  return (
    <StyledForm form={form} layout='vertical'>
      <Item
        name='tenantId'
        label='Move Project to Tenant'
        rules={[{ required: true, message: 'Please select the target tenant' }]}
      >
        <Select placeholder='Please select the target tenant' showArrow>
          {tenants.map(tenant => {
            const { name, id } = tenant
            return (
              <Option key={id} value={id} disabled={id.toString() === tenantId}>
                <OptionName disabled={id.toString() === tenantId}>{name}</OptionName>
                <OptionId>ID: {id}</OptionId>
              </Option>
            )
          })}
        </Select>
      </Item>
    </StyledForm>
  )
}

export default MoveForm
