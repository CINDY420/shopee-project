import * as React from 'react'
import DetailLayout from 'components/App/ApplicationsManagement/Common/DetailLayout'
import { DownOutlined } from 'infra-design-icons'
import { Dropdown, Button, Menu } from 'infrad'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { useRemoteRecoil } from 'hooks/useRecoil'

import {
  deploymentsControllerGetApplicationDeployClusterDetail,
  IDeploymentsControllerGetApplicationDeployClusterDetailParams
} from 'swagger-api/v3/apis/Deployments'
import { IIDeploymentDetailResponseDto } from 'swagger-api/v3/models'

import { EDIT_REFRESH_RATE } from 'constants/time'
import {
  DEPLOYMENT_ACTIONS,
  PHASE_CANARY,
  CANARY_PHASE,
  TABS,
  LEAP_TABS,
  SDU_TYPE,
  AZ_TYPE_MAP_COMPONENT_TYPE,
  LEAP_CLUSTER_ID,
  AZ_TYPE
} from 'constants/deployment'

import Overview from './Overview'
import BasicInfo from './BasicInfo'
import EditDeployment from './EditDeployment'
import ProfilingHistory from './ProfilingHistory'
import ScheculeProfiling from './ScheduleProfiling'
import DeploymentSingleOperations from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations'

import Task from 'components/App/ApplicationsManagement/Deployment/Task'
import DeploymentHistory from 'components/App/ApplicationsManagement/Deployment/DeploymentHistory'

import { selectedApplication } from 'states/applicationState/application'
import { selectedDeployment } from 'states/applicationState/deployment'
import { useRecoilValue } from 'recoil'

import { StyledButton } from './style'

