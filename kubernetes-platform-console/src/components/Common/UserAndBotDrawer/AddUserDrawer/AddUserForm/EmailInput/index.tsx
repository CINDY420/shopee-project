import React from 'react'
import { PlusOutlined, ITrash } from 'infra-design-icons'
import { Form, Button, Input, Tag } from 'infrad'

import { ListContent, StyledWrapper, AddButton, StyledSelect } from './style'
interface IEmailInput {
  isEmailInputInOrder: boolean
  form: any
}

const { Item, List } = Form

const ShopeeAndSeaEmailRegExp = /.*(@(sea|shopee|seamoney).com)$/

const sameEmailsValidator = (_, values) => {
  const valueMap = {}
  values
    .filter(value => !!value)
    .forEach(value => {
      if (valueMap[value]) {
        valueMap[value]++
      } else {
        valueMap[value] = 1
      }
    })
  const sameEmails = Object.entries(valueMap).filter(([key, value]) => value > 1)
  if (!sameEmails.length) {
    return Promise.resolve()
  }
  const [email, count] = sameEmails[0]
  return Promise.reject(new Error(`${count} same emails: ${email}!`))
}

const tagRender = props => {
  const { label, value, closable, onClose } = props
  const onPreventMouseDown = event => {
    event.preventDefault()
    event.stopPropagation()
  }
  return (
    <Tag
      color={!ShopeeAndSeaEmailRegExp.test(value) ? 'red' : ''}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  )
}

const EmailInput: React.FC<IEmailInput> = ({ isEmailInputInOrder, form }) => {
  const trimInput = ({ target }, index) => {
    const fields = form.getFieldsValue()
    const { emails } = fields
    const { value } = target
    emails[index] = value.trim()
    form.setFieldsValue({ emails })
    form.validateFields([['emails', index]])
  }

  const trimInputChange = value => {
    const emails = value.map(email => email.trim())
    form.setFieldsValue({ emails: Array.from(new Set(emails)) })
    form.validateFields([['emails']])
  }

  return isEmailInputInOrder ? (
    <Item name='emails' initialValue={[undefined]} rules={[{ required: true }, { validator: sameEmailsValidator }]}>
      <List name='emails'>
        {(fields, { add, remove }) => {
          return (
            <ListContent>
              {fields.map((field, index) => (
                <Item key={field.key} noStyle>
                  <StyledWrapper>
                    <span style={{ marginBottom: '32px' }}>{index + 1}</span>
                    <Item
                      {...field}
                      rules={[
                        { required: true, message: 'input must not be empty!' },
                        { pattern: ShopeeAndSeaEmailRegExp, message: 'Shopee or SEA email only!' }
                      ]}
                    >
                      <Input
                        placeholder='Input Shopee/SEA Email...'
                        style={{ width: '360px' }}
                        onBlur={e => trimInput(e, index)}
                      ></Input>
                    </Item>
                    <Button
                      style={{ marginBottom: '32px' }}
                      icon={<ITrash />}
                      type='link'
                      onClick={() => remove(field.name)}
                      disabled={index === 0}
                    ></Button>
                  </StyledWrapper>
                </Item>
              ))}
              <Item noStyle>
                <AddButton icon={<PlusOutlined />} type='dashed' onClick={() => add()}>
                  Add
                </AddButton>
              </Item>
            </ListContent>
          )
        }}
      </List>
    </Item>
  ) : (
    <Item
      name='emails'
      rules={[
        {
          validator: (_, emails) => {
            if (!emails.length) {
              return Promise.reject('emails must not be empty!')
            }
            const isEmailsInvalid = emails.some(email => !ShopeeAndSeaEmailRegExp.test(email))
            if (isEmailsInvalid) {
              return Promise.reject('Shopee or SEA email only!')
            }
            return Promise.resolve()
          }
        }
      ]}
    >
      <StyledSelect
        mode='tags'
        open={false}
        tokenSeparators={[',']}
        placeholder='Input Shopee/SEA Emails split by ","'
        tagRender={tagRender}
        onChange={trimInputChange}
      />
    </Item>
  )
}

export default EmailInput
