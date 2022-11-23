import * as React from 'react'
import { Select, Input, Button, Tag, Modal, message } from 'infrad'
import { FormOutlined, DeleteOutlined } from 'infra-design-icons'
import { useRecoilValue } from 'recoil'

import { IServiceInfoV2 } from 'api/types/application/service'
import { servicesControllerGetServiceList, servicesControllerDeleteService } from 'swagger-api/v3/apis/Services'
import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

import { filterTypes, getFilterItem, getFilterUrlParam } from 'helpers/queryParams'
import { throttle } from 'helpers/functionUtils'

import { selectedGatewayProject } from 'states/gatewayState/project'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'

import { Table } from 'common-styles/table'
import { HorizontalDivider, VerticalDivider } from 'common-styles/divider'
import PortCell from './PortCell'
import ServiceEditor from './ServiceEditor'
import PointModal from './PointModal'

import {
  ServerListWrapper,
  HeaderWrapper,
  LeftWrapper,
  ClusterLabel,
  ClusterSelectWrapper,
  RightWrapper,
  SearchWrapper,
  Title,
  Text,
  EndpointsWrapper,
  StyledButton
} from './style'

const Option = Select.Option

const ServerList: React.FC = props => {
  const [name, setName] = React.useState('')
  const [cluster, setCluster] = React.useState<string[]>([])
  const [serviceEditorVisible, setServiceEditorVisible] = React.useState(false)
  const [pointModalVisible, setPointModalVisible] = React.useState(false)
  const [endPoints, setEndPoints] = React.useState([])
  const [service, setService] = React.useState<IServiceInfoV2>(null)
  const project = useRecoilValue(selectedGatewayProject)
  const {
    tenantId,
    name: projectName,
    envs = [],
    cids = [],
    types = ['ClusterIP', 'ExternalName'],
    simpleClusters: clusters = []
  } = project || {}
  const ref = React.useRef(null)

  const accessControlContext = React.useContext(AccessControlContext)
  const serviceActions = accessControlContext[RESOURCE_TYPE.SERVICE] || []
  const canCreateService = serviceActions.includes(RESOURCE_ACTION.Create)
  const canEditService = serviceActions.includes(RESOURCE_ACTION.Edit)
  const canDeleteService = serviceActions.includes(RESOURCE_ACTION.Delete)

  const listServicesFnWithResource = React.useCallback(
    args => {
      const { filterBy } = args || {}
      const extraFilterBy = getFilterUrlParam({
        cluster: getFilterItem('clusterName', cluster, filterTypes.equal),
        name: getFilterItem('name', name, filterTypes.contain)
      })

      return servicesControllerGetServiceList({
        tenantId,
        project: projectName,
        ...args,
        filterBy: filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy
      })
    },
    [cluster, name, tenantId, projectName]
  )

  const [listServicesState, listServicesFn] = useAsyncIntervalFn(listServicesFnWithResource)

  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listServicesFn })

  const handleClusterChange = (value: string[]) => {
    setCluster(value)
  }

  const handleSearchChange = React.useCallback(
    e => {
      const value = e.target.value
      setName(value)
    },
    [setName]
  )

  const columns = [
    {
      title: 'Service Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record: any) => {
        return (
          <>
            <Title weight={500}>{`${record.name}`}</Title>
            <VerticalDivider size='8px' />
            <Text>{`Cluster:${record.clusterName}`}</Text>
          </>
        )
      }
    },
    {
      title: 'Environment',
      dataIndex: 'env',
      key: 'env',
      filters: envs.map((item: string) => ({ text: item, value: item })),
      render: (_, record: any) => <Title>{record.env || '--'}</Title>
    },
    {
      title: 'CID',
      dataIndex: 'cid',
      key: 'cid',
      filters: cids.map((item: string) => ({ text: item, value: item })),
      render: (cid: string) => <Title>{cid || '--'}</Title>
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: types.map((item: string) => ({ text: item, value: item })),
      width: 140,
      render: (type: string) => <Title>{type || '--'}</Title>
    },
    {
      title: 'Ports',
      dataIndex: 'portInfos',
      key: 'portInfos',
      width: 232,
      render: (portInfos: any[]) => (portInfos.length ? <PortCell ports={portInfos} /> : '--')
    },
    {
      title: 'Endpoints',
      dataIndex: 'endPoints',
      key: 'endPoints',
      width: 180,
      render: (endPoints: string[]) => {
        const length = endPoints.length
        const showList = endPoints.slice(0, 3)

        return length ? (
          <EndpointsWrapper>
            <div>
              {showList.map((item: string, index: number) => (
                <Tag key={`${item}-${index}`} style={{ marginBottom: '8px' }}>
                  {item}
                </Tag>
              ))}
            </div>
            {length > 3 && (
              <Title
                style={{ cursor: 'default' }}
                onClick={() => {
                  setPointModalVisible(true)
                  setEndPoints(endPoints)
                }}
              >
                ...
              </Title>
            )}
          </EndpointsWrapper>
        ) : (
          '--'
        )
      }
    },
    {
      title: 'External IP',
      dataIndex: 'externalIp',
      key: 'externalIp',
      render: (externalIp: string) => <Title style={{ maxWidth: '220px' }}>{externalIp || '--'}</Title>
    },
    {
      title: 'Cluster IP',
      dataIndex: 'clusterIp',
      key: 'clusterIp',
      render: (clusterIp: string) => <Title>{clusterIp && clusterIp !== 'None' ? clusterIp : '--'}</Title>
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (_, record: any) => (
        <>
          <StyledButton
            type='link'
            icon={<FormOutlined />}
            onClick={e => {
              setServiceEditorVisible(true)
              setService(record)
            }}
            disabled={!canEditService || record.platform === 'false'}
          >
            Edit
          </StyledButton>
          <VerticalDivider size='6px' />
          <StyledButton
            type='link'
            icon={<DeleteOutlined />}
            onClick={() => {
              const { name, clusterName } = record

              Modal.confirm({
                title: `Do you want to delete the service '${name}'?`,
                content: "This operation can't be recovered",
                okText: 'Confirm',
                onOk: async () => {
                  try {
                    await servicesControllerDeleteService({
                      tenantId,
                      project: projectName,
                      svc: name,
                      cluster: clusterName
                    })

                    message.success(`Successfully deleted service ${name}`)

                    const { current, pageSize } = pagination
                    const num = pageSize * (current - 1)

                    if (current > 1 && num === totalCount - 1) {
                      refresh(false, { ...pagination, current: current - 1 })
                    } else {
                      refresh(false)
                    }
                  } catch (err) {
                    console.error('error: ', err)
                    message.error(err.message)
                  }
                }
              })
            }}
            disabled={!canDeleteService || record.platform === 'false'}
          >
            Delete
          </StyledButton>
        </>
      )
    }
  ]

  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    throttledRefresh()
  }, [cluster, name, throttledRefresh])

  const { value, loading } = listServicesState
  const { svcs = [], totalCount } = value || {}

  return (
    <ServerListWrapper ref={ref}>
      <HeaderWrapper>
        <LeftWrapper>
          <ClusterLabel>Cluster</ClusterLabel>
          <HorizontalDivider size='8px' />
          <ClusterSelectWrapper>
            <Select
              allowClear
              showArrow
              mode='multiple'
              placeholder='Select...'
              onChange={handleClusterChange}
              style={{ width: '100%' }}
              getPopupContainer={() => ref.current}
            >
              {clusters.map(item => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </ClusterSelectWrapper>
        </LeftWrapper>
        <RightWrapper>
          <SearchWrapper>
            <Input allowClear placeholder='Search...' onChange={handleSearchChange} />
          </SearchWrapper>
          <HorizontalDivider size='24px' />
          {canCreateService && (
            <Button type='primary' onClick={() => setServiceEditorVisible(true)} disabled={!canCreateService}>
              Create Service
            </Button>
          )}
        </RightWrapper>
      </HeaderWrapper>
      <VerticalDivider size='24px' />
      <Table
        rowKey={(record: any) => `${record.name}-${record.clusterName}-${record.env}-${record.cid}`}
        columns={columns}
        loading={loading}
        dataSource={svcs}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          total: totalCount
        }}
        getPopupContainer={triggerNode => triggerNode}
        tableLayout='fixed'
      />
      {serviceEditorVisible && (
        <ServiceEditor
          visible={serviceEditorVisible}
          onChangeVisible={visible => {
            setServiceEditorVisible(visible)
            visible === false && setService(null)
          }}
          baseInfo={{ tenantId, projectName, service, envs, cids }}
          onCallback={() => {
            refresh(false)
            setService(null)
          }}
          isEdit={!!service}
        />
      )}
      {pointModalVisible && (
        <PointModal visible={pointModalVisible} endPoints={endPoints} onCancel={() => setPointModalVisible(false)} />
      )}
    </ServerListWrapper>
  )
}

export default ServerList
