import * as React from 'react'
import { Link } from 'react-router-dom'
import { Typography, Space, Dropdown, Button, Menu, Row } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import { TableRowSelection } from 'infrad/lib/table/interface'
import { TRACING_ENV_URL_MAP } from 'constants/routes/external'

import { ExclamationCircleOutlined, CheckCircleOutlined, DownOutlined } from 'infra-design-icons'

import { IAntdTableResult } from 'hooks/table/useAntdTable'
import { IAsyncState } from 'hooks/useAsyncIntervalFn'

import { formatTime, formatDataFromByteToGib, formatFloat } from 'helpers/format'
import { IUsage } from 'api/types/application/pod'
import { IGetPodDetailResponseDto } from 'swagger-api/v3/models'

import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { danger, success } from 'constants/colors'
import { buildPodDetailRoute } from 'constants/routes/routes'
import { NoLimitResourceText } from 'helpers/deploy'

import { Table } from 'common-styles/table'
import { VerticalDivider, HorizontalDivider } from 'common-styles/divider'
import { StatusWrapper, Title, Text, IPText, StyledProgress, StyledButton, StyledTag } from './style'
import { generateLogPlatformLink, generateTracingPlatformLink } from 'helpers/routes'
import { POD_TABLE_CONTEXT, TEST_CLUSTER_NAME } from 'constants/common'

const { Paragraph } = Typography

const STATUS_TEXT_MAP = {
  ContainersNotReady: 'Running | Unhealthy',
  Running: 'Running | Healthy'
}

const renderProgress = (usage: IUsage, unit: string, formatFn: any) => {
  const { used, applied } = usage
  const isValid = isFinite(used / applied)
  const percent = Math.floor((isValid ? used / applied : 0) * 100)
  const titleText =
    applied === 0 ? `${formatFn(used)} / ${NoLimitResourceText}` : `${formatFn(used)}/${formatFn(applied)} ${unit}`

  return (
    <>
      <Title>{titleText}</Title>
      <VerticalDivider size='8px' />
      <StyledProgress percent={percent} format={percent => `${percent > 500 ? '>500' : percent}%`} />
    </>
  )
}

interface IPodTableProps {
  deployName?: string
  listPodsState: IAsyncState<any>
  useAntdTableResult: IAntdTableResult<any>
  rowSelection?: TableRowSelection<any>
  isBatchEditing?: boolean
  onDeletePod?: (pod: IGetPodDetailResponseDto) => void
  onCreatePodProfile?: (pod: IGetPodDetailResponseDto) => void
  hasKillPodPermission?: boolean
  showPhase?: boolean
  showActions?: boolean
  contextType: POD_TABLE_CONTEXT
  clusterName?: string
}

