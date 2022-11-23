import * as React from 'react'
import { formatTime, localTimeToUTC } from 'helpers/format'
import { ColumnsType } from 'infrad/lib/table'
import { Table } from 'common-styles/table'
import { IListTerminalReplayLogsParam, ITerminalReplayLog } from 'api/types/application/terminalReplayLog'

import { IApplication } from 'api/types/application/application'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { Filters, StyledInput, StyledButton, IPText, StyledDiv, Text } from './style'
import { SearchOutlined } from 'infra-design-icons'
import { Empty, Space, DatePicker } from 'infrad'
import { useQueryParam, StringParam } from 'use-query-params'
import { filterTypes, getFilterItem, getFilterUrlParam } from 'helpers/queryParams'
import { generateFilter } from 'helpers/table/generateFilter'
import { throttle } from 'helpers/functionUtils'
import { TODAY_ZERO_TIME } from 'constants/time'

import moment from 'moment'
import {
  applicationsControllerGetApplicationTerminalCommandReplays,
  applicationsControllerGetApplicationTerminalCommandReplayFileData
} from 'swagger-api/v3/apis/Applications'
import ReplayModal from 'components/App/ApplicationsManagement/ApplicationDetail/TerminalLog/ReplayModal'
const { RangePicker } = DatePicker

interface IReplayProps {
  application: IApplication
}

const Replay: React.FC<IReplayProps> = ({ application }) => {
  const [dateRangeStrings, setDateRangeStrings] = React.useState([
    TODAY_ZERO_TIME.utc().format(),
    moment()
      .utc()
      .format()
  ])
  const [selectedPlay, setSelectedPlay] = useQueryParam('selectedPlay', StringParam)
  const [selectedTime, setSelectedTime] = useQueryParam('selectedTime', StringParam)
  const [searchAllValue, setSearchAllVal] = React.useState('')
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
    (args: IListTerminalReplayLogsParam) => {
      const { filterBy } = args
      const [startTime, endTime] = dateRangeStrings
      const extraFilterBy = getFilterUrlParam({
        all: getFilterItem('all', searchAllValue, filterTypes.contain)
      })

      return applicationsControllerGetApplicationTerminalCommandReplays({
        tenantId,
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

  const [terminalReplayLogState, terminalReplayLogsFn] = useAsyncIntervalFn(fetchFn, {
    enableIntervalCallback: true
  })

  const { handleTableChange, pagination, refresh } = useAntdTable({ fetchFn: terminalReplayLogsFn })

  const { data, totalCount } = terminalReplayLogState.value || {}

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

  const showReplayModal = (record: ITerminalReplayLog) => {
    setSelectedPlay(record.sessionId)
    setSelectedTime(record.time)
  }

  const getGenerateFileName = (terminalReplayData: ITerminalReplayLog) => {
    const generateTimeForFileName = (time: moment.Moment) => `${time.format('YYYYMMDD')}[${time.format('HH_mm_ss')}]`
    const beginTime = moment.utc(terminalReplayData.time).local()

    const endTime = moment
      .utc(terminalReplayData?.time)
      .local()
      .add(terminalReplayData.duration)

    return `${terminalReplayData.operator}${generateTimeForFileName(beginTime)}-${generateTimeForFileName(endTime)}`
  }

  const downloadReplay = (record: ITerminalReplayLog) => {
    applicationsControllerGetApplicationTerminalCommandReplayFileData({
      tenantId,
      projectName,
      appName,
      sessionId: record.sessionId,
      createdTime: record.time
    }).then(res => {
      const fileName = getGenerateFileName(record)
      const blob = new Blob([res.toString()], { type: 'text/plain;charset=UTF-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', `${fileName}.cast`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const handleCancel = () => {
    setSelectedPlay('')
    setSelectedTime('')
  }

  const columns: ColumnsType<ITerminalReplayLog> = [
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
      title: 'Create Time',
      sorter: true,
      dataIndex: 'time',
      key: 'time',
      render: (time: string) => <div style={{ whiteSpace: 'nowrap' }}>{formatTime(time)}</div>
    },
    {
      title: 'Action',
      key: 'Action',
      render: (text: unknown, record) => (
        <Space direction='vertical' size={0}>
          <StyledButton
            type='link'
            onClick={() => showReplayModal(record)}
            disabled={!(record.sessionId && record.time)}
          >
            Replay
          </StyledButton>
          <StyledButton
            type='link'
            onClick={() => downloadReplay(record)}
            disabled={!(record.sessionId && record.time)}
          >
            Download Log
          </StyledButton>
        </Space>
      )
    }
  ]

  return (
    <>
      <Filters>
        <StyledInput
          allowClear
          placeholder='Search...'
          suffix={<SearchOutlined />}
          onChange={event => handleSearchChange(event.target.value)}
        />
        <RangePicker defaultValue={[TODAY_ZERO_TIME, moment()]} onChange={handleDateRangeChange} />
      </Filters>
      <Table
        columns={columns}
        dataSource={data}
        loading={terminalReplayLogState.loading}
        locale={{ emptyText: <Empty type='NO_APP' description='No Record Found' /> }}
        onChange={handleTableChange}
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

export default Replay
