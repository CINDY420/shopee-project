import React, { useEffect } from 'react'

import { ITenant } from 'api/types/tenant/tenant'

import { StyledForm } from 'common-styles/form'
import { Input } from 'infrad'

const { Item } = StyledForm
// const { Option } = Select

interface IAccessRequestForm {
  form: any
  selectedTenant: ITenant
  // envsList: string[]
  // cidsList: string[]
  // clustersList: string[]
}

const tenantNameRegexp = /^([a-zA-Z0-9\s]|-)+$/

const TenantForm: React.FC<IAccessRequestForm> = ({ form, selectedTenant }) => {
  const { name } = selectedTenant || {}
  // const envs = [], cids = [], clusters = []

  useEffect(() => {
    form.setFieldsValue({
      name
      // envs,
      // cids,
      // clusters
    })
  }, [form, name])

  // const handleSelectAll = (value, options) => {
  //   if (value && value.length && value.includes('all')) {
  //     if (value.length === options.length + 1) {
  //       return []
  //     }
  //     return options
  //   }
  //   return value
  // }

  return (
    <StyledForm form={form} layout='vertical'>
      <Item
        name='name'
        label='Tenant Name'
        rules={[
          { required: true, message: 'Please input tenant name.' },
          { min: 1, message: 'Must be more than or equal to 1 character.' },
          { max: 32, message: 'Must be less than or equal to 32 characters.' },
          { pattern: tenantNameRegexp, message: 'Can only contain alphanumeric(A-Za-z0-9), space and "-".' }
        ]}
      >
        <Input placeholder='Can only contain alphanumeric(A-Za-z0-9), space and "-".' />
      </Item>
      {/* <Item
        name='envs'
        label='ENV'
        // rules={[{ required: true, message: 'Please choose ENV.' }]}
        getValueFromEvent={val => handleSelectAll(val, envsList)}
      >
        <Select mode='tags' placeholder='Please choose ENV'>
          <Option key='all' value='all'>
            Select All
          </Option>
          {envsList.map(env => {
            return (
              <Option key={env} value={env}>
                {env}
              </Option>
            )
          })}
        </Select>
      </Item>
      <Item
        name='cids'
        label='CID'
        // rules={[{ required: true, message: 'Please choose CID.' }]}
        getValueFromEvent={val => handleSelectAll(val, cidsList)}
      >
        <Select mode='tags' placeholder='Please choose CID'>
          <Option key='all' value='all'>
            Select All
          </Option>
          {cidsList.map(cid => {
            return (
              <Option key={cid} value={cid}>
                {cid}
              </Option>
            )
          })}
        </Select>
      </Item>
      <Item
        name='clusters'
        label='Cluster'
        // rules={[{ required: true, message: 'Please choose Cluster.' }]}
        getValueFromEvent={val => handleSelectAll(val, clustersList)}
      >
        <Select mode='tags' placeholder='Please choose Cluster'>
          <Option key='all' value='all'>
            Select All
          </Option>
          {clustersList.map(cluster => {
            return (
              <Option key={cluster} value={cluster}>
                {cluster}
              </Option>
            )
          })}
        </Select>
      </Item> */}
    </StyledForm>
  )
}

export default TenantForm
