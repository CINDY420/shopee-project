import * as React from 'react'
import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { SearchOutlined } from 'infra-design-icons'

import { Table, StyledInput, StyledRangePicker, Header } from 'common-styles/table'
import { IPod } from 'api/types/application/pod'
import { podsControllerGetApplicationEvents } from 'swagger-api/v3/apis/Pods'
import { Root } from './style'
import { ColumnsType } from 'infrad/lib/table'

import { formatTime } from 'helpers/format'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { parseEventName } from 'helpers/cluster'
import { getFilterUrlParam, getFilterItem, filterTypes } from 'helpers/queryParams'
import { generateTimeRangeFilter, generateFilter } from 'helpers/table/generateFilter'
import { DEFAULT_EVENT_DATE, DEFAULT_EVENT_DATE_RANGE } from 'constants/time'

interface IEventProps {
  pod: IPod
}
const FILTER_TYPE_LOOKUP = { name: filterTypes.contain, namespace: filterTypes.contain }

const Event: React.FC<IEventProps> = ({ pod }) => {
  const [searchAllVal, setSearchAllVal] = React.useState(undefined)
  const [dateRangeStrings, setDateRangeStrings] = React.useState<string[]>(DEFAULT_EVENT_DATE_RANGE)
  const fetchFn = React.useCallback(
    args => {
      const { filterBy, ...others } = args || {}
      const extraFilterBy = getFilterUrlParam({
        all: getFilterItem('all', searchAllVal, filterTypes.contain)
      })

      const timeRangeFilter = generateTimeRangeFilter(dateRangeStrings, true)

      return podsControllerGetApplicationEvents({
        tenantId: pod.tenantId,
        projectName: pod.projectName,
        appName: pod.appName,
        podName: pod.name,
        clusterId: pod.clusterId,
        filterBy: generateFilter([
          filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy,
          timeRangeFilter
        ]),
        orderBy: 'creationTimestamp desc',
        ...others
      })
    },
    [pod, dateRangeStrings, searchAllVal]
  )
  const [listPodEventsState, listPodEventsFn] = useAsyncIntervalFn(fetchFn)
  const { handleTableChange, pagination, refresh } = useAntdTable({
    fetchFn: listPodEventsFn,
    filterTypeLookup: FILTER_TYPE_LOOKUP,
    orderDefault: 'creationTimestamp desc'
  })
  const { events = [], kindList = [], totalCount = 0 } = listPodEventsState.value || {}
  const columns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: name => parseEventName(name)
    },
    {
      title: 'Namespace',
      dataIndex: 'namespace',
      key: 'namespace'
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Kind',
      dataIndex: 'kind',
      key: 'kind',
      filters: kindList.map((item: string) => ({ text: item, value: item }))
    },
    {
      title: 'Create Time',
      dataIndex: 'creationTimestamp',
      defaultSortOrder: 'descend',
      sorter: true,
      render: t => formatTime(t)
    }
  ]

  const handleSearchChange = React.useCallback(val => {
    setSearchAllVal(val)
  }, [])

  React.useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchAllVal, dateRangeStrings])

  return (
    <Root>
      <Header>
        <StyledInput
          allowClear
          value={searchAllVal}
          placeholder='Search...'
          suffix={<SearchOutlined />}
          onChange={event => handleSearchChange(event.target.value)}
        />
        <StyledRangePicker
          defaultValue={[DEFAULT_EVENT_DATE, DEFAULT_EVENT_DATE]}
          onChange={(data, strings) => {
            if (strings.includes('')) {
              setDateRangeStrings(undefined)
            } else {
              setDateRangeStrings(strings)
            }
          }}
        />
      </Header>
      <Table
        rowKey='name'
        loading={listPodEventsState.loading}
        columns={columns}
        onChange={handleTableChange}
        dataSource={events}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          total: totalCount
        }}
      />
    </Root>
  )
}

export default Event
