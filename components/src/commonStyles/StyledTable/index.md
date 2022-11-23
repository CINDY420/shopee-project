# StyledTable

`StyledTable` is a styled [infrad Table](https://bolifestudio.com/components/table/#components-table-demo-basic) component, you can use it in the way of using `infrad Table`.

## Basic Usage

```tsx
import React from 'react'
import { StyledTable } from '@infra/components'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  }
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

const BasicUsage = () => <StyledTable columns={columns} dataSource={data} />
export default BasicUsage
```
