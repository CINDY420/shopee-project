import * as React from 'react'
import { VerticalDivider } from 'common-styles/divider'
import { SearchOutlined } from 'infra-design-icons'
import { Table } from 'common-styles/table'
import { ColumnsType } from 'infrad/lib/table'
import { formatTime } from 'helpers/format'
import {
  DeploymentHistoryWrapper,
  Title,
  HeaderWrapper,
  SearchRow,
  StyledInput,
  DeploymentIdDiv,
  StyledParagraph,
  PhaseTag,
  StatusWrapper,
  Cycle,
  TextWrapper
} from 'components/App/ApplicationsManagement/Deployment/DeploymentHistory/style'

import { HEALTHY_TYPES, STATUS_HEALTHY_COLORS_MAP, QUOTA_UNIT } from 'constants/deployment'
import { getFilterUrlParam, getFilterItem, filterTypes, getFilterParameters } from 'helpers/queryParams'
import { generateFilter } from 'helpers/table/generateFilter'
import { IDeploymentHistory } from 'swagger-api/v1/models'
import { deploymentControllerListDeploymentHistory } from 'swagger-api/v1/apis/Deployment'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'
import { throttle } from 'helpers/functionUtils'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { Typography, Popover } from 'infrad'
import { useParams } from 'react-router-dom'

const { Text } = Typography
interface IDeploymentHistoryProps {
  az: string
}

const DeploymentHistory: React.FC<IDeploymentHistoryProps> = ({ az }) => {
  const [searchValue, setSearchValue] = React.useState('')
  const { tenantId, projectName, applicationName: appName, deploymentName: sduName } = useParams<{
    tenantId: string
    projectName: string
    applicationName: string
    name: string
    deploymentName: string
  }>()

  const listDeploymentHistory = React.useCallback(
    args => {
      const { filterBy } = args || {}

      const extraFilterBy = getFilterUrlParam({
        searchValue: getFilterItem('searchValue', searchValue, filterTypes.contain),
        az: getFilterItem('az', az, filterTypes.contain)
      })
      return deploymentControllerListDeploymentHistory({
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

  const [listDeploymentHistoryState, listDeploymentHistoryFn] = useAsyncIntervalFn(listDeploymentHistory, {
    enableIntervalCallback: true
  })

  const { items, totalCount, statusList } = listDeploymentHistoryState.value || {}

  const { handleTableChange, pagination, refresh } = useAntdTable({
    fetchFn: listDeploymentHistoryFn,
    orderDefault: 'updateTime desc'
  })

  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  React.useEffect(() => {
    throttledRefresh()
  }, [throttledRefresh, searchValue])

  const columns: ColumnsType<IDeploymentHistory> = [
    {
      title: 'Deployment Version',
      dataIndex: 'deploymentId',
      key: 'deploymentId',
      render: (deploymentId: string) => {
        const start = deploymentId.split('-')[0]
        const end = deploymentId.split('.')[deploymentId.split('.').length - 1]
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Popover
              content={<StyledParagraph copyable>{deploymentId}</StyledParagraph>}
              trigger='hover'
              getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
            >
              <DeploymentIdDiv>{`${start}-...${end}`}</DeploymentIdDiv>
            </Popover>
          </div>
        )
      }
    },
    {
      title: 'Phase',
      dataIndex: 'phase',
      key: 'phase',
      render: (phase: string) => (
        <div>
          <PhaseTag>{phase}</PhaseTag>
          <VerticalDivider size='2px' />
        </div>
      )
    },
    {
      title: 'Health',
      dataIndex: 'healthyInstances',
      key: 'healthyInstances',
      render: (healthyInstances: string, record) => <div>{`${healthyInstances}/${record.instances}`}</div>
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
      render: (cpu: string) => <div>{`${cpu} ${QUOTA_UNIT.CPU}`}</div>
    },
    {
      title: 'MEM',
      dataIndex: 'memory',
      key: 'memory',
      render: (memory: string) => <div>{`${Number(memory) / 1024} ${QUOTA_UNIT.MEMORY}`}</div>
    },
    {
      title: 'Disk',
      dataIndex: 'disk',
      key: 'disk',
      render: (disk: string) => <div>{`${Number(disk) * 1024} ${QUOTA_UNIT.DISK}`}</div>
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
        return status === 'running' ? (
          <StatusWrapper direction='row'>
            <Cycle
              background={
                record.healthy === HEALTHY_TYPES.HEALTHY
                  ? STATUS_HEALTHY_COLORS_MAP[record.healthy]
                  : STATUS_HEALTHY_COLORS_MAP[record.healthy]
              }
            />
            <TextWrapper direction='row'>
              <Text style={{ textTransform: 'capitalize' }}>{`${status}`}</Text>
              <Text style={{ margin: '0 5px' }}>|</Text>
              <Text style={{ textTransform: 'capitalize' }}>{`${record.healthy}`}</Text>
            </TextWrapper>
          </StatusWrapper>
        ) : (
          <StatusWrapper direction='column'>
            <TextWrapper direction='row'>
              <Cycle background='#D9D9D9' />
              <Text style={{ textTransform: 'capitalize' }}>{`${status}`}</Text>
            </TextWrapper>
            <Text type='secondary'>{`${record.pendingReason}`}</Text>
          </StatusWrapper>
        )
      }
    },
    {
      title: 'Update Time',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (timestamp: string) => formatTime(Number(timestamp))
    }
  ]

  return (
    <>
      <VerticalDivider size='16px' />
      <DeploymentHistoryWrapper>
        <HeaderWrapper>
          <Title>Deployment History</Title>
          <SearchRow>
            <StyledInput
              allowClear
              placeholder='Input Deployment Name...'
              suffix={<SearchOutlined />}
              onChange={event => handleSearchChange(event.target.value)}
            />
          </SearchRow>
        </HeaderWrapper>
        <Table
          rowKey={(record: IDeploymentHistory) => `${record.deploymentId} ${record.phase}`}
          columns={columns}
          dataSource={items}
          loading={listDeploymentHistoryState.loading}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            ...TABLE_PAGINATION_OPTION,
            total: totalCount
          }}
          total={totalCount}
        />
      </DeploymentHistoryWrapper>
    </>
  )
}
export default DeploymentHistory
