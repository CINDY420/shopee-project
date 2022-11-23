import * as React from 'react'
import { formatTime, localTimeToUTC } from 'helpers/format'
import { ColumnsType } from 'infrad/lib/table'
import { Table } from 'common-styles/table'
import { IListTerminalCommandLogsParam, ITerminalCommandLog } from 'api/types/application/terminalCommandLog'

import { applicationsControllerGetApplicationTerminalCommandLogs } from 'swagger-api/v3/apis/Applications'

import { IApplication } from 'api/types/application/application'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { Filters, StyledInput, StyledButton, IPText, StyledDiv, Text } from './style'
import { SearchOutlined } from 'infra-design-icons'
import { Empty, DatePicker } from 'infrad'
import { useQueryParam, StringParam } from 'use-query-params'
import { throttle } from 'helpers/functionUtils'
import { filterTypes, getFilterItem, getFilterUrlParam } from 'helpers/queryParams'
import { generateFilter } from 'helpers/table/generateFilter'
import { TODAY_ZERO_TIME } from 'constants/time'

import ReplayModal from 'components/App/ApplicationsManagement/ApplicationDetail/TerminalLog/ReplayModal'
import moment from 'moment'

const { RangePicker } = DatePicker

interface ICommandProps {
  application: IApplication
}

const Command: React.FC<ICommandProps> = ({ application }) => {
  const [dateRangeStrings, setDateRangeStrings] = React.useState([
    TODAY_ZERO_TIME.utc().format(),
    moment()
      .utc()
      .format()
  ])
  const [searchAllValue, setSearchAllVal] = React.useState('')
  const [selectedPlay, setSelectedPlay] = useQueryParam('selectedPlay', StringParam)
  const [selectedTime, setSelectedTime] = useQueryParam('selectedTime', StringParam)
  const { tenantId, projectName, name: appName } = application

  const getFilterParameters = (filterBy: string | undefined, extraFilterBy: string | undefined): string => {
    if (filterBy) {
      if (extraFilterBy) {
        return `${filterBy};${extraFilterBy}`
      } else {
        return `${filterBy}`
      }
    } else {
      return extraFilterBy ?? ''
    }
  }

  const fetchFn = React.useCallback(
    (args: IListTerminalCommandLogsParam) => {
      const { filterBy } = args
      const extraFilterBy = getFilterUrlParam({
        all: getFilterItem('all', searchAllValue, filterTypes.contain)
      })
      const [startTime, endTime] = dateRangeStrings
      return applicationsControllerGetApplicationTerminalCommandLogs({
        tenantId: tenantId.toString(),
        projectName,
        appName,
        startTime,
        endTime,
        ...args,
        filterBy: generateFilter([getFilterParameters(filterBy, extraFilterBy)])
      })
    },
    [appName, dateRangeStrings, projectName, searchAllValue, tenantId]
  )

  const [terminalCommandLogState, terminalCommandsLogsFn] = useAsyncIntervalFn(fetchFn, {
    enableIntervalCallback: true
  })
  const { handleTableChange, pagination, refresh } = useAntdTable({ fetchFn: terminalCommandsLogsFn })

  const { data, totalCount } = terminalCommandLogState.value || {}

  const showReplayModal = (record: ITerminalCommandLog) => {
    setSelectedPlay(record.sessionId)
    setSelectedTime(record.time)
  }
  const handleCancel = () => {
    setSelectedPlay('')
    setSelectedTime('')
  }

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchAllVal(value)
  }, [])

  const handleDateRangeChange = (date: [moment.Moment, moment.Moment], dateRange: [string, string]) => {
    if (!dateRange.includes('')) {
      setDateRangeStrings([localTimeToUTC(dateRange[0]), localTimeToUTC(dateRange[1])])
    } else {
      setDateRangeStrings(dateRange)
    }
  }
  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    throttledRefresh()
  }, [throttledRefresh, searchAllValue, dateRangeStrings])

  const columns: ColumnsType<ITerminalCommandLog> = [
    {
      title: 'Operator',
      dataIndex: 'operator',
      key: 'operator'
    },
    {
      title: 'Node',
      dataIndex: 'nodeName',
      key: 'nodeName',
      render: (name: string, record) => (
        <StyledDiv>
          <Text>{name}</Text>
          <IPText>Node IP:{record.nodeIP}</IPText>
        </StyledDiv>
      )
    },
    {
      title: 'Pod',
      dataIndex: 'podName',
      key: 'podName',
      render: (name: string, record) => (
        <StyledDiv>
          <Text>{name}</Text>
          <IPText>Pod IP:{record.podIP}</IPText>
        </StyledDiv>
      )
    },
    {
      title: 'Container',
      dataIndex: 'container',
      key: 'container'
    },
    {
      title: 'Command',
      dataIndex: 'detail',
      key: 'detail'
    },
    {
      title: 'Create Time',
      dataIndex: 'time',
      sorter: true,
      key: 'time',
      render: (time: string) => <div style={{ whiteSpace: 'nowrap' }}>{formatTime(time)}</div>
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: unknown, record) => (
        <>
          <StyledButton
            type='link'
            onClick={() => showReplayModal(record)}
            disabled={!(record.sessionId && record.time)}
          >
            Replay
          </StyledButton>
        </>
      )
    }
  ]

  return (
    <>
      <Filters>
        <StyledInput
          allowClear
          value={searchAllValue}
          placeholder='Search...'
          suffix={<SearchOutlined />}
          onChange={event => handleSearchChange(event.target.value)}
        />
        <RangePicker onChange={handleDateRangeChange} defaultValue={[TODAY_ZERO_TIME, moment()]} />
      </Filters>
      <Table
        columns={columns}
        dataSource={data}
        loading={terminalCommandLogState.loading}
        onChange={handleTableChange}
        locale={{ emptyText: <Empty type='NO_APP' description='No Record Found' /> }}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          total: totalCount
        }}
      />
      {selectedPlay && selectedTime && <ReplayModal application={application} onCancel={handleCancel} />}
    </>
  )
}

export default Command
