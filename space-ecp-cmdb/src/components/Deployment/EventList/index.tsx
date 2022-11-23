import * as React from 'react'
import { Table } from 'src/common-styles/table'
import useTable from 'src/hooks/useTable'
import DebouncedSearch from 'src/components/Common/DebouncedSearch'
import { Params } from 'ahooks/lib/useAntdTable/types'
import {
  FilterTypes,
  getFilterItem,
  getFilterUrlParam,
  getTableProps,
} from 'src/helpers/tableProps'
import { fetch } from 'src/rapper'
import { Card, DatePicker, Space, Typography } from 'infrad'
import moment from 'moment'
import { TABLE_PAGINATION_OPTION } from 'src/constants/pagination'
import { formatTime } from 'src/helpers/format'
import { ColumnsType } from 'infrad/lib/table'
import { IModels } from 'src/rapper/request'
import { PodMeta } from 'src/components/Deployment/EventList/style'

const { Paragraph } = Typography

const { RangePicker } = DatePicker

type Event = IModels['GET/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}/events']['Res']['items'][0]

interface IEventListProps {
  sduName: string
  deployId: string
}

const DEFAULT_EVENT_DATE = moment(Date.now())

const EventList: React.FC<IEventListProps> = ({ sduName, deployId }) => {
  const [searchValue, setSearchValue] = React.useState('')
  const [kindList, setKindList] = React.useState<string[]>([])
  const [dateRangeStrings, setDateRangeStrings] = React.useState<number[]>([
    DEFAULT_EVENT_DATE.unix(),
    DEFAULT_EVENT_DATE.unix(),
  ])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const handleRangePickerChange = (_: unknown, dateRangeStrings: string[]) => {
    if (dateRangeStrings.includes('')) {
      setDateRangeStrings(undefined)
    } else {
      const formattedDateRangeStrings = dateRangeStrings.map((item) => moment(item).unix())
      setDateRangeStrings(formattedDateRangeStrings)
    }
  }

  const columns: ColumnsType<Event> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Namespace',
      dataIndex: 'namespace',
    },
    {
      title: 'Message',
      dataIndex: 'message',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
    },
    {
      title: 'Kind',
      dataIndex: 'kind',
      filters: kindList.map((item) => ({ text: item, value: item })),
      render: (kind, record) => {
        if (kind === 'Pod') {
          return (
            <PodMeta>
              <div>{kind}</div>
              <div>
                Pod IP: <Paragraph copyable>{record.podIp}</Paragraph>
              </div>
              <div>
                Node IP: <Paragraph copyable>{record.hostIp}</Paragraph>
              </div>
            </PodMeta>
          )
        }
        return kind
      },
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      sorter: true,
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (createTime) => formatTime(Number(createTime)),
    },
  ]

  const { tableProps } = useTable(
    (args) =>
      getEventList(args, {
        deployId,
        sduName,
      }),
    {
      refreshDeps: [deployId, sduName, searchValue, dateRangeStrings],
    },
  )

  const getEventList = async (
    { current, pageSize, filters, sorter }: Params[0],
    params: { sduName: string; deployId: string },
  ) => {
    const { sduName, deployId } = params
    const filterAll = getFilterUrlParam({
      searchValue: getFilterItem('all', searchValue, FilterTypes.CONTAIN),
    })

    const {
      offset,
      limit,
      filterBy: tableFilter,
      orderBy,
    } = getTableProps({
      pagination: { current, pageSize },
      filters,
      sorter,
    })

    const filterBy = [filterAll, tableFilter].filter(Boolean).join(';')

    const { items, kindList, total } = await fetch[
      'GET/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}/events'
    ]({
      sduName,
      deployId,
      offset,
      limit,
      filterBy,
      orderBy,
      startTime: dateRangeStrings?.[0],
      endTime: dateRangeStrings?.[1],
    })
    setKindList(kindList)
    return {
      list: items || [],
      total: total || 0,
    }
  }

  return (
    <Card style={{ marginTop: '16px' }}>
      <Space direction="vertical" style={{ display: 'flex' }}>
        <Space>
          <DebouncedSearch
            callback={handleSearchChange}
            placeholder="Search…"
            debounceTime={300}
            style={{ width: '264px' }}
          />
          <RangePicker
            defaultValue={[DEFAULT_EVENT_DATE, DEFAULT_EVENT_DATE]}
            onChange={handleRangePickerChange}
            allowClear={false}
            disabledDate={(current) => current && current > moment().endOf('day')}
          />
        </Space>
        <Table
          {...tableProps}
          columns={columns}
          rowKey="name"
          pagination={{
            ...TABLE_PAGINATION_OPTION,
            ...tableProps?.pagination,
          }}
          scroll={{ x: '100%' }}
        />
      </Space>
    </Card>
  )
}

export default EventList
