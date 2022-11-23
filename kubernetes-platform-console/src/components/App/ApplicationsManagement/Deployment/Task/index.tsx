import * as React from 'react'
import { Typography, Popover } from 'infrad'
import { SearchOutlined } from 'infra-design-icons'
import { VerticalDivider } from 'common-styles/divider'

import {
  TaskListWrapper,
  Title,
  HeaderWrapper,
  SearchRow,
  StyledInput,
  StyledTypographyText,
  QuotaDiv,
  StyledProgress,
  StatusWrapper,
  TextWrapper,
  StyledTag,
  StyledParagraph,
  TaskNameDiv,
  Cycle
} from 'components/App/ApplicationsManagement/Deployment/Task/style'
import { deploymentControllerListTasks } from 'swagger-api/v1/apis/Deployment'
import { getFilterUrlParam, getFilterItem, filterTypes, getFilterParameters } from 'helpers/queryParams'
import { generateFilter } from 'helpers/table/generateFilter'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { throttle } from 'helpers/functionUtils'
import useAntdTable from 'hooks/table/useAntdTable'
import { NoLimitResourceText } from 'helpers/deploy'
import { IUsage, ITask } from 'swagger-api/v1/models'
import { ColumnsType } from 'infrad/lib/table'
import { Table } from 'common-styles/table'
import { formatTime } from 'helpers/format'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { HEALTHY_TYPES, STATUS_TYPES, STATUS_HEALTHY_COLORS_MAP, QUOTA_UNIT } from 'constants/deployment'
import { useParams } from 'react-router-dom'

const { Paragraph, Text } = Typography
interface ITaskProps {
  az: string
}

const renderProgress = (usage: IUsage, unit: string) => {
  if (!usage) {
    return <div>no data</div>
  } else {
    const { used, applied } = usage
    const isValid = isFinite(used / applied)
    const percent = isValid ? Math.floor((used / applied) * 100) : 0

    const formatFn = (num: number) =>
      unit === QUOTA_UNIT.CPU ? num.toFixed(2) : (num / (1024 * 1024 * 1024)).toFixed(2)

    const titleText =
      applied === 0 ? `${used} / ${NoLimitResourceText}` : `${formatFn(used)}/${formatFn(applied)} ${unit}`

    return (
      <div style={{ whiteSpace: 'nowrap' }}>
        <QuotaDiv>{titleText}</QuotaDiv>
        <VerticalDivider size='8px' />
        <StyledProgress
          percent={percent}
          format={percent => `${percent > 500 ? '>500' : percent}%`}
          style={{ width: '100px' }}
        />
      </div>
    )
  }
}

