import React from 'react'

import { Form, Button, Input, Tag } from 'infrad'
import { FormInstance } from 'infrad/lib/form'
import Icon, { PlusOutlined } from 'infra-design-icons'
import { ListContent, StyledWrapper, AddButton, StyledSelect } from './style'
import DeleteSvg from 'assets/delete.antd.svg?component'

interface INameInput {
  isBatchNameInput: boolean
  form: FormInstance
}

const { Item, List } = Form

const NameInput: React.FC<INameInput> = ({ isBatchNameInput, form }) => {
  const trimInput = ({ target }, index) => {
    const fields = form.getFieldsValue()
    const { names } = fields
    const { value } = target
    names[index] = value.trim()
    form.setFieldsValue({ names })
    form.validateFields([['names', index]])
  }

  const trimInputChange = value => {
    const names = value.map(name => name.trim())
    form.setFieldsValue({ names: Array.from(new Set(names)) })
    form.validateFields([['names']])
  }

  const tagRender = props => {
    const { label, closable, onClose } = props
    const onPreventMouseDown = event => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    )
  }

  return isBatchNameInput ? (
    <Item
      name='names'
      rules={[
        {
          validator: (_, names) => {
            if (!names.length) {
              return Promise.reject('Name must not be empty!')
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
        placeholder='Input unique pipeline name split by ","'
        tagRender={tagRender}
        onChange={trimInputChange}
      />
    </Item>
  ) : (
    <Item name='names' initialValue={[undefined, undefined, undefined]} rules={[{ required: true }]}>
      <List name='names'>
        {(fields, { add, remove }) => {
          return (
            <ListContent>
              {fields.map((field, index) => (
                <Item key={field.key} noStyle>
                  <StyledWrapper>
                    <span style={{ marginBottom: '16px' }}>{index + 1}</span>
                    <Item {...field} rules={[{ required: true, message: 'input must not be empty!' }]}>
                      <Input
                        placeholder='Input pipeline name...'
                        style={{ width: '360px' }}
                        onBlur={e => trimInput(e, index)}
                      />
                    </Item>
                    <Button
                      style={{ marginBottom: '16px' }}
                      icon={
                        <Icon component={DeleteSvg} style={{ fontSize: '16px', color: index === 0 ? '' : '#000000' }} />
                      }
                      type='link'
                      onClick={() => remove(field.name)}
                      disabled={index === 0}
                    />
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
  )
}

export default NameInput
