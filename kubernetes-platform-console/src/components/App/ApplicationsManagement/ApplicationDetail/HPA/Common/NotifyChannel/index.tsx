import React from 'react'
import { Form, FormItemProps, FormInstance, Input, Button } from 'infrad'
import AddNewButton from 'components/Common/AddNewButton'
import Icon from 'infra-design-icons'
import deleteSvg from 'assets/delete.antd.svg'
interface INotifyChannelProps extends FormItemProps {
  form: FormInstance
}
const { Item } = Form

const NotifyChannel: React.FC<INotifyChannelProps> = ({ form, ...others }) => {
  return (
    <Item {...others} style={{ display: 'contents', flexFlow: 'row nowrap' }}>
      <Form.List name='notifyChannels'>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(field => (
              <Item required={false} key={field.key}>
                <Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input Seatalk webhook link'
                    }
                  ]}
                  noStyle
                >
                  <Input
                    placeholder='Please input Seatalk webhook link'
                    style={{ maxWidth: fields.length > 1 && '90%' }}
                  />
                </Item>
                {fields.length > 1 && (
                  <Button
                    shape='circle'
                    onClick={() => remove(field.name)}
                    icon={<Icon component={deleteSvg} width={14} />}
                    style={{ marginLeft: '8px' }}
                  />
                )}
              </Item>
            ))}
            {fields.length < 5 && (
              <Item>
                <AddNewButton onClick={() => add()}>Add</AddNewButton>
                <Form.ErrorList errors={errors} />
              </Item>
            )}
          </>
        )}
      </Form.List>
    </Item>
  )
}

export default NotifyChannel
