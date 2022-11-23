import React, { useState, useEffect, useCallback } from 'react'
import { Typography, DatePicker } from 'infrad'
import { SearchOutlined } from 'infra-design-icons'
import { TODAY_ZERO_TIME, DEFAULT_EVENT_DATE, DEFAULT_OPERATION_LOGS_RANGE } from 'constants/time'

import { formatTime } from 'helpers/format'
import { columnSorterEnhancer } from 'helpers/pagination'
import { TABLE_PAGINATION_OPTION, ORDER } from 'constants/pagination'
import { generateTimeRangeFilter, generateFilter } from 'helpers/table/generateFilter'
import useAntdTable from 'hooks/table/useAntdTable'

import useSearchColumn from 'hooks/useSearchColumn'
import { userLogsControllerListNodes } from 'swagger-api/v3/apis/UserLogs'
import { filterTypes, getFilterItem, getFilterUrlParam } from 'helpers/queryParams'
import useAsyncFn from 'hooks/useAsyncFn'
import { Table, StyledInput, Header } from 'common-styles/table'
import { HorizontalLine } from 'common-styles/divider'
import { throttle } from 'helpers/functionUtils'

import moment from 'moment'

import { Root } from './style'

const { Title } = Typography
const { RangePicker } = DatePicker

const OperationLogs: React.FC = () => {
  const [timeOrder, setTimeOrder] = useState(ORDER.DESC)
  const [searchColumn] = useSearchColumn('operator')
  const [searchAllVal, setSearchAllVal] = useState(undefined)
  const [dateRangeStrings, setDateRangeStrings] = useState<string[]>(DEFAULT_OPERATION_LOGS_RANGE)

  const fetchFn = useCallback(
    args => {
      const { filterBy, ...others } = args || {}

      const extraFilterBy = getFilterUrlParam({
        all: getFilterItem('all', searchAllVal, filterTypes.contain)
      })

      const timeRangeFilter = generateTimeRangeFilter(dateRangeStrings)

      return userLogsControllerListNodes({
        filterBy: generateFilter([
          filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy,
          timeRangeFilter
        ]),
        orderBy: '@timestamp desc',
        ...others
      })
    },
    [dateRangeStrings, searchAllVal]
  )

  const [listOperationLogsState, listOperationLogsFn] = useAsyncFn(fetchFn, { deps: [dateRangeStrings, searchAllVal] })
  const { handleTableChange, pagination, refresh } = useAntdTable({
    fetchFn: listOperationLogsFn,
    orderDefault: 'timestamp desc',
    shouldFetchOnMounted: false
  })

  const handleSearchChange = val => setSearchAllVal(val)
  const handleDateRangeChange = (data, strings) => {
    if (strings.includes('')) {
      setDateRangeStrings(undefined)
    } else {
      setDateRangeStrings(strings)
    }
  }

  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  useEffect(() => {
    throttledRefresh()
  }, [throttledRefresh, dateRangeStrings, searchAllVal])

  const { value, loading } = listOperationLogsState
  const { tenants = [], objectTypes = [], methods = [], sources = [], logs: operationLogs, totalCount: total } =
    value || {}

  const columns = [
    {
      title: 'Operator',
      dataIndex: 'operator',
      key: 'operator',
      render: (name: string) => {
        return searchColumn.getRenderContent(name)
      },
      ...searchColumn.columnSearchConfig
    },
    {
      title: 'Tenant',
      dataIndex: 'tenant',
      key: 'tenant',
      filters: tenants.map(tenant => ({ text: tenant, value: tenant }))
    },
    {
      title: 'Object Type',
      dataIndex: 'objectType',
      key: 'objectType',
      filters: objectTypes.map(objectType => ({ text: objectType, value: objectType }))
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      filters: methods.map(method => ({ text: method, value: method }))
    },
    {
      title: 'Details',
      dataIndex: 'detail',
      key: 'detail',
      render: detail => <div style={{ wordBreak: 'break-word' }}>{detail}</div>
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      filters: sources.map(source => ({ text: source, value: source }))
    },
    columnSorterEnhancer(
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (time: string) => {
          return <div>{formatTime(time)}</div>
        }
      },
      timeOrder,
      setTimeOrder
    )
  ]

  return (
    <Root>
      <Title level={4}>Operation Logs</Title>
      <Header>
        <StyledInput
          allowClear
          value={searchAllVal}
          placeholder='Search...'
          suffix={<SearchOutlined />}
          onChange={event => handleSearchChange(event.target.value)}
        />
        <HorizontalLine size='20px' />
        <RangePicker
          defaultValue={[TODAY_ZERO_TIME, DEFAULT_EVENT_DATE]}
          onCalendarChange={handleDateRangeChange}
          showTime={{
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
          }}
          format='YYYY-MM-DD HH:mm:ss'
        />
      </Header>
      <Table
        rowKey={(record: any) => {
          const { operator, time, detail } = record
          return `${operator} ${detail} ${time}`
        }}
        columns={columns}
        dataSource={operationLogs}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...pagination,
          total
        }}
      />
    </Root>
  )
}

export default OperationLogs
