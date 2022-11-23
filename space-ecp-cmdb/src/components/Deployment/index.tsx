import React from 'react'
import DetailLayout from 'src/components/Common/DetailLayout'
import PodList from 'src/components/Deployment/PodList'
import { useParams } from 'react-router-dom'
import { fetch } from 'src/rapper'
import constants from 'src/sharedModules/cmdb/constants'
import { buildRoute } from 'src/helpers/buildRoute'
import {
  DeploymentContext,
  initialState,
  reducer,
  getDispatchers,
} from 'src/components/Deployment/useDeploymentContext'
import Rollback from 'src/components/Deployment/Action/Rollback'
import { DeploymentActions, DEPLOYMENT_CANARY_PHASE, MoreActions } from 'src/constants/deployment'
import hooks from 'src/sharedModules/cmdb/hooks'
import { intersection } from 'lodash'
import Scale from 'src/components/Deployment/Action/Scale'
import Restart from 'src/components/Deployment/Action/Restart'
import { IModels } from 'src/rapper/request'
import { Dropdown, Menu, Space } from 'infrad'
import { IArrowDown } from 'infra-design-icons'
import MoreAction from 'src/components/Deployment/Action/MoreAction'
import EventList from 'src/components/Deployment/EventList'
import RouteSetRegion from 'src/components/Common/RouteSetRegion'

const { routes } = constants
const { useSelectedService } = hooks

type DeploymentMeta = IModels['GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/meta']['Res']

const Deployment: React.FC = () => {
  const [deploymentMeta, setDeploymentMeta] = React.useState<DeploymentMeta>()
  const {
    env = '',
    cid = '',
    azV1: az = '',
    containers = [],
    componentType = '',
    cluster,
  } = deploymentMeta || {}

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [])
  const { action } = state
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [disabledScaleClusters, setDisabledScaleClusters] = React.useState<string[]>([])

  const { serviceName, sduName, deployId } = useParams<{
    serviceName: string
    sduName: string
    deployId: string
  }>()

  const getDisabledScaleClusters = React.useCallback(async () => {
    const { clusters } = await fetch['GET/api/ecp-cmdb/cluster:disabledScaleClusters']()
    setDisabledScaleClusters(clusters)
  }, [])

  React.useEffect(() => {
    getDisabledScaleClusters()
  }, [getDisabledScaleClusters])

  const getDeploymentMeta = React.useCallback(async () => {
    const deploymentMeta = await fetch[
      'GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/meta'
    ]({
      sduName,
      deployId,
    })
    setDeploymentMeta(deploymentMeta)
  }, [deployId, sduName])

  React.useEffect(() => {
    getDeploymentMeta()
  }, [getDeploymentMeta])

  // get the container of content for render a operation bar when bulk kill pod
  const containerElement = React.useMemo(
    () => (contentRef.current ? contentRef.current.parentElement : null),
    [contentRef.current],
  )

  const deDuplicatedPhases = React.useMemo(() => {
    const phases = containers.map((item) => item.phase)
    return Array.from(new Set(phases))
  }, [containers])

  const isCanary = intersection([DEPLOYMENT_CANARY_PHASE], deDuplicatedPhases).length > 0

  const tabs = React.useMemo(
    () => [
      {
        name: 'Pod List',
        Component: PodList,
        props: {
          sduName,
          deployId,
          containerElement,
          env,
        },
      },
      {
        name: 'Event',
        Component: EventList,
        props: {
          sduName,
          deployId,
        },
      },
    ],
    [containerElement, deployId, env, sduName],
  )

  const { selectedService } = useSelectedService()
  const { isLeaf } = selectedService

  const containerViewRoutePath = buildRoute(
    isLeaf ? routes.SERVICE_DETAIL_CONTAINER_VIEW : routes.TREE_DETAIL_CONTAINER_VIEW,
    {
      serviceName,
    },
  )

  const renderDeploymentActions = () => {
    switch (action) {
      case DeploymentActions.SCALE:
        return <Scale sduName={sduName} deployId={deployId} env={env} />
      case DeploymentActions.ROLLBACK:
        return <Rollback sduName={sduName} deployId={deployId} />
      case DeploymentActions.RESTART:
        return <Restart sduName={sduName} deployId={deployId} deploymentMeta={deploymentMeta} />
      case DeploymentActions.FULL_RELEASE:
      case DeploymentActions.CANCEL_CANARY:
      case DeploymentActions.SUSPEND:
      case DeploymentActions.STOP:
        return (
          <MoreAction
            sduName={sduName}
            deployId={deployId}
            deploymentMeta={deploymentMeta}
            superiorRoute={containerViewRoutePath}
          />
        )
      default:
        return null
    }
  }

  const renderMoreActionButton = () => {
    const isCanary = containers.some((item) => item.phase === DEPLOYMENT_CANARY_PHASE)
    const menu = (
      <Menu
        onClick={(e) => dispatchers.enableEdit(e.key as DeploymentActions)}
        items={MoreActions.map((item) => ({
          key: item,
          label: item,
          disabled:
            item === DeploymentActions.FULL_RELEASE || item === DeploymentActions.CANCEL_CANARY
              ? !isCanary
              : false,
        }))}
      />
    )

    return (
      <Dropdown overlay={menu}>
        <a onClick={(e) => e.preventDefault()}>
          <Space size={4}>
            More
            <IArrowDown />
          </Space>
        </a>
      </Dropdown>
    )
  }

  return (
    <div ref={contentRef}>
      <RouteSetRegion />
      <DeploymentContext.Provider value={{ state, dispatch }}>
        <DetailLayout
          resourceType="Service Name"
          resource={serviceName}
          superiorRoute={containerViewRoutePath}
          title={`SDU: ${sduName}`}
          tags={[`Workload Type: ${componentType}`, `Env: ${env}`, `CID: ${cid}`, `AZ: ${az}`]}
          buttons={[
            {
              icon: null,
              text: DeploymentActions.SCALE,
              click: () => dispatchers.enableEdit(DeploymentActions.SCALE),
              disabled: disabledScaleClusters.includes(cluster),
            },
            {
              icon: null,
              text: DeploymentActions.ROLLBACK,
              visible: true,
              click: () => dispatchers.enableEdit(DeploymentActions.ROLLBACK),
              disabled: isCanary,
            },
            {
              icon: null,
              text: DeploymentActions.RESTART,
              visible: true,
              click: () => dispatchers.enableEdit(DeploymentActions.RESTART),
            },
          ]}
          tabs={tabs}
          ExtraButton={renderMoreActionButton()}
        />
        {renderDeploymentActions()}
      </DeploymentContext.Provider>
    </div>
  )
}

export default Deployment