import accessControl from 'hocs/accessControl'
import { AccessControlContext } from 'hooks/useAccessControl'
import { PERMISSION_SCOPE, RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'
import {
  getDispatchers,
  ApplicationContext,
  reducer,
  initialState
} from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/useApplicationContext'
import { deploymentControllerGetDeployment } from 'swagger-api/v1/apis/Deployment'

const ACTION_TYPE = {
  resource: 'resource',
  scale: DEPLOYMENT_ACTIONS.SCALE,
  rollback: DEPLOYMENT_ACTIONS.ROLLBACK,
  restart: DEPLOYMENT_ACTIONS.ROLLOUT_RESTART,
  fullRelease: DEPLOYMENT_ACTIONS.FULL_RELEASE,
  cancelCanary: DEPLOYMENT_ACTIONS.CANCEL_CANARY,
  profiling: DEPLOYMENT_ACTIONS.SCHEDULE_PROFILING
}

const DeploymentDetail: React.FC = () => {
  const [visible, setVisible] = React.useState(false)
  const [actionType, setActionType] = React.useState<any>('')

  const getDeploymentDetailWithResource = React.useCallback(
    async (args: IDeploymentsControllerGetApplicationDeployClusterDetailParams) => {
      // get ecp deployment detail
      const deployment = await deploymentsControllerGetApplicationDeployClusterDetail(args)
      const { tenantId, projectName, appName, deployName } = args
      const { clusterName, info } = deployment
      const { phase, cid, env } = info

      const ecpDeployment = await deploymentControllerGetDeployment({
        tenantId: tenantId.toString(),
        projectName,
        appName,
        deploymentName: deployName,
        clusterName,
        cid,
        env,
        phase
      })

      const { componentType, componentTypeDisplay, az, zoneName } = ecpDeployment
      return {
        ...deployment,
        info: {
          ...deployment.info,
          componentType,
          componentTypeDisplay,
          az: az.name,
          azType: AZ_TYPE.KUBERNETES,
          zoneName
        }
      }
    },
    []
  )

  const [, selectedDeploymentFn] = useRemoteRecoil(getDeploymentDetailWithResource, selectedDeployment)

  const deployment = useRecoilValue(selectedDeployment)
  const application = useRecoilValue(selectedApplication)
  const { info = {} } = deployment || {}
  const { appInstanceName = '' } = info

  const deploymentWithOam = React.useMemo(() => {
    return {
      ...deployment,
      appInstanceName
    }
  }, [appInstanceName, deployment])

  const {
    tenantId,
    projectName,
    appName,
    name: deployName,
    clusterName,
    clusterId,
    clusters: clusterMap = {},
    info: deploymentDetailInfo
  } = deployment || {}
  const clusters = Object.keys(clusterMap)

  const showDrawer = visible && actionType && actionType !== ACTION_TYPE.profiling
  const editingResource = actionType === ACTION_TYPE.resource

  const {
    phase: deployPhase = '',
    env,
    cid,
    phase,
    scalable,
    rollbackable,
    restartable,
    editresourceable: editResourceable,
    fullreleaseable: fullReleaseable,
    az,
    componentType: componentTypeForTag,
    azType,
    zoneName
  } = deploymentDetailInfo || {}

  const componentType = AZ_TYPE_MAP_COMPONENT_TYPE[azType]

  const isCanary = deployPhase === PHASE_CANARY || phase === CANARY_PHASE

  const accessControlContext = React.useContext(AccessControlContext)

  const isLive = env && env.toUpperCase() === 'LIVE'
  const deploymentActions = accessControlContext[RESOURCE_TYPE.DEPLOYMENT] || []

  const canEditDeploymentResourceLive = deploymentActions.includes(RESOURCE_ACTION.EditResourceLive)
  const canEditDeploymentResourceNonLive = deploymentActions.includes(RESOURCE_ACTION.EditResourceNonLive)
  const canScaleLive = deploymentActions.includes(RESOURCE_ACTION.ScaleLive)
  const canRollbackLive = deploymentActions.includes(RESOURCE_ACTION.RollbackLive)
  const canFullReleaseLive = deploymentActions.includes(RESOURCE_ACTION.FullReleaseLive)
  const canRolloutRestartLive = deploymentActions.includes(RESOURCE_ACTION.RolloutRestartLive)
  const canCancelCanaryLive = deploymentActions.includes(RESOURCE_ACTION.CancelCanaryLive)
  const canScaleNonLive = deploymentActions.includes(RESOURCE_ACTION.ScaleNonLive)
  const canRollbackNonLive = deploymentActions.includes(RESOURCE_ACTION.RollbackNonLive)
  const canFullReleaseNonLive = deploymentActions.includes(RESOURCE_ACTION.FullReleaseNonLive)
  const canRolloutRestartNonLive = deploymentActions.includes(RESOURCE_ACTION.RolloutRestartNonLive)
  const canCancelCanaryNonLive = deploymentActions.includes(RESOURCE_ACTION.CancelCanaryNonLive)

  const canEditDeploymentResource = isLive ? canEditDeploymentResourceLive : canEditDeploymentResourceNonLive
  const canScale = isLive ? canScaleLive : canScaleNonLive
  const canRollback = isLive ? canRollbackLive : canRollbackNonLive
  const canFullRelease = isLive ? canFullReleaseLive : canFullReleaseNonLive
  const canRolloutRestart = isLive ? canRolloutRestartLive : canRolloutRestartNonLive
  const canCancelCanary = isLive ? canCancelCanaryLive : canCancelCanaryNonLive

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const dispatcher = React.useMemo(() => getDispatchers(dispatch), [])

  React.useEffect(() => {
    dispatcher.selectEnvironment(env)
  }, [dispatcher, env])

  const ecpTabs = [
    {
      name: TABS.OVERVIEW,
      Component: Overview,
      props: {
        deployment,
        clusterId
      }
    },
    {
      name: TABS.BASIC_INFO,
      Component: BasicInfo,
      props: {
        deployment,
        clusterName,
        clusterId,
        isCanary
      }
    },
    {
      name: TABS.PROFILING_HISTORY,
      Component: ProfilingHistory,
      props: {
        deployment
      }
    }
  ]

  const leapTabs = [
    {
      name: LEAP_TABS.TASK,
      Component: Task,
      props: {
        az
      }
    },
    {
      name: LEAP_TABS.DEPLOYMENT_HISTORY,
      Component: DeploymentHistory,
      props: {
        az
      }
    }
  ]

  const onRefresh = async () => {
    return selectedDeploymentFn({
      tenantId,
      projectName,
      appName,
      deployName,
      clusterName,
      clusterId
    })
  }

  // fullRelease操作过程停止刷新的原因: 该操作会展示Modal，此时刷新数据会导致页面重新渲染，弹出多个Modal
  const isDoingModalAction = visible && (actionType === ACTION_TYPE.fullRelease || actionType === ACTION_TYPE.profiling)

  const [, , setStartIntervalCallback] = useAsyncIntervalFn<IIDeploymentDetailResponseDto>(onRefresh, {
    enableIntervalCallback: !isDoingModalAction,
    refreshRate: EDIT_REFRESH_RATE
  })
  React.useEffect(() => {
    clusterId !== LEAP_CLUSTER_ID && setStartIntervalCallback(true)
  }, [setStartIntervalCallback, clusterId])

  const handleEdit = actionType => {
    setVisible(true)
    setActionType(actionType)
  }

  const handleCancel = () => {
    setVisible(false)
    setActionType('')
  }
  const { name, az: azName, ...others } = deploymentDetailInfo
  const transformDeploymentDetailInfo = {
    sduName: name,
    name: azName,
    ...others
  }

  const menu = (
    <Menu style={{ position: 'relative', zIndex: 999 }}>
      <Menu.Item key='EditResource'>
        <StyledButton
          type='link'
          onClick={() => handleEdit(ACTION_TYPE.resource)}
          disabled={!editResourceable || !canEditDeploymentResource}
        >
          Edit Resource
        </StyledButton>
      </Menu.Item>
      <Menu.Item key='fullRelease'>
        <StyledButton
          type='link'
          onClick={() => handleEdit(ACTION_TYPE.fullRelease)}
          disabled={!fullReleaseable || !canFullRelease}
        >
          {ACTION_TYPE.fullRelease}
        </StyledButton>
      </Menu.Item>
      <Menu.Item key='cancelCanary'>
        <StyledButton
          type='link'
          onClick={() => handleEdit(ACTION_TYPE.cancelCanary)}
          disabled={!isCanary || !canCancelCanary}
        >
          {ACTION_TYPE.cancelCanary}
        </StyledButton>
      </Menu.Item>
      <Menu.Item key='ScheduleProfiling'>
        <StyledButton type='link' onClick={() => handleEdit(ACTION_TYPE.profiling)}>
          Schedule Profiling
        </StyledButton>
      </Menu.Item>
    </Menu>
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

  const defaultTags = [`ComponentType: ${componentTypeForTag}`, `Env: ${env}`, `CID: ${cid}`, `AZ: ${az}`]
  const tags = zoneName ? defaultTags.concat([`Zone: ${zoneName}`]) : defaultTags
  return (
    <ApplicationContext.Provider value={{ state, dispatch }}>
      <DetailLayout
        title={`Deployment: ${deployName}`}
        tags={tags}
        tabs={componentType === SDU_TYPE.LEAP ? leapTabs : ecpTabs}
        defaultActiveKey={componentType === SDU_TYPE.LEAP ? LEAP_TABS.TASK : TABS.OVERVIEW}
        buttons={
          componentType === SDU_TYPE.ECP && [
            {
              icon: null,
              text: ACTION_TYPE.scale,
              disabled: !scalable || !canScale,
              click: () => handleEdit(ACTION_TYPE.scale)
            },
            {
              icon: null,
              text: ACTION_TYPE.rollback,
              disabled: isCanary || !rollbackable || !canRollback,
              click: () => handleEdit(ACTION_TYPE.rollback)
            },
            {
              icon: null,
              text: ACTION_TYPE.restart,
              disabled: !restartable || !canRolloutRestart,
              click: () => handleEdit(ACTION_TYPE.restart)
            }
          ]
        }
        ExtraButton={() => (componentType === SDU_TYPE.ECP ? <MoreButton menu={menu} /> : null)}
        body={
          showDrawer ? (
            editingResource ? (
              <EditDeployment
                visible={visible}
                onCancel={handleCancel}
                onRefresh={() => {
                  onRefresh()
                }}
                deployment={deploymentWithOam}
                clusters={clusters}
                clusterName={clusterName}
              />
            ) : (
              deploymentDetailInfo && (
                <DeploymentSingleOperations
                  action={actionType as DEPLOYMENT_ACTIONS}
                  visible={visible}
                  application={application}
                  deploy={{ ...transformDeploymentDetailInfo, appInstanceName }}
                  onCancel={handleCancel}
                  onSuccess={() => {
                    onRefresh()
                  }}
                />
              )
            )
          ) : (
            actionType === ACTION_TYPE.profiling && (
              <ScheculeProfiling visible={visible} deployment={deployment} onClose={handleCancel} azType={azType} />
            )
          )
        }
      />
    </ApplicationContext.Provider>
  )
}

export default accessControl(DeploymentDetail, PERMISSION_SCOPE.TENANT, [
  RESOURCE_TYPE.PROJECT,
  RESOURCE_TYPE.DEPLOYMENT,
  RESOURCE_TYPE.POD
])
