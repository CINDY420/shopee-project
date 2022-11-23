import * as React from 'react'
import { Radio, Menu, Dropdown, Button, Space, Select, Checkbox, TableColumnType, Badge } from 'infrad'
import { DownOutlined, IArrowDown } from 'infra-design-icons'

import { Table } from 'common-styles/table'
import {
  DEPLOYMENT_ACTIONS,
  HEALTHY_TYPES,
  DEPLOYMENT_STATUS,
  AZ_TYPE_QUERY_KEY,
  AZ_QUERY_KEY,
  AZ_TYPE,
  RELEASE_OR_CANARY_PHASES,
  LEAP_CLUSTER_ID,
  COMPONENT_QUERY_KEY
} from 'constants/deployment'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { AccessControlContext } from 'hooks/useAccessControl'
import { GlobalContext } from 'hocs/useGlobalContext'

import { sduControllerListSdus } from 'swagger-api/v1/apis/SDU'
import { IListSdusResponse, IGetApplicationResponse } from 'swagger-api/v1/models'
import PromptCreator from 'components/Common/PromptCreator'
import { filterTypes, getFilterItem, getFilterUrlParam } from 'helpers/queryParams'

import { formatTime } from 'helpers/format'

import {
  getDispatchers,
  ApplicationContext,
  EDIT_TYPES
} from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/useApplicationContext'

import DeploymentSingleOperations from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations'
import DeploymentBatchOperations from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentBatchOperations'
import { RESOURCE_TYPE, RESOURCE_ACTION, TENANT_DEVELOPER_ID } from 'constants/accessControl'

import {
  OperationWrapper,
  Operation,
  Filters,
  OperationsWrapper,
  OperationItem,
  NoWrapDiv,
  LabelText,
  FlexDiv,
  PhaseWrapper,
  SplitLine,
  CircleText,
  BorderedLink,
  PhaseContainer
} from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/style'

import logSvg from 'assets/log.svg'
import monitorSvg from 'assets/monitoring.svg'

import {
  transformSdusToSpannedAzs,
  ISpannedAz,
  doesElementHasClass,
  sortEnvs
} from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/helper'

import { HorizontalDivider } from 'common-styles/divider'
import { buildDeployDetailRoute } from 'constants/routes/routes'
import history from 'helpers/history'
import { generateLogPlatformLink, generateMonitoringPlatformLink } from 'helpers/routes'

const DISABLE_ROW_LINK_CLASS = 'disable-row-link'
const ALL_ENVIRONMENTS_VALUE = 'All'
const { Prompt } = PromptCreator({
  content: "The changes you made to the deploy haven't been saved."
})

const generateSelectOptions = (values: string[]) => {
  return values.map(value => ({
    label: value,
    value
  }))
}

const leapStatusStyleMap: Record<string, { color: string; text: string }> = {
  [`${DEPLOYMENT_STATUS.RUNNING}-${HEALTHY_TYPES.HEALTHY}`]: {
    color: '#52C41A',
    text: 'Running | Healthy'
  },
  [`${DEPLOYMENT_STATUS.RUNNING}-${HEALTHY_TYPES.UNHEALTHY}`]: {
    color: '#FF4D4F',
    text: 'Running | Unhealthy'
  }
}

const k8sStatusStyleMap: Record<string, { color: string; text: string }> = {
  [DEPLOYMENT_STATUS.NORMAL]: {
    color: '#52C41A',
    text: 'Normal'
  },
  [DEPLOYMENT_STATUS.ABNORMAL]: {
    color: '#FF4D4F',
    text: 'Abnormal'
  }
}
const renderDeploymentStatus = (record: ISpannedAz) => {
  const { status, healthy, unhealthyCount } = record
  const leapStatusStyle = leapStatusStyleMap[`${status}-${healthy}`]
  const k8sStatusStyle = k8sStatusStyleMap[status]
  const { color = '#D9D9D9', text = status } = leapStatusStyle || k8sStatusStyle || {}
  return (
    <NoWrapDiv>
      <Badge color={color} text={text} style={{ textTransform: 'capitalize' }} />
      {unhealthyCount > 0 && (
        <>
          <HorizontalDivider size='12px' />
          <CircleText>{unhealthyCount}</CircleText>
        </>
      )}
    </NoWrapDiv>
  )
}

interface IDeploymentList {
  application: IGetApplicationResponse
}

enum SDU_CHECKBOX_STATUS {
  ALL,
  PARTIAL,
  NONE
}

