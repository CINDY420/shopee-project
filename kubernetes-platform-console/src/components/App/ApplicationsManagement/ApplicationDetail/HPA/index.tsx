import React, { useCallback, useContext } from 'react'
import {
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Switch,
  Typography,
  TableColumnType,
  message
} from 'infrad'
import { CaretDownOutlined, CaretRightOutlined, DownOutlined } from 'infra-design-icons'
import { formatTime } from 'helpers/format'
import RuleCrudDrawer from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/RuleCrudDrawer'
import { HPA_RULE_DRAWER_TYPE } from 'constants/application'
import Expand from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/TableExpand'
import HPABatchOperations from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/HPABatchOperations'
import { IGetApplicationResponse, IListHPARulesResponse, IHPAWithId, IHpaRules } from 'swagger-api/v1/models'
import useAntdTable from 'hooks/table/useAntdTable'
import {
  hpaControllerListHPARules,
  hpaControllerDeleteHpa,
  hpaControllerDisableHpa,
  hpaControllerEnableHpa
} from 'swagger-api/v1/apis/Hpa'
import useAsyncFn from 'hooks/useAsyncFn'
import { omitBy } from 'lodash'
import CopyRuleModal from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/CopyRuleModal'
import { StyledTable } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/style'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
const { Title } = Typography

export enum HPA_BATCH_ACTIONS {
  ENABLE = 'Batch-Enable',
  DISABLE = 'Batch-Disable',
  DELETE = 'Batch-Delete'
}

enum HPA_ACTIONS {
  EDIT = 'Edit',
  COPY = 'Copy',
  DELETE = 'Delete'
}

const actionDrawerTypeMap = {
  [HPA_ACTIONS.EDIT]: HPA_RULE_DRAWER_TYPE.EDIT
}

export interface IBatchEditingContext {
  isBatchEditing: boolean
  batchEditingType: HPA_BATCH_ACTIONS
  selectedRowKeys: string[]
  selectedRows: IHPAWithId[]
}

interface IProps {
  application: IGetApplicationResponse
}

