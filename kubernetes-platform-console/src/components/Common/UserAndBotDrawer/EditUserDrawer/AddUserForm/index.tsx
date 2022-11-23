import React, { useEffect } from 'react'
import { StyledForm } from 'common-styles/form'
import { Select, Radio, Input } from 'infrad'

import { AddUserType, PERMISSION_GROUP } from 'constants/rbacActions'

const { Item } = StyledForm
const { Option } = Select
const { TextArea } = Input

interface IUser {
  name: string
  id: number
  email: string
  roleId: number
  detail?: string
}

interface IAccessRequestForm {
  form: any
  permissionGroups: any[]
  selectedUser: IUser
  clickedUserType: AddUserType
  permissionItem?: React.ReactNode
}

const botNameRegexp = /^([A-Za-z0-9\s]|_|-)+$/
const botNameStartEndRegexp = /^[a-zA-Z0-9].*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/
const botPasswordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*_)([A-Za-z0-9]|_)+$/

const AddUserForm: React.FC<IAccessRequestForm> = ({
  form,
  permissionGroups,
  selectedUser,
  clickedUserType,
  permissionItem
}) => {
  const { name, email, roleId, detail } = selectedUser || {}

  useEffect(() => {
    form.setFieldsValue({
      type: clickedUserType,
      name,
      email,
      roleId,
      detail
    })
  }, [clickedUserType, form, name, email, roleId, detail])

  const trimInput = ({ target }) => {
    const { id, value } = target
    form.setFieldsValue({ [id]: value.trim() })
    form.validateFields([id])
  }

  const HumanItems = (
    <Item name='email' label='Email' rules={[{ required: true }]} initialValue={email}>
      <Input disabled></Input>
    </Item>
  )

  const BotItems = (
    <>
      <Item
        name='name'
        label='Name'
        initialValue={name}
        rules={[
          { required: true, message: 'Name is required.' },
          { min: 2, message: 'Must be more than 1 character.' },
          { max: 32, message: 'Must be no more than 32 characters.' },
          {
            pattern: botNameStartEndRegexp,
            message: 'Must start and end with alphanumeric(A-Za-z0-9).',
            validateFirst: true
          },
          { pattern: botNameRegexp, message: 'Can only contain alphanumeric(A-Za-z0-9), \'_\' and \'-\'.' }
        ]}
      >
        <Input placeholder='Can only contain alphanumeric(A-Za-z0-9), "_" and "-".' onBlur={trimInput} />
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
    </>
  )

  const itemsMap = {
    [AddUserType.HUMAN]: HumanItems,
    [AddUserType.BOT]: BotItems
  }

  return (
    <StyledForm form={form} layout='vertical'>
      <Item name='type' label='User Type' rules={[{ required: true }]}>
        <Radio.Group disabled>
          <Radio value={AddUserType.HUMAN}>{AddUserType.HUMAN}</Radio>
          <Radio value={AddUserType.BOT}>{AddUserType.BOT}</Radio>
        </Radio.Group>
      </Item>
      {itemsMap[clickedUserType]}
      {permissionItem || (
        <Item
          name='roleId'
          label='Permission Group'
          rules={[{ required: true, message: 'Permission Group is required.' }]}
        >
          <Select placeholder='Please select a permission group'>
            {permissionGroups
              .filter(permissionGroup => permissionGroup.name !== PERMISSION_GROUP.PLATFORM_ADMIN)
              .map(permissionGroup => {
                const { id, name } = permissionGroup
                return (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                )
              })}
          </Select>
        </Item>
      )}
      {clickedUserType === AddUserType.BOT && (
        <Item
          name='detail'
          label='Description'
          rules={[
            { required: true, message: 'Description is required.' },
            { max: 1024, message: 'Must be no more than 1024 characters.' }
          ]}
        >
          <TextArea rows={4} placeholder='Please input' onBlur={trimInput} />
        </Item>
      )}
    </StyledForm>
  )
}

export default AddUserForm
