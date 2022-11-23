# TableFormList

`TableFormList` is a component combined with `infrad` [Table](https://bolifestudio.com/components/table-cn/) and [Form.List](https://bolifestudio.com/components/form-cn/#components-form-demo-dynamic-form-item), you can use it to render a **Dynamic Form Item** gracefully.

## Examples

You can see the printed value by opening the **browser DevTools console** if the examples has `console.log`.

### Basic Usage

```tsx
import React from 'react'
import { TableFormList, ITableFormListProps } from '@infra/components'
import { Form, Input, InputNumber, Button } from 'infrad'

const { Item } = Form

const BasicUsage = () => {
  const columns: ITableFormListProps['columns'] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'name']}>
          <Input />
        </Item>
      ),
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'age']}>
          <InputNumber addonAfter="years old" />
        </Item>
      ),
    },
  ]

  const [form] = Form.useForm()
  const handleSubmit = async () => {
    const values = await form.validateFields()
    // Open the browser DevTools console to see the values 
    console.log('values:', values)
  }

  return (
    <>
      <Form name="test" form={form}>
        <TableFormList
          name="members"
          columns={columns}
        />
      </Form>
      <Button type="primary" onClick={handleSubmit}>Submit</Button>
    </>
  )
}
export default BasicUsage
```

### Custom Style

You can custom the table style by passing `style` or `AntdTable` props

- By `style`

```tsx
import React from 'react'
import { TableFormList, ITableFormListProps } from '@infra/components'
import { Form, Input, InputNumber } from 'infrad'

const { Item } = Form

const CustomStyle = () => {
  const columns: ITableFormListProps['columns'] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'name']}>
          <Input />
        </Item>
      ),
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'age']}>
          <InputNumber addonAfter="years old" />
        </Item>
      ),
    },
  ]

  return (
    <Form name="test">
      <TableFormList
        style={{ backgroundColor: '#e0eff0' }}
        name="members"
        columns={columns}
      />
    </Form>
  )
}
export default CustomStyle
```

- By `AntdTable`

  You can customize the table style of TableFormList through some CSS HOC technique, such as [styled-components](https://styled-components.com) or [emotion](https://emotion.sh/docs/@emotion/react). You just need to pass the wrapped component function by the table props.

```tsx
import React from 'react'
import { TableFormList, ITableFormListProps } from '@infra/components'
import { Form, Input, InputNumber, Table } from 'infrad'
import styled from 'styled-components'

const StyledTable: typeof Table = styled(Table)`
  .ant-table {
    border: 1px solid black;
  }
`


const { Item } = Form

const CustomTable = () => {
  const columns: ITableFormListProps['columns'] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'name']}>
          <Input />
        </Item>
      ),
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'age']}>
          <InputNumber addonAfter="years old" />
        </Item>
      ),
    },
  ]

  return (
    <Form name="test">
      <TableFormList
        name="members"
        columns={columns}
        AntdTable={StyledTable}
      />
    </Form>
  )
}
export default CustomTable
```

### Add Button ColSpan

You can custom the spanned columns of `+ Add` Button by passing `addNewColSpanKeys` props

```tsx
import React from 'react'
import { TableFormList, ITableFormListProps } from '@infra/components'
import { Form, Input, InputNumber } from 'infrad'

const { Item } = Form

const AddColSpan = () => {
  const columns: ITableFormListProps['columns'] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'name']}>
          <Input />
        </Item>
      ),
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'age']}>
          <InputNumber addonAfter="years old" />
        </Item>
      ),
    },
        {
      title: 'Address',
      key: 'address',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'address']}>
          <Input />
        </Item>
      ),
    },
  ]

  return (
    <Form name="test">
      <TableFormList
        name="members"
        columns={columns}
        addNewColSpanKeys={['name', 'age']}
      />
    </Form>
  )
}
export default AddColSpan
```

### Add New Render

You can custom the 'Add New' Button by passing `addNewRender` prop

```tsx
import React from 'react'
import { TableFormList, ITableFormListProps } from '@infra/components'
import { Form, Input, InputNumber, Button } from 'infrad'

const { Item } = Form

const addNewRender: ITableFormListProps['addNewRender'] = (triggerAdd, count) => <Button style={{ width: '100%' }} type="primary" onClick={triggerAdd}>My Add {count}/30</Button>

const AddNewRender = () => {
  const columns: ITableFormListProps['columns'] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'name']}>
          <Input />
        </Item>
      ),
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'age']}>
          <InputNumber addonAfter="years old" />
        </Item>
      ),
    }
  ]

  return (
    <Form name="test">
      <TableFormList
        name="members"
        columns={columns}
        addNewRender={addNewRender}
      />
    </Form>
  )
}
export default AddNewRender
```

### Action Column Render

You can custom the 'Remove' Column by passing `actionRender` prop

```tsx
import React from 'react'
import { TableFormList, ITableFormListProps } from '@infra/components'
import { Form, Input, InputNumber, Button } from 'infrad'

const { Item } = Form

const actionRender: ITableFormListProps['actionRender'] = (triggerRemove) => <Button type="link" onClick={triggerRemove}>My Remove</Button>

const ActionRender = () => {
  const columns: ITableFormListProps['columns'] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'name']}>
          <Input />
        </Item>
      ),
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'age']}>
          <InputNumber addonAfter="years old" />
        </Item>
      ),
    }
  ]

  return (
    <Form name="test">
      <TableFormList
        name="members"
        columns={columns}
        actionRender={actionRender}
      />
    </Form>
  )
}
export default ActionRender
```

### Validate Rules

- Validate empty list before submitting by passing `rules` prop

```tsx
import React from 'react'
import { TableFormList, ITableFormListProps } from '@infra/components'
import { Form, Input, InputNumber, Button } from 'infrad'

const { Item } = Form

const ValidateBeforeSubmit = () => {
  const columns: ITableFormListProps['columns'] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'name']}>
          <Input />
        </Item>
      ),
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'age']}>
          <InputNumber addonAfter="years old" />
        </Item>
      ),
    },
  ]

  const [form] = Form.useForm()
  const handleSubmit = async () => {
    const values = await form.validateFields()
    // Open the browser DevTools console to see the values 
    console.log('values:', values)
  }

  return (
    <>
      <Form name="test" form={form}>
        <TableFormList
          name="members"
          columns={columns}
          rules={[
            {
              validator(_, members) {
                if (members.length === 0) {
                  return Promise.reject()
                }
                return Promise.resolve()
              },
              message: 'Please add one',
            },
          ]}
        />
      </Form>
      <Button type="primary" onClick={handleSubmit}>Submit</Button>
    </>
  )
}
export default ValidateBeforeSubmit
```

- Validate current items before 'Add New' by passing `beforeAddNew` prop

```tsx
import React from 'react'
import { TableFormList, ITableFormListProps } from '@infra/components'
import { Form, Input, InputNumber } from 'infrad'

const { Item } = Form

const ValidateBeforeAddNew = () => {
  const columns: ITableFormListProps['columns'] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Name is required' }]}>
          <Input />
        </Item>
      ),
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'age']} rules={[{ required: true, message: 'Age is required' }]}>
          <InputNumber addonAfter="years old" />
        </Item>
      ),
    },
  ]

  const [form] = Form.useForm()
  const handleBeforeAddNew = async () => {
    const values = form.getFieldsValue()
    const members = values?.members
    if (!members || members?.length <= 0) return
    const lastMemberIndex = members.length - 1
    await form.validateFields([['members', lastMemberIndex, 'name'], ['members', lastMemberIndex, 'age']])
  }

  return (
    <Form name="test" form={form}>
      <TableFormList
        name="members"
        columns={columns}
        beforeAddNew={handleBeforeAddNew}
      />
    </Form>
  )
}
export default ValidateBeforeAddNew
```

### <font color=green>Best Practice</font>

Recommend use this component with `rules` and `beforeAddNew` props

```tsx
import React from 'react'
import { TableFormList, ITableFormListProps } from '@infra/components'
import { Form, Input, InputNumber, Button } from 'infrad'

const { Item } = Form

const BestPractice = () => {
  const columns: ITableFormListProps['columns'] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Name is required' }]}>
          <Input />
        </Item>
      ),
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, { name, ...restField }) => (
        <Item {...restField} name={[name, 'age']} rules={[{ required: true, message: 'Age is required' }]}>
          <InputNumber addonAfter="years old" />
        </Item>
      ),
    },
  ]

  const [form] = Form.useForm()
  const handleSubmit = async () => {
    const values = await form.validateFields()
    // Open the browser DevTools console to see the form values 
    console.log('values:', values)
  }

  const handleBeforeAddNew = async () => {
    const { members } = form.getFieldsValue()
    if (!members || members?.length <= 0) return
    // Validate the last item of the list before 'Add New'
    const lastMemberIndex = members.length - 1
    await form.validateFields([['members', lastMemberIndex, 'name'], ['members', lastMemberIndex, 'age']])
  }

  return (
    <>
      <Form name="test" form={form}>
        <TableFormList
          name="members"
          columns={columns}
          rules={[{ validator(_, members) {
            // Open the browser DevTools console to see the values 
            console.log('members:', members)
            if (members.length === 0) {
              return Promise.reject()
            }
            return Promise.resolve()
          },  message: 'Please add one',}]}
          beforeAddNew={handleBeforeAddNew}
        />
      </Form>
      <Button type="primary" onClick={handleSubmit}>Submit</Button>
    </>
  )
}
export default BestPractice
```

<API exports='["default"]'></API>
Other props are all the same as `infrad` [Table API](https://bolifestudio.com/components/table-cn/#API)