const PodTable: React.FC<IPodTableProps> = ({
  deployName,
  listPodsState,
  useAntdTableResult,
  rowSelection,
  isBatchEditing,
  onDeletePod,
  hasKillPodPermission,
  showPhase = true,
  showActions = true,
  contextType,
  onCreatePodProfile,
  clusterName
}) => {
  const { pagination, handleTableChange } = useAntdTableResult
  const { pods = [], statusList = [], totalCount: total } = listPodsState.value || {}
  const testCluster = clusterName === TEST_CLUSTER_NAME ? 'TEST' : 'LIVE'
  const tracingUrl = TRACING_ENV_URL_MAP[testCluster]

  const buildPodRoute = (pod: IGetPodDetailResponseDto) => {
    const {
      tenantId,
      projectName,
      appName: applicationName,
      name: podName,
      clusterId: clusterName,
      environment,
      cid
    } = pod

    return buildPodDetailRoute({
      tenantId,
      projectName,
      applicationName,
      deployName:
        deployName || `${applicationName}-${environment && environment.toLowerCase()}-${cid && cid.toLowerCase()}`,
      clusterName,
      podName
    })
  }

  const columns: ColumnsType<IGetPodDetailResponseDto> = [
    {
      title: 'Pod',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: IGetPodDetailResponseDto) => {
        return (
          <>
            <div style={{ display: 'flex' }}>
              {record.tenantId ? (
                <Link to={buildPodRoute(record)}>
                  <Title fontWeight={600}>{name}</Title>
                </Link>
              ) : (
                <Title fontWeight={600}>{name}</Title>
              )}
            </div>
            <VerticalDivider size='8px' />
            <IPText type='secondary'>
              Pod IP: <Paragraph copyable>{record.podIP}</Paragraph>
              {record.nodeIP && (
                <div>
                  Node IP: <Paragraph copyable>{record.nodeIP}</Paragraph>
                </div>
              )}
            </IPText>
          </>
        )
      }
    }
  ]

  if (showPhase) {
    columns.push({
      title: 'Phase',
      dataIndex: 'phase',
      key: 'phase',
      render: (phase: string, record: any) => {
        return (
          <StyledTag>
            <Row>
              {phase}
              {record.containers.map(item => {
                return (
                  <Row key={item.tag}>
                    <HorizontalDivider size='5px' />
                    |
                    <HorizontalDivider size='5px' />
                    {item.tag}
                  </Row>
                )
              })}
            </Row>
          </StyledTag>
        )
      }
    })
  }

  columns.push(
    {
      title: 'Restarts',
      dataIndex: 'restart',
      key: 'restart',
      render: (restart: any): React.ReactNode => (
        <>
          <Title fontWeight={600}>{restart.restartCount}</Title>
          <VerticalDivider size='8px' />
          <IPText type='secondary'>
            {restart.lastRestartTime && <div>Latest: {formatTime(restart.lastRestartTime)}</div>}
          </IPText>
        </>
      )
    },
    {
      title: 'CPU Usage',
      dataIndex: 'cpu',
      key: 'cpu',
      render: (cpu: IUsage) => renderProgress(cpu, 'Cores', formatFloat)
    },
    {
      title: 'MEM Usage',
      dataIndex: 'memory',
      key: 'memory',
      render: (memory: IUsage) => renderProgress(memory, 'GiB', formatDataFromByteToGib)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: (statusList || []).map(status => ({ text: STATUS_TEXT_MAP[status] || status, value: status })),
      render: (status: string) => {
        const text = STATUS_TEXT_MAP[status] || status
        const isHealthy = status === 'Running'

        return (
          <>
            <StatusWrapper color={isHealthy ? success : danger}>
              {isHealthy ? (
                <CheckCircleOutlined style={{ fontSize: '16px', color: success }} />
              ) : (
                <ExclamationCircleOutlined style={{ fontSize: '16px', color: danger }} />
              )}
              <HorizontalDivider size='4px' />
              <span>{isHealthy ? 'Normal' : 'Abnormal'}</span>
            </StatusWrapper>
            <VerticalDivider size='8px' />
            <Text type='secondary'>{text}</Text>
          </>
        )
      }
    },
    {
      title: 'Create Time',
      dataIndex: 'creationTimestamp',
      key: 'creationTimestamp',
      sorter: true,
      render: (timestamp: string) => formatTime(timestamp)
    }
  )

  const MoreButton: React.FC<{ menu: React.ReactElement }> = props => {
    const { menu } = props
    return (
      <Dropdown overlay={menu}>
        <Button type='link'>
          More
          <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
        </Button>
      </Dropdown>
    )
  }

  if (showActions) {
    columns.push({
      title: 'Action',
      render: (record: IGetPodDetailResponseDto) => {
        const { clusterId, projectName, nodeIP, appName, traceId } = record
        const logPlatformLink = generateLogPlatformLink({ clusterId, appName, projectName, nodeIP })
        const tracingPlatformLink = generateTracingPlatformLink({ tracingUrl, traceId })
        const menu = (
          <Menu>
            <Menu.Item key='log'>
              <StyledButton
                type='link'
                href={logPlatformLink}
                target='_blank'
                style={{ color: contextType === POD_TABLE_CONTEXT.DEPLOYMENT ? '#2673DD' : '#b7b7b7' }}
                disabled={contextType !== POD_TABLE_CONTEXT.DEPLOYMENT}
              >
                Log
              </StyledButton>
            </Menu.Item>
            <Menu.Item key='tracing'>
              <StyledButton
                type='link'
                href={tracingPlatformLink}
                target='_blank'
                style={{ color: traceId ? '#2673DD' : '#b7b7b7' }}
                disabled={!traceId}
              >
                Tracing
              </StyledButton>
            </Menu.Item>
            <Menu.Item key='profiling'>
              <StyledButton type='link' onClick={() => onCreatePodProfile && onCreatePodProfile(record)}>
                Profiling
              </StyledButton>
            </Menu.Item>
            <Menu.Item key='kill'>
              <StyledButton
                type='link'
                disabled={isBatchEditing || !hasKillPodPermission}
                onClick={() => onDeletePod(record)}
              >
                Kill
              </StyledButton>
            </Menu.Item>
          </Menu>
        )

        return (
          <Space size={0}>
            <StyledButton
              type='link'
              href={`${buildPodRoute(record)}?selectedTab=Terminal`}
              target='_blank'
              disabled={isBatchEditing}
            >
              Terminal
            </StyledButton>
            <MoreButton menu={menu} />
          </Space>
        )
      }
    })
  }

  return (
    <Table
      rowKey='name'
      loading={listPodsState.loading}
      columns={columns}
      dataSource={pods}
      onChange={handleTableChange}
      rowSelection={isBatchEditing && rowSelection}
      pagination={{
        ...pagination,
        ...TABLE_PAGINATION_OPTION,
        total
      }}
    />
  )
}

export default PodTable
