# useInfradTable

`useInfradTable` is a React hook extended from ahooks [useAntdTable](https://ahooks.js.org/hooks/use-antd-table), it has the following features:

- Refresh at intervals without loading status
- Init Antd Table pagination easily
- Support [ListQuery Api](https://confluence.shopee.io/pages/viewpage.action?pageId=609075996#APIGuideline-%E6%A0%87%E5%87%86%E5%AD%97%E6%AE%B5) by an external hook, called `useListQueryTable`

## Examples

### Basic Usage

```tsx
import React from 'react'
import { StyledTable, useInfradTable } from '@infra/components'

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
  {
    key: '4',
    name: 'Jim',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '5',
    name: 'Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
]

interface IFetchDataParams {
  current: number;
  pageSize: number;
  sorter?: any;
  filter?: any;
}
const fetchDataFn = async (params: IFetchDataParams) => {
  return Promise.resolve({ list: data, total: data.length })
}

const BasicUsage = () => {
  const { tableProps } = useInfradTable(fetchDataFn)

  return (
    <StyledTable
      columns={columns}
      {...tableProps}
    />
  )
}
export default BasicUsage
```

### Refresh At Intervals

```tsx
import React from 'react'
import { StyledTable, useInfradTable } from '@infra/components'

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
  },
    {
    title: 'Current Time',
    dataIndex: 'time',
    key: 'time',
  }
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    time: 0,
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    time: 0,
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    time: 0,
  },
]

interface IFetchDataParams {
  current: number;
  pageSize: number;
  sorter?: any;
  filter?: any;
}
const fetchDataFn = async (params: IFetchDataParams) => {
  const timeData = data.map((item) => ({ ...item, time: Date.now() }))
  return Promise.resolve({ list: timeData, total: timeData.length })
}

const RefreshAtIntervals = () => {
  const { tableProps } = useInfradTable(fetchDataFn, { refreshInterval: 1000 })

  return (
    <StyledTable
      columns={columns}
      {...tableProps}
    />
  )
}
export default RefreshAtIntervals
```

### Custom Pagination

```tsx
import React from 'react'
import { StyledTable, useInfradTable } from '@infra/components'

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
  {
    key: '4',
    name: 'Jim',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '5',
    name: 'Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
]

interface IFetchDataParams {
  current: number;
  pageSize: number;
  sorter?: any;
  filter?: any;
}
const fetchDataFn = async (params: IFetchDataParams) => {
  return Promise.resolve({ list: data, total: data.length })
}

const CustomPagination = () => {
  const { tableProps } = useInfradTable(fetchDataFn, { pagination: {
    pageSizeOptions: [2, 4, 6],
    defaultPageSize: 2,
  }})

  return (
    <StyledTable
      columns={columns}
      {...tableProps}
    />
  )
}
export default CustomPagination
```

### ListQuery

Follow the rules of [ListQuery Api](https://confluence.shopee.io/pages/viewpage.action?pageId=609075996#APIGuideline-%E6%A0%87%E5%87%86%E5%AD%97%E6%AE%B5), the **listQuery** object is built by [@infra/utils](https://npm.shopee.io/-/web/detail/@infra/utils#21-build-in-frontend), and the listQuery function type is

```ts
interface IListQuery {
  offset?: string
  limit?: string
  filterBy?: string
  orderBy?: string
}
type ListQueryFn<TResponse> = (args: IListQuery) => Promise<TResponse>
```

Also, you can also use [@infra/utils](https://npm.shopee.io/-/web/detail/@infra/utils#22-parse-in-bff) to parse the **listQuery** object in Bff.

By the way, you can open your chrome's `Console` devtool to see the generated listQuery object.

```tsx
import React from 'react'
import { StyledTable, useListQueryTable } from '@infra/components'

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
    sorter: true,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    filters: [
      {
        text: 'London',
        value: 'London',
      },
      {
        text: 'New York',
        value: 'New York',
      },
    ]
  },
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'London',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'New York',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'New York',
  },
  {
    key: '4',
    name: 'Jim',
    age: 42,
    address: 'London',
  },
  {
    key: '5',
    name: 'Black',
    age: 32,
    address: 'New York',
  },
]

interface IListQuery {
  offset?: string
  limit?: string
  filterBy?: string
  orderBy?: string
}
const fetchDataFn = async (listQuery: IListQuery) => {
  console.log('listQuery:', listQuery)
  return Promise.resolve({ list: data, total: data.length })
}

const ListQuery = () => {
  const { tableProps } = useListQueryTable(fetchDataFn, { pagination: {
    pageSizeOptions: [2, 4, 6],
    defaultPageSize: 2,
  }})

  return (
    <StyledTable
      columns={columns}
      {...tableProps}
    />
  )
}
export default ListQuery
```

### ListQuery Additional

If you want to add additional parameters to the **filterBy** of **listQuery**, you can use the `filterByBuilder.append()` method of the generated **listQuery** object. You can refer to [@infra/utils](https://npm.shopee.io/-/web/detail/@infra/utils#21-build-in-frontend) to see how to use.

By the way, you can open your chrome's `Console` devtool to see the generated listQuery object.

```tsx
import React, { useState } from 'react'
import { StyledTable, useListQueryTable, FilterByOperator } from '@infra/components'
import { Select, Input } from 'infrad'

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
    sorter: true,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    filters: [
      {
        text: 'London',
        value: 'London',
      },
      {
        text: 'New York',
        value: 'New York',
      },
    ]
  },
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'London',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'New York',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'New York',
  },
  {
    key: '4',
    name: 'Jim',
    age: 42,
    address: 'London',
  },
  {
    key: '5',
    name: 'Black',
    age: 32,
    address: 'New York',
  },
]

interface IListQuery {
  offset?: string
  limit?: string
  filterBy?: string
  orderBy?: string
  searchBy?: string
}
const fetchDataFn = async (listQuery: IListQuery) => {
  console.log('ListQueryAdditional listQuery:', listQuery)
  return Promise.resolve({ list: data, total: data.length })
}

enum Gender {
  MAN = 'Man',
  WOMAN = 'Woman',
}

const ListQueryAdditional = () => {
  const [selectedGender, setSelectedGender] = useState<Gender>()
  const [searchedName, setSearchedName] = useState<string>()

  const handleGenderSelect = (value: Gender) => setSelectedGender(value)
  const handleNameSearch = (value: string) => setSearchedName(value)

  const { tableProps } = useListQueryTable((listQuery) => {
    const { filterBy, filterByBuilder, ...others } = listQuery

    // Additional filter items, support item or item[]
    if (selectedGender) {
      filterByBuilder.append({
        keyPath: 'gender',
        operator: FilterByOperator.EQUAL,
        value: selectedGender,
      })
    }
    const newFilterBy = selectedGender ? filterByBuilder.build() : filterBy

    return fetchDataFn({ ...others, filterBy: newFilterBy, searchBy: searchedName })
  }, {
    refreshDeps: [selectedGender, searchedName],
  })

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <Select defaultValue={Gender.MAN} style={{ width: 120 }} onChange={handleGenderSelect}>
          {Object.values(Gender).map((value) => (
            <Select.Option value={value} key={value} >{value}</Select.Option>
          ))}
        </Select>
        <Input.Search
          placeholder="Search Name"
          allowClear
          onSearch={handleNameSearch}
          style={{ width: 320, marginLeft: '100px' }}
        />
      </div>
      <StyledTable
        columns={columns}
        {...tableProps}
      />
    </>
  )
}
export default ListQueryAdditional
```

## API

### Result

The response types of useInfradTable and useListQueryTable are all the same as [ahooks useAntdTable](https://ahooks.js.org/hooks/use-antd-table#result), except for `tableProps.pagination`, the `tableProps.pagination` type shown as following:

Property | Description | Type
--- | -- | ---
pageSizeOptions | Same as infrad pagination |  Refer to [`infrad pagination`](https://bolifestudio.com/components/pagination-cn/#API)
showSizeChanger | Same as infrad pagination |  Refer to [`infrad pagination`](https://bolifestudio.com/components/pagination-cn/#API)
size | Same as infrad pagination |  Refer to [`infrad pagination`](https://bolifestudio.com/components/pagination-cn/#API)
showTotal | Same as infrad pagination) |  Refer to [`infrad pagination`](https://bolifestudio.com/components/pagination-cn/#API)

### Params

Property | Description | Type | Default
--- | -- | --- | ---
refreshInterval | Pass a number(ms) if you want to refresh the table at intervals |  Number | undefined
pagination | Same as [`infrad pagination`](https://bolifestudio.com/components/pagination-cn/#API) |  Refer to [`infrad pagination`](https://bolifestudio.com/components/pagination-cn/#API) | DEFAULT_TABLE_PAGINATION(shown as following)

``` ts
const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

const DEFAULT_TABLE_PAGINATION = {
  pageSizeOptions: ROWS_PER_PAGE_OPTIONS,
  showSizeChanger: true,
  size: 'small',
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Items`,
}
```

Other Properties are all the same as [ahooks useAntdTable](https://ahooks.js.org/hooks/use-antd-table/#params) except for `defaultPageSize`, which is moved into the `pagination` Property.

### useListQueryTable Params

Remind that the service type of `useListQueryTable` must be a listQuery function which params is `ListQuery` type, shown as following:

```ts
interface IListQuery {
  offset?: string
  limit?: string
  filterBy?: string
  orderBy?: string
}
type IListQueryFn<TData> = (args: IListQuery) => Promise<TData>
```
