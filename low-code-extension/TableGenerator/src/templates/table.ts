export const tableTemplate = `import React from 'react'
{{#hasActions}}
{{#hasMoreActions}}
import { Menu, Button, Dropdown } from 'infrad'
import { IArrowDown } from 'infra-design-icons'
{{/hasMoreActions}}
{{/hasActions}}
{{#hasActions}}
{{^hasMoreActions}}
import { Button } from 'infrad'
{{/hasMoreActions}}
{{/hasActions}}
import { useDebounce } from 'react-use'
import { ColumnsType } from 'infrad/lib/table'
import { Params } from 'ahooks/lib/useAntdTable/types'
{{#isFilterOptionFromApi}} 
import { useRequest } from 'ahooks' 
{{/isFilterOptionFromApi}} 
import { Table } from './style'
import useTable from '../../util/useTable'
import { TABLE_PAGINATION_OPTION } from '../../util/constants'
import { getTableProps } from '../../util/tableProps'
{{#controllerFetchGroup}}
import { {{#fetches}}{{.}}{{/fetches}} } from 'swagger-api/apis/{{controller}}'
{{/controllerFetchGroup}}
import { {{responseName}} } from 'swagger-api/models'

{{#hasSearchBy}}
enum ISearchKeys {
  {{#selectedSearchBy}}
  {{capital}} = '{{value}}',
  {{/selectedSearchBy}}
} 
{{/hasSearchBy}}

{{#hasFilterValues}}
{{#filterValues}}
enum {{name}} {
  {{#data}}
    {{key}} = '{{value}}',
  {{/data}}
}
{{/filterValues}}
{{/hasFilterValues}}

{{#hasMoreActions}}
enum MoreAction {
  {{#moreActions}}
    {{allCapital}} = '{{capital}}',
  {{/moreActions}}
}
{{/hasMoreActions}}

type {{itemName}} = {{responseName}}['items'][0]
interface I{{itemName}}Props {
  {{#contents}}
  {{#isFromProps}}
    {{filterOption}}: string[]
  {{/isFromProps}}
  {{/contents}}
  {{#params}}
  {{value}}{{^required}}?{{/required}}: {{type}}
  {{/params}}
  {{#extraQueries}}
  {{value}}{{^required}}?{{/required}}: {{type}}
  {{/extraQueries}}
  searchValue?: string
}

const {{formattedApiName}}Table: React.FC<I{{itemName}}Props> = ({
  {{#contents}}
  {{#isFromProps}}
    {{filterOption}},
  {{/isFromProps}}
  {{/contents}}
  searchValue, {{#params}}{{value}},{{/params}} {{#extraQueries}}{{value}},{{/extraQueries}}  
}) => {

  {{#contents}}
  {{#isEnumerate}}
    const [{{filterOption}}, set{{capitalizedFilterOption}}] = React.useState<string[]>([])
  {{/isEnumerate}}
  {{/contents}}

  {{#contents}}
  {{#isFromApi}}
  const {{filterOption}} = useRequest({{filterOptionFetch}})?.data?.{{filterApiPath}}
  {{/isFromApi}}
  {{/contents}}

  {{#hasMoreActions}}
  const handleMoreActionClick = (record: {{itemName}}, action: MoreAction) => {}
  {{/hasMoreActions}}

  {{#hasActions}}
    {{#actions}}
    const handle{{capital}} = (record: {{itemName}}) => {}
    {{/actions}}
  {{/hasActions}}

  const columns: ColumnsType<{{itemName}}> = [
    {{#contents}}
    {
      title: '{{title}}',
      dataIndex: '{{dataIndex}}',
      key: '{{key}}',
      {{#orderable}}
      sorter: true,
      {{/orderable}}
      {{#filterable}}
      filters: {{^isFixed}}{{filterOption}}{{/isFixed}}{{#isFixed}}Object.values({{fixedFilterEnum}}){{/isFixed}}?.map((item: string) => ({ text: item, value: item })),
      {{/filterable}}
    },
    {{/contents}}

    {{#hasActions}}
    {
      title: 'Action',
      render: (_, record) => {
        {{#hasMoreActions}}
        const menu = (
          <Menu>
            {Object.values(MoreAction).map((action) => (
              <Menu.Item
                key={action}
                onClick={() => handleMoreActionClick(record, action)}
              >
                {action}
              </Menu.Item>
            ))}
          </Menu>
        )
        {{/hasMoreActions}}

        return (
          {{=<% %>=}}
          <div style={{ display: 'flex' }}>
          <%={{ }}=%>  
            {{#actions}}
              <Button
                type="link"
                {{=<% %>=}}
                style={{ padding: '0 16px 0 0' }}
                <%={{ }}=%>  
                onClick={() => handle{{capital}}(record)}
              >
                {{capital}}
              </Button>
            {{/actions}}

            {{#hasMoreActions}}
            <Dropdown overlay={menu}>
              <Button
                type="link"
                onClick={(e) => e.preventDefault()}
                {{=<% %>=}}
                style={{ whiteSpace: 'nowrap' }}
                <%={{ }}=%>  
              >
                More
                <IArrowDown />
              </Button>
            </Dropdown>
            {{/hasMoreActions}}

          </div>
        )
      }
    },
    {{/hasActions}}
  ]

  const get{{itemName}}List = async (
    { current, pageSize, filters, sorter }: Params[0],
    params: { {{#params}}{{value}}: {{type}};{{/params}}{{#extraQueries}}{{value}}{{^required}}?{{/required}}: {{type}}; {{/extraQueries}} },
  ) => {
    const { {{#params}}{{value}},{{/params}}{{#extraQueries}}{{value}},{{/extraQueries}} } = params

    const { {{#defaultQueries}}{{value}},{{/defaultQueries}} } = getTableProps({
      pagination: { current, pageSize },
      filters,
      sorter,
      {{#hasSearchBy}}
      searchKeys: Object.values(ISearchKeys),
      {{/hasSearchBy}}
      searchValue,
    })

    const {
      items,
      total,
    } = await {{fetchName}}({
      {{#params}}
      {{value}},
      {{/params}}
      {{#extraQueries}}
      {{value}},
      {{/extraQueries}}
      {{#defaultQueries}}
      {{value}},
      {{/defaultQueries}}
    })
    {{#contents}}
    {{#isEnumerate}}
      const {{filterOption}} = items.map((item) => item.{{key}})
      set{{capitalizedFilterOption}}([...new Set({{filterOption}})])
    {{/isEnumerate}}
    {{/contents}}
    return {
      list: items || [],
      total: total || 0,
    }
  }

  const { tableProps, loading, refresh } = useTable(
    (args) =>
      get{{itemName}}List(args, {
      {{#params}}
      {{value}},
      {{/params}}
      {{#extraQueries}}
      {{value}},
      {{/extraQueries}}
      })
  )

  useDebounce(
    () => {
      searchValue !== undefined && refresh()
    },
    500,
    [searchValue],
  )

  return (
    <Table
      {...tableProps}
      rowKey='{{rowKey}}'
      columns={columns}
      loading={loading}
      pagination=
      {{=<% %>=}}
        {{
        ...TABLE_PAGINATION_OPTION,
        ...tableProps.pagination,
        }}
      <%={{ }}=%>
    />
  )
}

export default {{formattedApiName}}Table`