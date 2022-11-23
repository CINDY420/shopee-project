import React, { useEffect } from 'react'

import { StyledForm } from 'common-styles/form'
import { Input } from 'infrad'

const { Item } = StyledForm

interface IUser {
  name: string
  id: number
  roleId: number
  detail?: string
}

interface ISessionKeyForm {
  form: any
  selectedUser: IUser
}

const botPasswordRegexp = /^([A-Za-z0-9]|_)+$/

const SessionKeyForm: React.FC<ISessionKeyForm> = ({ form, selectedUser }) => {
  const { name } = selectedUser || {}

  useEffect(() => {
    form.setFieldsValue({
      name
    })
  }, [form, name])

  return (
    <StyledForm form={form} layout='vertical'>
      <Item name='name' label='User Name' rules={[{ required: true }]} initialValue={name}>
        <Input disabled></Input>
      </Item>
      <Item
        name='password'
        label='Password'
        rules={[
          { required: true, message: 'Password is required.' },
          { min: 8, message: 'Must be more than or equal to 8 characters.' },
          { max: 16, message: 'Must be no more than 16 characters.' },
          {
            pattern: botPasswordRegexp,
            message: 'Use 8-16 characters with a mix of alphanumerics(a-zA-Z0-9) & underscores(_)'
          }
        ]}
      >
        <Input.Password placeholder='8-16 characters with a mix of alphanumerics(a-zA-Z0-9) & underscores(_)' />
      </Item>
    </StyledForm>
  )
}

export default SessionKeyForm