const HPA: React.FC<IProps> = ({ application }) => {
  const { tenantId, projectName, name } = application
  const accessControlContext = useContext(AccessControlContext)
  const hpaRulesActions = accessControlContext[RESOURCE_TYPE.HPA_RULES] || []
  const canCreateHpaRule = hpaRulesActions.includes(RESOURCE_ACTION.Create)
  const canEditHpaRule = hpaRulesActions.includes(RESOURCE_ACTION.Edit)
  const canDeleteHpaRule = hpaRulesActions.includes(RESOURCE_ACTION.Delete)
  const canCopyHpaRule = hpaRulesActions.includes(RESOURCE_ACTION.COPY)

  const [batchEditingContext, setBatchEditingContext] = React.useState<IBatchEditingContext>({
    isBatchEditing: undefined,
    batchEditingType: undefined,
    selectedRowKeys: [],
    selectedRows: []
  })
  const [copyRuleModalVisible, setCopyRuleModalVisible] = React.useState(false)
  const [copyRuleInitialValues, setCopyRuleInitialValues] = React.useState<IHPAWithId>()

  // hpa drawer crud
  const [drawerVisible, setDrawerVisible] = React.useState(false)
  const [drawerType, setDrawerType] = React.useState<HPA_RULE_DRAWER_TYPE>()
  const [drawerInitialValues, setDrawerInitialValues] = React.useState<IHPAWithId>()
  const handleCreateRuleClick = () => {
    setDrawerType(HPA_RULE_DRAWER_TYPE.CREATE)
    setDrawerVisible(true)
  }

  const handleCrudDrawerClose = () => setDrawerVisible(false)
  const handleCrudDrawerSuccess = () => refresh()

  const batchActions = React.useMemo(
    () => [
      {
        type: HPA_BATCH_ACTIONS.ENABLE,
        disabled: !canEditHpaRule
      },
      {
        type: HPA_BATCH_ACTIONS.DISABLE,
        disabled: !canEditHpaRule
      },
      {
        type: HPA_BATCH_ACTIONS.DELETE,
        disabled: !canDeleteHpaRule
      }
    ],
    [canDeleteHpaRule, canEditHpaRule]
  )

  const shouldDisableBatchActions = batchActions.filter(action => action.disabled).length === batchActions.length

  const actions = React.useMemo(
    () => [
      {
        type: HPA_ACTIONS.EDIT,
        disabled: !canEditHpaRule
      },
      {
        type: HPA_ACTIONS.COPY,
        disabled: !canCopyHpaRule
      },
      {
        type: HPA_ACTIONS.DELETE,
        disabled: !canDeleteHpaRule
      }
    ],
    [canCopyHpaRule, canDeleteHpaRule, canEditHpaRule]
  )

  const { selectedRowKeys, isBatchEditing } = batchEditingContext
  const rowSelection = React.useMemo(
    () => ({
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) =>
        setBatchEditingContext(prevState => ({ ...prevState, selectedRows, selectedRowKeys })),
      preserveSelectedRowKeys: true
    }),
    [selectedRowKeys]
  )

  const handleExitBatchEditing = React.useCallback(
    async () =>
      setBatchEditingContext({
        isBatchEditing: false,
        batchEditingType: undefined,
        selectedRowKeys: [],
        selectedRows: []
      }),
    []
  )

  const listHPARulesWithResource = React.useCallback(
    args => {
      return hpaControllerListHPARules({
        tenantId,
        projectName,
        appName: name,
        ...omitBy(args, arg => arg === '')
      })
    },
    [name, projectName, tenantId]
  )
  const [listHPARulesState, listHPARulesFn] = useAsyncFn<IListHPARulesResponse>(listHPARulesWithResource)
  const { refresh, pagination, handleTableChange } = useAntdTable({ fetchFn: listHPARulesFn })

  const handleToggleStatus = React.useCallback(
    async (status: boolean, payload: IHPAWithId) => {
      const fetchFn = status ? hpaControllerDisableHpa : hpaControllerEnableHpa
      try {
        await fetchFn({
          tenantId,
          projectName,
          appName: name,
          payload: {
            hpas: [payload]
          }
        })
        message.success(`${status ? 'disable' : 'enable'} this HPA rule successful!`)
        refresh()
      } catch (err) {
        err?.message && message.error(err?.message)
      }
    },
    [name, projectName, refresh, tenantId]
  )

  const handleActionClick = React.useCallback((type: HPA_ACTIONS, record: IHPAWithId) => {
    const drawerType = actionDrawerTypeMap[type]
    if (drawerType) {
      setDrawerType(drawerType)
      if (drawerType === HPA_RULE_DRAWER_TYPE.EDIT) {
        setDrawerInitialValues(record)
      }
      setDrawerVisible(true)
    } else {
      if (type === HPA_ACTIONS.COPY) {
        setCopyRuleModalVisible(true)
        setCopyRuleInitialValues(record)
      }
    }
  }, [])

  const handleDeleteHpaRule = useCallback(
    async (record: IHPAWithId) => {
      try {
        await hpaControllerDeleteHpa({
          tenantId,
          projectName,
          appName: name,
          payload: {
            hpas: [record]
          }
        })
        message.success('delete this HPA rule successful!')
        refresh()
      } catch (error) {
        error.message && message.error(error.message)
      }
    },
    [name, projectName, refresh, tenantId]
  )

  const columns: TableColumnType<IHPAWithId>[] = React.useMemo(
    () => [
      {
        title: 'Deployment',
        dataIndex: ['meta', 'sdu'],
        render: name => <Title level={5}>{name}</Title>
      },
      {
        title: 'Az',
        dataIndex: ['meta', 'az']
      },
      {
        title: 'Trigger Rule',
        dataIndex: ['spec', 'rules'],
        render: (rules: IHpaRules) => {
          const { autoscalingRules = [], cronRules = [] } = rules || {}
          return (
            <div>
              {autoscalingRules.length > 0 && <div>AutoScaling</div>}
              {cronRules.length > 0 && <div>Cron</div>}
            </div>
          )
        }
      },
      {
        title: 'Scale Direction',
        render: (_, record) => {
          const { scaleDirection } = record?.spec
          const { scaleUp, scaleDown } = scaleDirection || {}
          return (
            <div>
              {scaleUp?.selected && <div>Scale Up</div>}
              {scaleDown?.selected && <div>Scale Down</div>}
            </div>
          )
        }
      },
      {
        title: 'Updator',
        dataIndex: ['spec', 'updator']
      },
      {
        title: 'Update Time',
        dataIndex: ['spec', 'updatedTime'],
        render: updateTime => formatTime(updateTime * 1000),
        sorter: true
      },
      {
        title: 'Status',
        dataIndex: ['spec', 'status'],
        render: (status: boolean, record) => {
          const title = `Are you sure ${status ? 'disable' : 'enable'} this alert rule?`
          return (
            <Popconfirm
              title={title}
              okText='Yes'
              cancelText='No'
              getPopupContainer={() => document.body}
              onConfirm={() => handleToggleStatus(status, record)}
              disabled={!canEditHpaRule}
            >
              <Switch disabled={!canEditHpaRule} checked={status} />
            </Popconfirm>
          )
        },
        filterMultiple: false,
        filters: [
          { text: 'enable', value: 1 },
          { text: 'disable', value: 0 }
        ]
      },
      {
        title: 'Action',
        render: (_, record) => {
          return (
            <Row gutter={8} wrap={false}>
              {actions.map(action => {
                const { type, disabled } = action
                return (
                  <Col key={type}>
                    <Popconfirm
                      disabled={type !== HPA_ACTIONS.DELETE}
                      title='Are you sure delete this Alert Rule?'
                      okText='Yes'
                      cancelText='No'
                      placement='topRight'
                      getPopupContainer={() => document.body}
                      onConfirm={() => handleDeleteHpaRule(record)}
                    >
                      <Button disabled={disabled} onClick={() => handleActionClick(type, record)} type='link'>
                        {type}
                      </Button>
                    </Popconfirm>
                  </Col>
                )
              })}
            </Row>
          )
        }
      }
    ],
    [actions, canEditHpaRule, handleActionClick, handleDeleteHpaRule, handleToggleStatus]
  )

  const handleChange = React.useCallback(
    (pagination, filters, sorter, extra) => {
      handleTableChange(pagination, { enabled: filters['spec.status'] }, { ...sorter, field: 'updated_at' }, extra)
    },
    [handleTableChange]
  )

  React.useEffect(() => {
    isBatchEditing === false && refresh()
  }, [isBatchEditing, refresh])

  const { loading } = listHPARulesState
  const dataSource = listHPARulesState?.value?.lists || []
  const totalCount = listHPARulesState?.value?.total

  return (
    <>
      <Card style={{ marginTop: '16px' }}>
        <Row wrap={false}>
          <Col span={4}>
            <Title level={3}>HPA Rules List</Title>
          </Col>
          <Col span={10} offset={10}>
            <Row justify='end' gutter={8}>
              <Col>
                <Dropdown
                  placement='bottomCenter'
                  disabled={isBatchEditing || shouldDisableBatchActions}
                  overlay={
                    <Menu>
                      {batchActions.map(action => {
                        const { type, disabled } = action
                        return (
                          <Menu.Item
                            key={type}
                            disabled={disabled}
                            onClick={() =>
                              setBatchEditingContext({
                                isBatchEditing: true,
                                batchEditingType: type,
                                selectedRowKeys: [],
                                selectedRows: []
                              })
                            }
                          >
                            <div style={{ textAlign: 'center' }}>{type}</div>
                          </Menu.Item>
                        )
                      })}
                    </Menu>
                  }
                >
                  <Button style={{ marginLeft: 'auto', marginBottom: '24px' }}>
                    Batch-Action <DownOutlined />
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <Button disabled={!canCreateHpaRule} onClick={handleCreateRuleClick} type='primary'>
                  Create Rule
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <StyledTable
          rowKey='id'
          columns={columns}
          dataSource={dataSource}
          expandable={{
            expandedRowRender: (record: IHPAWithId, _index, _indent, expanded: boolean) =>
              expanded && <Expand record={record} />,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <CaretDownOutlined onClick={e => onExpand(record, e)} />
              ) : (
                <CaretRightOutlined onClick={e => onExpand(record, e)} />
              )
          }}
          rowSelection={isBatchEditing && rowSelection}
          loading={loading}
          onChange={handleChange}
          pagination={{
            ...pagination,
            ...TABLE_PAGINATION_OPTION,
            total: totalCount
          }}
        />
      </Card>
      <RuleCrudDrawer
        visible={drawerVisible}
        onClose={handleCrudDrawerClose}
        onSuccess={handleCrudDrawerSuccess}
        crudType={drawerType}
        initialValues={drawerInitialValues}
      />
      {copyRuleModalVisible && (
        <CopyRuleModal
          visible={copyRuleModalVisible}
          initialValues={copyRuleInitialValues}
          onClose={() => setCopyRuleModalVisible(false)}
          onSuccess={() => refresh()}
        />
      )}
      <HPABatchOperations
        batchEditingContext={batchEditingContext}
        onCancel={handleExitBatchEditing}
        onSuccess={() => {
          handleExitBatchEditing().then(() => refresh())
        }}
        application={application}
      />
    </>
  )
}

export default HPA
