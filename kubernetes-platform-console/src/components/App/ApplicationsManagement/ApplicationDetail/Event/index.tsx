import * as React from 'react'
import useSearchColumn from 'hooks/useSearchColumn'
import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { SearchOutlined } from 'infra-design-icons'

import { applicationsControllerGetApplicationEvents } from 'swagger-api/v3/apis/Applications'
import { Table, IPAddress, IPLabel, StyledInput, StyledRangePicker, Header } from 'common-styles/table'
import { IApplication } from 'api/types/application/application'
import { IEvent } from 'api/types/event'
import { formatTime } from 'helpers/format'
import { throttle } from 'helpers/functionUtils'
import { generateTimeRangeFilter, generateFilter } from 'helpers/table/generateFilter'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { getFilterUrlParam, getFilterItem, filterTypes } from 'helpers/queryParams'
import { parseEventName } from 'helpers/cluster'
import { useQueryParam, StringParam } from 'use-query-params'
import { EVENT_QUERY_KEYS } from 'constants/deployment'
import { removeQuery } from 'helpers/editUrlQuery'
import history from 'helpers/history'
import { DEFAULT_EVENT_DATE, DEFAULT_EVENT_DATE_RANGE } from 'constants/time'

import { Root } from './style'

const KIND_POD = 'Pod'
const FILTER_TYPE_LOOKUP = { name: filterTypes.contain, namespace: filterTypes.contain }

interface IEventProps {
  application: IApplication
}

const Event: React.FC<IEventProps> = ({ application }) => {
  const [queryNamespace] = useQueryParam(EVENT_QUERY_KEYS.NAMESPACE, StringParam)
  const [searchAllValue] = useQueryParam(EVENT_QUERY_KEYS.SEARCH_ALL, StringParam)

  const [dateRangeStrings, setDateRangeStrings] = React.useState<string[]>(DEFAULT_EVENT_DATE_RANGE)
  const [searchAllVal, setSearchAllVal] = React.useState(searchAllValue)
  const [searchNameColumn] = useSearchColumn('name')
  const [searchNamespaceColumn] = useSearchColumn('namespace')

  const defaultFilterBy = getFilterUrlParam({
    namespace: getFilterItem('namespace', queryNamespace, filterTypes.contain)
  })

  const fetchFn = React.useCallback(
    async args => {
      let { filterBy } = args || {}

      if ((!filterBy || !filterBy.length) && defaultFilterBy) {
        filterBy = defaultFilterBy
      }

      const extraFilterBy = getFilterUrlParam({
        all: getFilterItem('all', searchAllVal, filterTypes.contain)
      })

      const timeRangeFilter = generateTimeRangeFilter(dateRangeStrings, true)

      try {
        const events = await applicationsControllerGetApplicationEvents({
          tenantId: application.tenantId,
          projectName: application.projectName,
          appName: application.name,
          // clusterId: application.clusterId,
          ...args,
          filterBy: generateFilter([
            filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy,
            timeRangeFilter
          ])
        })
        return events
      } catch (error) {
        // ignore error because bromo has no events
      }
    },
    [
      // application.clusterId,
      application.tenantId,
      application.name,
      application.projectName,
      dateRangeStrings,
      searchAllVal,
      defaultFilterBy
    ]
  )
  const [listEventsState, listEventsFn] = useAsyncIntervalFn(fetchFn, { enableIntervalCallback: true })
  const { handleTableChange, pagination, refresh } = useAntdTable({
    fetchFn: listEventsFn,
    filterTypeLookup: FILTER_TYPE_LOOKUP,
    orderDefault: 'creationTimestamp desc'
  })
  const { events = [], totalCount, kindList = [] } = listEventsState.value || {}

  const handleListChange = (pagination, filters, sorter, extra) => {
    handleTableChange(pagination, filters, sorter, extra)
    removeQuery(history, EVENT_QUERY_KEYS.NAMESPACE)
    removeQuery(history, EVENT_QUERY_KEYS.SEARCH_ALL)
  }

  React.useEffect(() => {
    refresh()
  }, [refresh, dateRangeStrings])

  const columns: any = React.useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        render: (name: string) => {
          const parsedName = parseEventName(name)
          return searchNameColumn.getRenderContent(parsedName)
        },
        ...searchNameColumn.columnSearchConfig
      },
      {
        title: 'Namespace',
        dataIndex: 'namespace',
        defaultFilteredValue: queryNamespace ? [queryNamespace] : undefined,
        render: (name: string) => {
          return searchNamespaceColumn.getRenderContent(name)
        },
        ...searchNamespaceColumn.columnSearchConfig
      },
      {
        title: 'Message',
        dataIndex: 'message'
      },
      {
        title: 'Reason',
        dataIndex: 'reason'
      },
      {
        title: 'Kind',
        dataIndex: 'kind',
        filters: kindList && kindList.map(kind => ({ text: kind, value: kind })),
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
        render: (time: string) => <div>{formatTime(time)}</div>,
        sorter: true
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kindList]
  )

  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    throttledRefresh()
  }, [searchAllVal, throttledRefresh])

  const handleSearchChange = React.useCallback(val => {
    setSearchAllVal(val)
  }, [])

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
        rowKey={(record: IEvent) =>
          `${record.name} ${record.namespace} ${record.message} ${record.kind} ${record.creationTimestamp}`
        }
        loading={listEventsState.loading}
        columns={columns}
        dataSource={events}
        onChange={handleListChange}
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
