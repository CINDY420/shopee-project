import * as React from 'react'
import { Badge, Button, Dropdown, Menu, Tag, Space } from 'infrad'
import { ColumnsType, TablePaginationConfig, TableProps } from 'infrad/lib/table'
import { RenderExpandIconProps } from 'rc-table/lib/interface'
import {
  STATUS,
  STATUS_DISPLAY_NAME,
  STATUS_TAG_COLOR,
  STATUS_PRIORITY_MAP,
  SduActionTypes,
} from 'src/constants/container'
import { TABLE_PAGINATION_OPTION } from 'src/constants/pagination'
import {
  generateBromoMonitorPlatformUrl,
  generateLogPlatformUrl,
  generateOAMMonitorPlatformUrl,
} from 'src/helpers/generateLinks'
import {
  ButtonGroups,
  LinkButton,
  StyledSduTable,
  SduMeta,
  StateTag,
  StateReason,
  PhaseTag,
} from 'src/components/Container/SduTable/style'
import { IModels } from 'src/rapper/request'
import moment from 'moment'
import LogSvg from 'src/assets/log.svg'
import GrafanaSvg from 'src/assets/grafana.svg'
import JenkinsSvg from 'src/assets/jenkins.svg'
import { useHistory } from 'react-router-dom'
import { ITriangleDown, IArrowDown } from 'infra-design-icons'
import { COMPONENT_TYPE, DEPLOY_ENGINE } from 'src/constants/deployment'
import constants from 'src/sharedModules/cmdb/constants'
import { buildRoute } from 'src/helpers/buildRoute'
import ScaleSdu from 'src/components/Container/Action/Scale'
import ActionModal from 'src/components/Container/Action'
import hooks from 'src/sharedModules/cmdb/hooks'
import { sortBy } from 'lodash'

const { routes } = constants
const { useSelectedService } = hooks

export type Sdu = IModels['GET/api/ecp-cmdb/services/{serviceName}/sdus']['Res']['items'][0]
type Deployment = Sdu['deployments'][0] & { sduIndex?: number }
type TableItem = Sdu | Deployment

interface ISduTableProps {
  tableProps: {
    [key: string]: unknown
    dataSource: Sdu[]
    loading: boolean
    onChange: TableProps<Sdu[]>['onChange']
    pagination: TablePaginationConfig
  }
  loading: boolean
  onRefresh: () => void
}

export const EMPTY_PLACEHOLDER = '-'

const isSdu = (record: TableItem): record is Sdu => (record as Sdu)?.sduId !== undefined

