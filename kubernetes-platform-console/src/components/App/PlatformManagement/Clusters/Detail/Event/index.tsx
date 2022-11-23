import * as React from 'react'
import { useRecoilValue } from 'recoil'
import { SearchOutlined } from 'infra-design-icons'

import { selectedCluster } from 'states/clusterState'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useSearchColumn from 'hooks/useSearchColumn'

import { Table, IPAddress, IPLabel, StyledInput, StyledRangePicker, Header } from 'common-styles/table'
import { clustersControllerGetClusterEvents } from 'swagger-api/v3/apis/Cluster'
import { IEvent } from 'api/types/event'
import { ColumnsType } from 'infrad/lib/table'
import { formatTime } from 'helpers/format'
import { throttle } from 'helpers/functionUtils'
import { getFilterUrlParam, getFilterItem, filterTypes } from 'helpers/queryParams'
import { generateTimeRangeFilter, generateFilter } from 'helpers/table/generateFilter'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { parseEventName } from 'helpers/cluster'
import { DEFAULT_EVENT_DATE, DEFAULT_EVENT_DATE_RANGE } from 'constants/time'

import { Root } from './style'

const KIND_POD = 'Pod'
const FILTER_TYPE_LOOKUP = { name: filterTypes.contain, namespace: filterTypes.contain }

const Event: React.FC = () => {
  const currentSelectedCluster = useRecoilValue(selectedCluster)
  const { name: clusterId } = currentSelectedCluster

  const [dateRangeStrings, setDateRangeStrings] = React.useState<string[]>(DEFAULT_EVENT_DATE_RANGE)
  const [searchAllVal, setSearchAllVal] = React.useState(undefined)
  const [searchNameColumn] = useSearchColumn('name')
  const [searchNamespaceColumn] = useSearchColumn('namespace')

  const fetchFn = React.useCallback(
    args => {
      const { filterBy, ...others } = args || {}

      const extraFilterBy = getFilterUrlParam({
        all: getFilterItem('all', searchAllVal, filterTypes.contain)
      })

      const timeRangeFilter = generateTimeRangeFilter(dateRangeStrings, true)

      return clustersControllerGetClusterEvents({
        clusterName: clusterId,
        filterBy: generateFilter([
          filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy,
          timeRangeFilter
        ]),
        orderBy: 'creationTimestamp desc',
        ...others
      })
    },
    [clusterId, dateRangeStrings, searchAllVal]
  )
  const [listClusterEventsState, listClusterEventsFn] = useAsyncIntervalFn(fetchFn)
  const { handleTableChange, pagination, refresh } = useAntdTable({
    fetchFn: listClusterEventsFn,
    filterTypeLookup: FILTER_TYPE_LOOKUP,
    orderDefault: 'creationTimestamp desc'
  })
  const { loading, value } = listClusterEventsState
  const { events = [], kindList = [], totalCount = 0 } = value || {}
  const columns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => {
        const parsedName = parseEventName(name)
        return searchNameColumn.getRenderContent(parsedName)
      },
      ...searchNameColumn.columnSearchConfig
    },
    {
      title: 'Namespace',
      dataIndex: 'namespace',
      key: 'namespace',
      render: (name: string) => {
        return searchNamespaceColumn.getRenderContent(name)
      },
      ...searchNamespaceColumn.columnSearchConfig
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
      filters: kindList && kindList.map((item: string) => ({ text: item, value: item })),
      render: (kind: string, record: IEvent) => {
        const { podip, hostip } = record
        if (kind === KIND_POD) {
          return (
            <div>
              {kind}
              <IPAddress>
                <IPLabel>Pod IP: </IPLabel>
                {podip || '-'}
              </IPAddress>
              <IPAddress>
                <IPLabel>Node IP: </IPLabel>
                {hostip || '-'}
              </IPAddress>
            </div>
          )
        } else {
          return kind
        }
      }
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

  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    throttledRefresh()
  }, [searchAllVal, dateRangeStrings, throttledRefresh])

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
        columns={columns}
        rowKey='name'
        onChange={handleTableChange}
        loading={loading}
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
