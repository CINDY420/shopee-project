import React, { useEffect, useState } from 'react'
import { StyledForm } from 'common-styles/form'
import { Select, Radio, Input, Button } from 'infrad'
import { SwapOutlined } from 'infra-design-icons'

import { AddUserType, UserType } from 'constants/rbacActions'
import { PLATFORM_ADMIN_ID } from 'constants/accessControl'
import { IRole } from 'api/types/application/group'

import { StyledWrapper, StyledLabel } from './style'

import EmailInput from './EmailInput'

const { Item } = StyledForm
const { Option } = Select
const { TextArea } = Input

interface IAccessRequestForm {
  form: any
  permissionGroups: IRole[]
  selectedUserType: UserType
  permissionItem?: React.ReactNode
}

const botNameRegexp = /^([A-Za-z0-9\s]|_|-)+$/
const botNameStartEndRegexp = /^[a-zA-Z0-9].*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/
const botPasswordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*_)([A-Za-z0-9]|_)+$/

const selectedAddType = {
  [UserType.USER]: AddUserType.HUMAN,
  [UserType.BOT]: AddUserType.BOT
}

const AddUserForm: React.FC<IAccessRequestForm> = ({ form, permissionGroups, selectedUserType, permissionItem }) => {
  const [selectedType, setSelectedType] = useState<AddUserType>(AddUserType.HUMAN)
  const [isEmailInputInOrder, setEmailInputType] = useState<boolean>(true)

  useEffect(() => {
    form.setFieldsValue({
      type: selectedAddType[selectedUserType]
    })
    setSelectedType(selectedAddType[selectedUserType])
  }, [selectedUserType, form])

  const handleTypeChange = e => {
    setSelectedType(e.target.value)
  }

  const handleEmailInputTypeChange = async () => {
    const emails = form.getFieldValue('emails')
    // make sure batched input emails without undefined
    let validEmails = emails.filter(email => !!email)
    // make sure ordered input emails are valid before switching to batch input
    if (validEmails.length) {
      await form.validateFields()
    }
    // make sure ordered input emails with 3 default items
    if (validEmails.length === 0 && !isEmailInputInOrder) {
      validEmails = [undefined]
    }

    form.setFieldsValue({ emails: validEmails })
    setEmailInputType(value => !value)
  }

  const trimInput = ({ target }) => {
    const { id, value } = target
    form.setFieldsValue({ [id]: value.trim() })
    form.validateFields([id])
  }

  const HumanItems = (
    <Item>
      <StyledWrapper>
        <StyledLabel>
          <span style={{ color: '#EE4D2D' }}>*</span> Email
        </StyledLabel>
        <Button icon={<SwapOutlined />} type='link' onClick={handleEmailInputTypeChange}>
          {isEmailInputInOrder ? 'Batch Input' : 'Input in Order'}
        </Button>
      </StyledWrapper>
      <EmailInput isEmailInputInOrder={isEmailInputInOrder} form={form} />
    </Item>
  )

  const BotItems = (
    <>
      <Item
        name='name'
        label='Name'
        rules={[
          { required: true, message: 'Name is required.' },
          { min: 2, message: 'Must be more than 1 character.' },
          { max: 32, message: 'Must be no more than 32 characters.' },
          {
            pattern: botNameStartEndRegexp,
            message: 'Must start and end with alphanumeric(A-Za-z0-9).',
            validateFirst: true
          },
          { pattern: botNameRegexp, message: 'Can only contain alphanumeric(A-Za-z0-9), "_" and "-".' }
        ]}
      >
        <Input placeholder='Can only contain alphanumeric(A-Za-z0-9), space, "_" and "-".' onBlur={trimInput} />
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
        <Radio.Group onChange={handleTypeChange}>
          <Radio value={AddUserType.HUMAN}>{AddUserType.HUMAN}</Radio>
          <Radio value={AddUserType.BOT}>{AddUserType.BOT}</Radio>
        </Radio.Group>
      </Item>
      {itemsMap[selectedType]}
      {permissionItem || (
        <Item
          name='roleId'
          label='Permission Group'
          rules={[{ required: true, message: 'Permission Group is required.' }]}
        >
          <Select placeholder='Please select a permission group'>
            {permissionGroups
              .filter(permissionGroup => permissionGroup.id !== PLATFORM_ADMIN_ID)
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
      {selectedType === AddUserType.BOT && (
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