const SduTable: React.FC<ISduTableProps> = (props) => {
  const { tableProps, loading, onRefresh } = props
  const { dataSource, pagination } = tableProps
  const [sduScaleModalVisible, setSduScaleModalVisible] = React.useState(false)
  const [scaleSdu, setScaleSdu] = React.useState<Sdu>()
  const [sduActionModalVisible, setSduActionModalVisible] = React.useState(false)
  const [sduActionTypes, setSduActionTypes] = React.useState<SduActionTypes>()
  const [sduActionInitialValues, setSduActionInitialValues] = React.useState<Sdu>()

  const sduData = React.useMemo(() => {
    const sduData = dataSource.map((item, index) => {
      const { deployments } = item
      return {
        ...item,
        deployments:
          deployments.length === 0
            ? null
            : deployments.map((deploy) => ({
                ...deploy,
                sduIndex: index,
              })),
      }
    })
    return sduData
  }, [dataSource])

  const { selectedService } = useSelectedService()
  const { path: serviceName } = selectedService

  const history = useHistory()

  const handleScaleSdu = (sdu: Sdu) => {
    setSduScaleModalVisible(true)
    setScaleSdu(sdu)
  }

  const handleActionClick = (record: Sdu, action: SduActionTypes) => {
    setSduActionTypes(action)
    setSduActionInitialValues(record)
    setSduActionModalVisible(true)
  }

  const handleSduActionModalClose = () => setSduActionModalVisible(false)
  const handleSduActionModalSuccess = () => onRefresh()

  const displayStatusTag = (
    deployment: Deployment,
    state: string,
    countUnhealthyInstances?: number,
  ) => {
    const { summary } = deployment || {}
    const { unhealthyInstances } = summary || {}
    const isUnhealthy = state === STATUS.UNHEALTHY || state === STATUS.ABNORMAL
    return (
      <StateTag>
        {state && <Tag color={STATUS_TAG_COLOR[state]}>{STATUS_DISPLAY_NAME[state]}</Tag>}
        {isUnhealthy && <Badge count={countUnhealthyInstances ?? unhealthyInstances} />}
      </StateTag>
    )
  }

  const getDeploymentStatus = (deployment: Deployment, state: string) => (
    <>
      {state && displayStatusTag(deployment, state)}
      {deployment?.status?.reason && <StateReason>{deployment?.status?.reason}</StateReason>}
    </>
  )

  const getSduDeploymentsStatus = (deployments: Deployment[], unhealthyState: string) => {
    const filteredDeployments = deployments?.filter((item) => Boolean(item?.summary?.state))
    const sortedDeployments = sortBy(filteredDeployments, (item) =>
      STATUS_PRIORITY_MAP.indexOf(item?.summary?.state),
    )
    const highestPriorityDeployment = sortedDeployments[0]
    let unhealthyInstances = 0
    if (highestPriorityDeployment?.summary?.state === unhealthyState) {
      const unhealthyDeployments = deployments.filter(
        (item) => item?.summary?.state === unhealthyState,
      )
      unhealthyInstances = unhealthyDeployments.reduce(
        (prev, cur) => prev + cur?.summary?.unhealthyInstances,
        0,
      )
    }
    return {
      highestPriorityDeployment,
      unhealthyInstances,
    }
  }

  const getSduStatus = (record: Sdu) => {
    const { deployments } = record
    const bromoDeployments = deployments?.filter(
      (item) => item.deployEngine === DEPLOY_ENGINE.BROMO,
    )
    const oamDeployments = deployments?.filter((item) => item.deployEngine === DEPLOY_ENGINE.OAM)

    const {
      highestPriorityDeployment: bromoHighestPriorityDeployment,
      unhealthyInstances: bromoUnhealthyInstances,
    } = getSduDeploymentsStatus(bromoDeployments, STATUS.UNHEALTHY)
    const {
      highestPriorityDeployment: oamHighestPriorityDeployment,
      unhealthyInstances: oamUnhealthyInstances,
    } = getSduDeploymentsStatus(oamDeployments, STATUS.ABNORMAL)
    const { summary: bromoHighestPriorityDeploymentSummary } = bromoHighestPriorityDeployment || {}
    const { summary: oamHighestPriorityDeploymentSummary } = oamHighestPriorityDeployment || {}

    if (
      bromoHighestPriorityDeploymentSummary?.state === oamHighestPriorityDeploymentSummary?.state &&
      bromoHighestPriorityDeploymentSummary?.unhealthyInstances ===
        oamHighestPriorityDeploymentSummary?.unhealthyInstances
    ) {
      return (
        bromoDeployments?.length > 0 &&
        displayStatusTag(
          bromoHighestPriorityDeployment,
          bromoHighestPriorityDeploymentSummary?.state,
          bromoUnhealthyInstances,
        )
      )
    }

    return (
      <Space direction="vertical" size={10}>
        {bromoDeployments?.length > 0 &&
          displayStatusTag(
            bromoHighestPriorityDeployment,
            bromoHighestPriorityDeploymentSummary?.state,
            bromoUnhealthyInstances,
          )}
        {oamDeployments?.length > 0 &&
          displayStatusTag(
            oamHighestPriorityDeployment,
            oamHighestPriorityDeploymentSummary?.state,
            oamUnhealthyInstances,
          )}
      </Space>
    )
  }

  const linkToDeploymentDetail = (record: Deployment) => {
    const sdu = sduData[record.sduIndex]
    const isBromoDeploy = record.deployEngine === DEPLOY_ENGINE.BROMO
    const bromoDeployDetailRoutePath = buildRoute(routes.SERVICE_SDU_DETAIL, {
      serviceName,
      sduName: record.sduName,
    })
    const bromoDeployDetailRoutePathWithQuery = `${bromoDeployDetailRoutePath}?resource_type=${sdu.resourceType.toUpperCase()}&cid=${
      sdu.cid
    }&env=${sdu.env}`
    const OAMDeployDetailRoutePath = buildRoute(routes.SERVICE_DEPLOY_DETAIL, {
      serviceName,
      sduName: record.sduName,
      deployId: record.deployId,
    })
    const deployDetailRoutePath = isBromoDeploy
      ? bromoDeployDetailRoutePathWithQuery
      : OAMDeployDetailRoutePath
    history.push(deployDetailRoutePath)
  }

  const columns: ColumnsType<TableItem> = [
    {
      title: <div style={{ marginLeft: 24 }}>SDU Name</div>,
      dataIndex: 'sdu',
      key: 'sdu',
      className: 'sduName',
      render: (sdu: string, record) => {
        if (isSdu(record)) {
          return (
            <SduMeta>
              {sdu}
              <div>
                project: {record?.identifier?.project || EMPTY_PLACEHOLDER} module:{' '}
                {record?.identifier?.module || EMPTY_PLACEHOLDER}
              </div>
            </SduMeta>
          )
        }
        return null
      },
    },
    {
      title: 'AZ',
      dataIndex: 'azV1',
      key: 'azV1',
      render: (az: string, record) => {
        if (!isSdu(record)) {
          return <div style={{ cursor: 'pointer' }}>{az || EMPTY_PLACEHOLDER}</div>
        }
        return null
      },
    },
    {
      title: 'Cluster/Orchestrator',
      dataIndex: 'cluster',
      key: 'cluster',
      render: (cluster: string, record) => {
        if (!isSdu(record)) {
          const { status } = record
          const { orchestrator } = status
          return cluster || orchestrator || EMPTY_PLACEHOLDER
        }
        return null
      },
    },
    {
      title: 'Workload Type',
      dataIndex: 'componentType',
      key: 'componentType',
      filters: Object.values(COMPONENT_TYPE).map((item: string) => ({ text: item, value: item })),
      render: (componentType: string, record) => {
        if (!isSdu(record)) {
          return componentType || EMPTY_PLACEHOLDER
        }
        return null
      },
    },
    {
      title: 'Total Instance',
      dataIndex: ['summary', 'targetInstances'],
      key: 'summary.targetInstances',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: ['summary', 'state'],
      key: 'summary.state',
      filters: Object.entries(STATUS_DISPLAY_NAME).map(([key, value]) => ({
        text: value,
        value: key,
      })),
      render: (state: string, record) => {
        if (!isSdu(record)) {
          return getDeploymentStatus(record, state)
        }
        return getSduStatus(record)
      },
    },
    {
      title: 'CPU',
      dataIndex: ['summary', 'cpu'],
      key: 'summary.cpu',
      sorter: true,
    },
    {
      title: 'MEM(GiB)',
      dataIndex: ['summary', 'mem'],
      key: 'summary.mem',
      sorter: true,
    },
    {
      title: 'Disk(GiB)',
      dataIndex: ['summary', 'disk'],
      key: 'summary.disk',
      sorter: true,
    },
    {
      title: 'Strategy & Tag',
      dataIndex: ['status', 'containers'],
      key: 'containers',
      render: (containers: Deployment['status']['containers'], record) => {
        if (!isSdu(record)) {
          return containers?.map((item) => {
            const { phase = EMPTY_PLACEHOLDER, tag = EMPTY_PLACEHOLDER, name } = item
            return (
              <PhaseTag key={name}>
                {phase} | {tag}
              </PhaseTag>
            )
          })
        }
        return null
      },
    },
    {
      title: 'Update Time',
      dataIndex: ['summary', 'lastDeployed'],
      key: 'summary.lastDeployed',
      sorter: true,
      render: (time: number) =>
        time > 0 ? moment(time * 1000).format('YYYY/MM/DD HH:mm:ss') : EMPTY_PLACEHOLDER,
    },
    {
      title: 'Observability',
      render: (_: unknown, record) => {
        if (!isSdu(record)) {
          const sdu = sduData[record.sduIndex]
          const jenkinsLink = sdu?.deploymentLink
          const isBromoDeployment = record.deployEngine === DEPLOY_ENGINE.BROMO
          return (
            <ButtonGroups>
              <LinkButton
                onClick={(): void => {
                  const url = generateLogPlatformUrl(sdu)
                  window.open(url)
                }}
              >
                <img src={LogSvg} alt="LogPlatform" />
              </LinkButton>
              <LinkButton
                onClick={(): void => {
                  const url = isBromoDeployment
                    ? generateBromoMonitorPlatformUrl(sdu)
                    : generateOAMMonitorPlatformUrl(sdu, record)
                  window.open(url)
                }}
              >
                <img src={GrafanaSvg} alt="Grafana" />
              </LinkButton>
              {jenkinsLink && (
                <LinkButton
                  onClick={(): void => {
                    window.open(jenkinsLink)
                  }}
                >
                  <img src={JenkinsSvg} alt="Jenkins" />
                </LinkButton>
              )}
            </ButtonGroups>
          )
        }
        return null
      },
    },
    {
      title: 'Action',
      render: (_: unknown, record) => {
        if (!isSdu(record)) return

        const menu = (
          <Menu>
            {Object.values(SduActionTypes).map((action) => (
              <Menu.Item
                key={action}
                onClick={() => handleActionClick(record, action)}
                disabled={!record.deployments}
              >
                {action}
              </Menu.Item>
            ))}
          </Menu>
        )

        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="link"
              style={{ padding: '0 16px 0 0' }}
              onClick={() => handleScaleSdu(record)}
              disabled={!record.deployments}
            >
              Scale
            </Button>
            <Dropdown overlay={menu}>
              <Button
                type="link"
                onClick={(e) => e.preventDefault()}
                style={{ whiteSpace: 'nowrap' }}
              >
                More
                <IArrowDown />
              </Button>
            </Dropdown>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <StyledSduTable
        {...tableProps}
        dataSource={sduData}
        columns={columns}
        rowKey={(record: TableItem) => (isSdu(record) ? record.sduId : record.deployId)}
        childrenColumnName="deployments"
        loading={loading}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...pagination,
        }}
        scroll={{ x: '100%' }}
        expandable={{
          expandRowByClick: true,
          expandIcon: ({ expanded, record }: RenderExpandIconProps<TableItem>) => {
            if (isSdu(record) && record?.deployments) {
              return expanded ? (
                <ITriangleDown />
              ) : (
                <ITriangleDown style={{ transform: 'rotate(-90deg)' }} />
              )
            }
            return null
          },
        }}
        onRow={(record: TableItem) => ({
          onClick: () => (isSdu(record) ? null : linkToDeploymentDetail(record)),
        })}
      />
      <ScaleSdu
        modalVisible={sduScaleModalVisible}
        sdu={scaleSdu}
        onModalVisibleChange={setSduScaleModalVisible}
        onRefresh={onRefresh}
      />
      <ActionModal
        visible={sduActionModalVisible}
        onClose={handleSduActionModalClose}
        onSuccess={handleSduActionModalSuccess}
        actionModalType={sduActionTypes}
        initialValues={sduActionInitialValues}
      />
    </>
  )
}

export default SduTable