const Task: React.FC<ITaskProps> = ({ az }) => {
  const [searchValue, setSearchValue] = React.useState('')
  const { tenantId, projectName, applicationName: appName, deploymentName: sduName } = useParams<{
    tenantId: string
    projectName: string
    applicationName: string
    name: string
    deploymentName: string
  }>()

  const listTasks = React.useCallback(
    args => {
      const { filterBy } = args || {}

      const extraFilterBy = getFilterUrlParam({
        searchValue: getFilterItem('searchValue', searchValue, filterTypes.contain),
        az: getFilterItem('az', az, filterTypes.contain)
      })

      return deploymentControllerListTasks({
        ...args,
        tenantId,
        projectName,
        appName,
        sduName,
        filterBy: generateFilter([getFilterParameters(filterBy, extraFilterBy)])
      })
    },
    [appName, az, projectName, sduName, searchValue, tenantId]
  )

  const [listTasksState, listTasksFn] = useAsyncIntervalFn(listTasks, {
    enableIntervalCallback: true
  })

  const { items, totalCount, statusList } = listTasksState.value || {}

  const { handleTableChange, pagination, refresh } = useAntdTable({
    fetchFn: listTasksFn,
    orderDefault: 'createTime desc'
  })

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    throttledRefresh()
  }, [throttledRefresh, searchValue])

  const columns: ColumnsType<ITask> = [
    {
      title: 'Task',
      dataIndex: 'id',
      key: 'id',
      render: (id: string, record) => {
        const start = id.split('.')[0]
        const end = id.split('.')[id.split('.').length - 1]
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Popover
              content={<StyledParagraph copyable>{id}</StyledParagraph>}
              trigger='hover'
              getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
            >
              <TaskNameDiv style={{ fontSize: '14px', fontWeight: 500 }}>{`${start}...${end}`}</TaskNameDiv>
            </Popover>
            <StyledTypographyText type='secondary'>
              <VerticalDivider size='8px' />
              <div>
                Address: <Paragraph copyable>{record.address}</Paragraph>
              </div>
              <VerticalDivider size='4px' />
              <div>
                Host: <Paragraph copyable>{record.host}</Paragraph>
              </div>
            </StyledTypographyText>
          </div>
        )
      }
    },
    {
      title: 'Container ID',
      dataIndex: 'containerId',
      key: 'containerId',
      render: (containerId: string) => {
        const start = containerId.split(':')[0]
        const end = containerId.slice(-3)
        return (
          <Popover
            content={<StyledParagraph copyable>{containerId}</StyledParagraph>}
            trigger='hover'
            getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
          >
            <Text>{`${start}...${end}`}</Text>
          </Popover>
        )
      }
    },
    {
      title: 'Deployment Version',
      dataIndex: 'deploymentId',
      key: 'deploymentId',
      render: (deploymentId: string) => {
        const start = deploymentId.slice(0, 4)
        const end = deploymentId.split('.')[deploymentId.split('.').length - 1]
        return (
          <Popover
            content={<StyledParagraph copyable>{deploymentId}</StyledParagraph>}
            trigger='hover'
            getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
          >
            <StyledTag>{`${start}...${end}`}</StyledTag>
          </Popover>
        )
      }
    },
    {
      title: 'CPU Usage',
      dataIndex: 'cpu',
      key: 'cpu',
      render: (cpu: IUsage) => renderProgress(cpu, QUOTA_UNIT.CPU)
    },
    {
      title: 'MEM Usage',
      dataIndex: 'memory',
      key: 'memory',
      render: (memory: IUsage) => renderProgress(memory, QUOTA_UNIT.MEMORY)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: (statusList || []).map(status => ({
        text: status,
        value: status
      })),
      render: (status: string, record) => {
        return status === STATUS_TYPES.RUNNING ? (
          <StatusWrapper>
            <Cycle
              background={
                record.health === HEALTHY_TYPES.HEALTHY
                  ? STATUS_HEALTHY_COLORS_MAP[record.health]
                  : STATUS_HEALTHY_COLORS_MAP[record.health]
              }
            ></Cycle>
            <TextWrapper>
              <Text style={{ textTransform: 'capitalize' }}>{`${status}`}</Text>
              <Text style={{ margin: '0 4px' }}>|</Text>
              <Text style={{ textTransform: 'capitalize' }}>{`${record.health}`}</Text>
            </TextWrapper>
          </StatusWrapper>
        ) : (
          <StatusWrapper>
            <Cycle background='#D9D9D9'></Cycle>
            <TextWrapper>
              <Text style={{ textTransform: 'capitalize' }}>{`${status}`}</Text>
            </TextWrapper>
          </StatusWrapper>
        )
      }
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (timestamp: string) => formatTime(Number(timestamp))
    }
  ]

  return (
    <>
      <VerticalDivider size='16px' />
      <TaskListWrapper>
        <HeaderWrapper>
          <Title>Task List</Title>
          <SearchRow>
            <StyledInput
              allowClear
              placeholder='Search Task Name/IP...'
              suffix={<SearchOutlined />}
              onChange={event => handleSearchChange(event.target.value)}
            />
          </SearchRow>
        </HeaderWrapper>
        <Table
          rowKey={(record: ITask) => `${record.id} ${record.containerId}`}
          columns={columns}
          dataSource={items}
          loading={listTasksState.loading}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            ...TABLE_PAGINATION_OPTION,
            total: totalCount
          }}
        />
      </TaskListWrapper>
    </>
  )
}

export default Task