const DeploymentList: React.FC<any> = React.forwardRef<HTMLDivElement, IDeploymentList>(({ application }, ref) => {
  const { tenantName, name: appName, tenantId, projectName, cids = [], azs = [] } = application

  const { state, dispatch } = React.useContext(ApplicationContext)
  const { environments, selectedCids, selectedAZs, selectedEnvironment, editingObject, selectedAzComponentType } = state
  const sortedEnvs = sortEnvs(environments)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  const accessControlContext = React.useContext(AccessControlContext)
  const deploymentActions = accessControlContext[RESOURCE_TYPE.DEPLOYMENT]

  const canScaleLive = deploymentActions.includes(RESOURCE_ACTION.ScaleLive)
  const canRollbackLive = deploymentActions.includes(RESOURCE_ACTION.RollbackLive)
  const canFullReleaseLive = deploymentActions.includes(RESOURCE_ACTION.FullReleaseLive)
  const canRolloutRestartLive = deploymentActions.includes(RESOURCE_ACTION.RolloutRestartLive)
  const canCancelCanaryLive = deploymentActions.includes(RESOURCE_ACTION.CancelCanaryLive)
  const canBatchScaleLive = deploymentActions.includes(RESOURCE_ACTION.BatchScaleLive)
  const canBatchFullReleaseLive = deploymentActions.includes(RESOURCE_ACTION.BatchFullReleaseLive)
  const canBatchRolloutRestartLive = deploymentActions.includes(RESOURCE_ACTION.BatchRolloutRestartLive)
  const canScaleNonLive = deploymentActions.includes(RESOURCE_ACTION.ScaleNonLive)
  const canRollbackNonLive = deploymentActions.includes(RESOURCE_ACTION.RollbackNonLive)
  const canFullReleaseNonLive = deploymentActions.includes(RESOURCE_ACTION.FullReleaseNonLive)
  const canRolloutRestartNonLive = deploymentActions.includes(RESOURCE_ACTION.RolloutRestartNonLive)
  const canCancelCanaryNonLive = deploymentActions.includes(RESOURCE_ACTION.CancelCanaryNonLive)
  const canBatchScaleNonLive = deploymentActions.includes(RESOURCE_ACTION.BatchScaleNonLive)
  const canBatchFullReleaseNonLive = deploymentActions.includes(RESOURCE_ACTION.BatchFullReleaseNonLive)
  const canBatchRolloutRestartNonLive = deploymentActions.includes(RESOURCE_ACTION.BatchRolloutRestartNonLive)
  const canDeleteDeploymentLive = deploymentActions.includes(RESOURCE_ACTION.DeleteLive)
  const canDeleteDeploymentNonLive = deploymentActions.includes(RESOURCE_ACTION.DeleteNonLive)

  const isLiveEnv = selectedEnvironment && selectedEnvironment.toUpperCase() === 'LIVE'

  const batchActionsPermissionMap = {
    [DEPLOYMENT_ACTIONS.SCALE]: isLiveEnv ? canBatchScaleLive : canBatchScaleNonLive,
    [DEPLOYMENT_ACTIONS.FULL_RELEASE]: isLiveEnv ? canBatchFullReleaseLive : canBatchFullReleaseNonLive,
    [DEPLOYMENT_ACTIONS.ROLLOUT_RESTART]: isLiveEnv ? canBatchRolloutRestartLive : canBatchRolloutRestartNonLive
  }

  const { state: GlobalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = GlobalContextState || {}
  const tenantRole = userRoles.find(role => role.tenantId === Number(tenantId))?.roleId

  const canScale = isLiveEnv ? canScaleLive : canScaleNonLive
  const canApplyScale = tenantRole === TENANT_DEVELOPER_ID

  const [currentEnv, setCurrentEnv] = React.useState<string>()

  const filterBy = React.useMemo(() => {
    return getFilterUrlParam({
      componentTypes: getFilterItem('componentTypes', selectedAzComponentType, filterTypes.equal),
      envs: currentEnv !== ALL_ENVIRONMENTS_VALUE && getFilterItem('envs', currentEnv, filterTypes.equal),
      cids: getFilterItem('cids', selectedCids, filterTypes.equal),
      azs: getFilterItem('azs', selectedAZs, filterTypes.equal)
    })
  }, [selectedAzComponentType, currentEnv, selectedCids, selectedAZs])

  const listSdusFnWithResource = React.useCallback(
    args => {
      return sduControllerListSdus({
        tenantId: String(tenantId),
        projectName,
        appName,
        filterBy: filterBy,
        orderBy: args?.orderBy?.includes('desc') ? args.orderBy : undefined
      })
    },
    [tenantId, projectName, appName, filterBy]
  )

  const [listApplicationSdusState, listApplicationSdusFn] = useAsyncIntervalFn<IListSdusResponse>(
    listSdusFnWithResource,
    {
      enableIntervalCallback: !editingObject,
      refreshRate: 5000
    }
  )

  const { handleTableChange, refresh } = useAntdTable({ fetchFn: listApplicationSdusFn })
  const { items: sdus = [], allComponentTypeDisplays = [] } = listApplicationSdusState.value || {}
  const spannedAzs = transformSdusToSpannedAzs(sdus)

  const handleRadioChange = React.useCallback(
    event => {
      dispatchers.selectEnvironment(event.target.value)
      setCurrentEnv(event.target.value)
    },
    [dispatchers]
  )

  const handleChange = React.useCallback(
    (pagination, filters, sorter, extra) => {
      const { action } = extra

      if (action === 'filter') {
        const { componentTypeDisplay } = filters
        return dispatchers.selectAzComponentType(componentTypeDisplay)
      }

      handleTableChange(pagination, filters, sorter, extra)
    },
    [dispatchers, handleTableChange]
  )

  const isBatchEditing = !!(editingObject && editingObject.editType === EDIT_TYPES.BATCH)
  const isSingleEditing = !!(editingObject && editingObject.editType === EDIT_TYPES.SINGLE)
  const editingAction = editingObject && editingObject.actionType
  const editingDeploys = React.useMemo(() => (editingObject && editingObject.editingRows) || [], [editingObject])

  const actionAuthCheckKeys = React.useMemo(
    () => ({
      [DEPLOYMENT_ACTIONS.SCALE]: 'canScale',
      [DEPLOYMENT_ACTIONS.ROLLBACK]: 'canRollback',
      [DEPLOYMENT_ACTIONS.FULL_RELEASE]: 'canFullRelease',
      [DEPLOYMENT_ACTIONS.ROLLOUT_RESTART]: 'canRestart',
      [DEPLOYMENT_ACTIONS.CANCEL_CANARY]: 'canFullRelease',
      [DEPLOYMENT_ACTIONS.DELETE]: 'canDelete'
    }),
    []
  )

  const singleActionPermissionMap = React.useMemo(
    () => ({
      [actionAuthCheckKeys[DEPLOYMENT_ACTIONS.ROLLBACK]]: isLiveEnv ? canRollbackLive : canRollbackNonLive,
      [actionAuthCheckKeys[DEPLOYMENT_ACTIONS.FULL_RELEASE]]: isLiveEnv ? canFullReleaseLive : canFullReleaseNonLive,
      [actionAuthCheckKeys[DEPLOYMENT_ACTIONS.ROLLOUT_RESTART]]: isLiveEnv
        ? canRolloutRestartLive
        : canRolloutRestartNonLive,
      [actionAuthCheckKeys[DEPLOYMENT_ACTIONS.CANCEL_CANARY]]: isLiveEnv ? canCancelCanaryLive : canCancelCanaryNonLive,
      [actionAuthCheckKeys[DEPLOYMENT_ACTIONS.DELETE]]: isLiveEnv ? canDeleteDeploymentLive : canDeleteDeploymentNonLive
    }),
    [
      actionAuthCheckKeys,
      isLiveEnv,
      canRollbackLive,
      canRollbackNonLive,
      canFullReleaseLive,
      canFullReleaseNonLive,
      canRolloutRestartLive,
      canRolloutRestartNonLive,
      canCancelCanaryLive,
      canCancelCanaryNonLive,
      canDeleteDeploymentLive,
      canDeleteDeploymentNonLive
    ]
  )

  const canAzAction = React.useCallback(
    (azRecord: ISpannedAz) => {
      const checkKey = actionAuthCheckKeys[editingAction]
      return azRecord[checkKey] === true
    },
    [editingAction, actionAuthCheckKeys]
  )

  const handleSduCheckboxChange = React.useCallback(
    (event, record) => {
      const isChecked = event.target.checked
      const { sduName: selectedSduName } = record
      const { editingRows } = editingObject
      let updatedEditingRows: ISpannedAz[] = []
      if (isChecked) {
        const selectedSduRows = spannedAzs.filter(record => {
          const hasBeSelected = editingRows.some(row => row.rowKey === record.rowKey)
          return canAzAction(record) && !hasBeSelected && record.sduName === selectedSduName
        })
        if (selectedSduRows.length === 0) return
        updatedEditingRows = [...editingRows, ...selectedSduRows]
      } else {
        updatedEditingRows = editingRows.filter(row => row.sduName !== selectedSduName)
      }
      dispatchers.selectRecord({ records: updatedEditingRows })
    },
    [spannedAzs, dispatchers, editingObject, canAzAction]
  )

  const handleAzCheckboxChange = React.useCallback(
    (event, record: ISpannedAz) => {
      const isChecked = event.target.checked
      const { editingRows } = editingObject
      let updatedEditingRows: ISpannedAz[] = []
      if (isChecked) {
        updatedEditingRows = [...editingRows, record]
      } else {
        updatedEditingRows = editingRows.filter(row => row.rowKey !== record.rowKey)
      }
      // update selected rows
      dispatchers.selectRecord({ records: updatedEditingRows })
    },
    [dispatchers, editingObject]
  )

  const isAzRowSelected = React.useCallback(
    (rowKey: string): boolean => {
      const { editingRows } = editingObject
      return editingRows.some(row => row.rowKey === rowKey)
    },
    [editingObject]
  )

  const isSduRowSelected = React.useCallback(
    (sduName: string, rowSpan: number): SDU_CHECKBOX_STATUS => {
      const { editingRows } = editingObject
      const selectedAzRows = editingRows.filter(row => row.sduName === sduName)
      if (selectedAzRows.length === rowSpan) return SDU_CHECKBOX_STATUS.ALL
      if (selectedAzRows.length === 0) return SDU_CHECKBOX_STATUS.NONE
      return SDU_CHECKBOX_STATUS.PARTIAL
    },
    [editingObject]
  )

  const columns: TableColumnType<ISpannedAz>[] = React.useMemo(
    () => [
      {
        title: 'SDU Name',
        dataIndex: 'sduName',
        render: (sduName: string, record) => (
          <FlexDiv>
            {isBatchEditing && (
              <>
                <Checkbox
                  checked={isSduRowSelected(record.sduName, record.span) !== SDU_CHECKBOX_STATUS.NONE}
                  indeterminate={isSduRowSelected(record.sduName, record.span) === SDU_CHECKBOX_STATUS.PARTIAL}
                  onChange={event => handleSduCheckboxChange(event, record)}
                />
                <HorizontalDivider />
              </>
            )}
            <div>
              <NoWrapDiv>{sduName}</NoWrapDiv>
              <div>
                <LabelText>Total:</LabelText> {record.instancesCount}
              </div>
            </div>
          </FlexDiv>
        ),
        onCell: record => ({
          rowSpan: record?.span,
          style: {
            borderRight: '1px solid  #f0f0f0'
          }
        })
      },
      {
        title: 'AZ',
        dataIndex: 'name',
        render: (azName: string, record) => {
          const { type, cluster } = record
          return (
            <FlexDiv>
              {isBatchEditing && (
                <>
                  <Checkbox
                    disabled={!canAzAction(record)}
                    checked={isAzRowSelected(record.rowKey)}
                    onChange={event => handleAzCheckboxChange(event, record)}
                  />
                  <HorizontalDivider />
                </>
              )}
              <div>{azName}</div>
              {type === AZ_TYPE.KUBERNETES && (
                <>
                  <HorizontalDivider size='4px' />
                  <LabelText lineHeight='22px'>({cluster})</LabelText>
                </>
              )}
            </FlexDiv>
          )
        }
      },
      {
        title: 'Component Type',
        dataIndex: 'componentTypeDisplay',
        filters: allComponentTypeDisplays.map(type => ({ text: type, value: type }))
      },
      {
        title: 'Total',
        dataIndex: 'instance'
      },
      {
        title: 'Status',
        render: (_, record) => renderDeploymentStatus(record)
      },
      {
        title: 'Phase',
        dataIndex: 'phase',
        render: (phase: string, record) => {
          const releaseOrCanaryContainers = record.containers.filter(container =>
            RELEASE_OR_CANARY_PHASES.includes(container.phase)
          )
          const validPhases: { phase: string; tag: string }[] = releaseOrCanaryContainers.length
            ? releaseOrCanaryContainers.map(({ phase, tag }) => ({ phase, tag }))
            : [{ phase, tag: record.tag }]
          return validPhases.map(({ phase, tag }) => (
            <PhaseContainer key={`${phase}-${tag}`}>
              <PhaseWrapper className={DISABLE_ROW_LINK_CLASS}>
                {phase}
                <SplitLine />
                {tag}
              </PhaseWrapper>
            </PhaseContainer>
          ))
        }
      },
      {
        title: 'Update Time',
        dataIndex: 'updateTime',
        render: updateTime => formatTime(updateTime),
        sorter: true
      },
      {
        title: 'Observability',
        render: (_, record) => {
          const { type, env, cid, monitoringClusterName, cluster: clusterName } = record
          let logPlatformHref: string
          let monitoringHref: string
          const canLink = type === AZ_TYPE.KUBERNETES
          const disabledLinkStyle = {
            cursor: 'not-allowed',
            opacity: 0.5,
            textDecoration: 'none'
          }
          if (canLink) {
            logPlatformHref = generateLogPlatformLink({ env, cid, projectName, appName })
            monitoringHref = generateMonitoringPlatformLink({
              tenantName,
              env,
              cid,
              projectName,
              appName,
              monitoringClusterName,
              clusterName
            })
          }
          return (
            <>
              <Space size={0} className={DISABLE_ROW_LINK_CLASS}>
                <BorderedLink
                  href={logPlatformHref}
                  target='_blank'
                  rel='noreferrer'
                  style={canLink ? undefined : disabledLinkStyle}
                >
                  <img src={logSvg} />
                </BorderedLink>
                <BorderedLink
                  href={monitoringHref}
                  target='_blank'
                  rel='noreferrer'
                  style={canLink ? undefined : disabledLinkStyle}
                >
                  <img src={monitorSvg} />
                </BorderedLink>
              </Space>
            </>
          )
        }
      },
      {
        title: 'Actions',
        render: (_, record) => {
          const actions = [
            DEPLOYMENT_ACTIONS.ROLLBACK,
            DEPLOYMENT_ACTIONS.FULL_RELEASE,
            DEPLOYMENT_ACTIONS.ROLLOUT_RESTART,
            DEPLOYMENT_ACTIONS.CANCEL_CANARY,
            DEPLOYMENT_ACTIONS.DELETE
          ]

          const isActionsDisabled = !!editingObject
          const isActionScaleDisabled = record.canScale === false
          const hasNoActions = record.type === AZ_TYPE.BROMO

          const menu = (
            <Menu style={{ position: 'relative', zIndex: 999 }}>
              {actions.map(action => {
                const actionAuthCheckKey = actionAuthCheckKeys[action]
                const hasPermission = !singleActionPermissionMap[actionAuthCheckKey]
                const disabledOperateDeploy = record[actionAuthCheckKey] === false

                return (
                  <Menu.Item
                    key={action}
                    disabled={isActionsDisabled || hasPermission || disabledOperateDeploy}
                    onClick={() =>
                      dispatchers.enableEdit({
                        editType: EDIT_TYPES.SINGLE,
                        actionType: action,
                        editingRows: [record]
                      })
                    }
                  >
                    {action}
                  </Menu.Item>
                )
              })}
            </Menu>
          )

          return (
            <OperationWrapper className={DISABLE_ROW_LINK_CLASS}>
              <Operation
                type='link'
                disabled={hasNoActions || isActionsDisabled || isActionScaleDisabled || (!canScale && !canApplyScale)}
                onClick={() =>
                  dispatchers.enableEdit({
                    editType: EDIT_TYPES.SINGLE,
                    actionType: DEPLOYMENT_ACTIONS.SCALE,
                    editingRows: [record]
                  })
                }
              >
                Scale
              </Operation>
              <Dropdown overlay={menu} disabled={hasNoActions || isActionsDisabled}>
                <Operation type='link'>
                  More <IArrowDown />
                </Operation>
              </Dropdown>
            </OperationWrapper>
          )
        }
      }
    ],
    [
      editingObject,
      canScale,
      canApplyScale,
      actionAuthCheckKeys,
      singleActionPermissionMap,
      dispatchers,
      isBatchEditing,
      allComponentTypeDisplays,
      tenantName,
      projectName,
      appName,
      handleSduCheckboxChange,
      handleAzCheckboxChange,
      isAzRowSelected,
      isSduRowSelected,
      canAzAction
    ]
  )

  const batchActions = React.useMemo(
    () => [
      {
        type: DEPLOYMENT_ACTIONS.SCALE
      },
      {
        type: DEPLOYMENT_ACTIONS.FULL_RELEASE
      },
      {
        type: DEPLOYMENT_ACTIONS.ROLLOUT_RESTART
      }
    ],
    []
  )

  const handleEditCancel = React.useCallback(() => {
    dispatchers.exitEdit()
  }, [dispatchers])

  React.useEffect(() => {
    refresh()
  }, [refresh, filterBy, selectedEnvironment, selectedAZs, selectedCids])

  const operationComponentList = [
    <Select
      mode='multiple'
      placeholder='All CID'
      options={generateSelectOptions(cids)}
      value={selectedCids}
      onChange={(cids: string[]) => dispatchers.selectCid(cids)}
      allowClear
      listHeight={192}
      style={{ width: '200px' }}
      key='cid_selector'
    />,
    <Select
      mode='multiple'
      placeholder='All AZ'
      options={generateSelectOptions(azs)}
      value={selectedAZs}
      onChange={(azs: string[]) => dispatchers.selectAZ(azs)}
      dropdownStyle={{ maxHeight: '192px' }}
      style={{ width: '200px' }}
      allowClear
      key='az_selector'
    />,
    <Dropdown
      placement='bottomCenter'
      disabled={!!editingObject}
      overlay={
        <Menu>
          {batchActions.map(action => {
            const { type } = action
            return (
              <Menu.Item key={type} disabled={!batchActionsPermissionMap[type]}>
                <div
                  onClick={() => {
                    dispatchers.enableEdit({
                      editType: EDIT_TYPES.BATCH,
                      actionType: type,
                      editingRows: []
                    })
                  }}
                >
                  {`${EDIT_TYPES.BATCH}-${type}`}
                </div>
              </Menu.Item>
            )
          })}
        </Menu>
      }
      key='batch_action'
    >
      <Button type='primary' style={{ marginLeft: 'auto', marginBottom: '24px' }}>
        Batch-Action <DownOutlined />
      </Button>
    </Dropdown>
  ]

  const handleOnRow = (record: ISpannedAz) => {
    return {
      style: { cursor: isBatchEditing ? 'default' : 'pointer' },
      onClick: (event: Event) => {
        if (isBatchEditing) return
        const { type, clusterId, sduName, name, componentType } = record
        // React event target has a wrong type, must use 'as' to alias it
        const targetElement = event.target as HTMLElement
        // only the elements without 'disable-row-link' class can be linked to deployment detail page
        const canLink = !doesElementHasClass(targetElement, DISABLE_ROW_LINK_CLASS, 'TD')
        if (canLink) {
          const trElement = targetElement.parentElement
          const tdElementCount = trElement.childElementCount
          const rowSpanValue = Number(targetElement.getAttribute('rowspan'))
          const isFirstTd = rowSpanValue > 1 && tdElementCount === 9
          // disable clicking first td element to link
          if (!isFirstTd) {
            const deploymentRoutePath = buildDeployDetailRoute({
              tenantId,
              projectName,
              applicationName: appName,
              deployName: sduName, // sduName is deployment name
              clusterId: clusterId || LEAP_CLUSTER_ID
            })
            const sduDeploymentRoutePath = `${deploymentRoutePath}?${AZ_TYPE_QUERY_KEY}=${type}&${AZ_QUERY_KEY}=${name}&${COMPONENT_QUERY_KEY}=${componentType}`
            history.push(sduDeploymentRoutePath)
          }
        }
      }
    }
  }

  return (
    <Prompt when={!!editingObject} onlyPathname={false}>
      <Filters>
        <Radio.Group defaultValue={ALL_ENVIRONMENTS_VALUE} onChange={handleRadioChange}>
          {[ALL_ENVIRONMENTS_VALUE, ...sortedEnvs].map(env => (
            <Radio.Button key={env} value={env}>
              {env}
            </Radio.Button>
          ))}
        </Radio.Group>
        <OperationsWrapper>
          {operationComponentList.map(component => (
            <OperationItem key={component.key}>{component}</OperationItem>
          ))}
        </OperationsWrapper>
      </Filters>
      <Table
        rowKey='rowKey'
        loading={listApplicationSdusState.loading}
        columns={columns}
        dataSource={spannedAzs}
        onChange={handleChange}
        pagination={false}
        onRow={handleOnRow}
      />
      <div ref={ref}></div>
      <DeploymentSingleOperations
        action={editingAction}
        visible={isSingleEditing}
        application={application}
        deploy={editingDeploys.length ? editingDeploys[0] : undefined}
        onCancel={handleEditCancel}
        onSuccess={refresh}
      />
      {isBatchEditing && <DeploymentBatchOperations application={application} onSuccess={refresh} />}
    </Prompt>
  )
})

export default DeploymentList
