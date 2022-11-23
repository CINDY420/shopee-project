import * as React from 'react'

import { groupsControllerGetDetail } from 'swagger-api/v3/apis/Tenants'

import { projectControllerGetDetail } from 'swagger-api/v1/apis/Project'
import { pprofControllerGetPprof } from 'swagger-api/v3/apis/Pprof'
import {
  deploymentsControllerGetApplicationDeployClusterDetail,
  IDeploymentsControllerGetApplicationDeployClusterDetailParams
} from 'swagger-api/v3/apis/Deployments'
import { ticketControllerGetTicket } from 'swagger-api/v1/apis/Ticket'
import { clustersControllerGetClusterInfo } from 'swagger-api/v3/apis/Cluster'
import { nodesControllerGetNodeByName } from 'swagger-api/v3/apis/Nodes'
import { applicationControllerGetApplication } from 'swagger-api/v1/apis/Application'

import ApplicationDetail from './ApplicationDetail'
import routeResourceDetectorHOC from 'react-resource-detector'
import TenantDetail from './TenantDetail'
import ProjectDetail from './ProjectDetail'
import PodDetail from './PodDetail'
import DeploymentDetail from './Deployment'
import FlameGraph from './FlameGraph'

import Approvals from 'components/App/RequestAndApproval/List/Approvals'
import UserRequests from 'components/App/RequestAndApproval/List/Requests'
import Detail from 'components/App/RequestAndApproval/Detail'

import ClusterList from 'components/App/PlatformManagement/Clusters/List'
import Platforms from 'components/App/PlatformManagement/Platforms'
import Tenants from 'components/App/PlatformManagement/Tenants'

import { Switch, Redirect, Route } from 'react-router-dom'
import { matchPath } from 'react-router'

import { useSetRecoilState, useRecoilValue } from 'recoil'
import { useRemoteRecoil } from 'hooks/useRecoil'
import { selectedTenant } from 'states/applicationState/tenant'
import { selectedProject } from 'states/applicationState/project'
import { selectedApplication } from 'states/applicationState/application'
import { selectedPod } from 'states/applicationState/pod'
import { selectedDeployment } from 'states/applicationState/deployment'
import { selectedTreeNodes, selectedExpandedNodes } from 'states/applicationState/tree'
import { selectedRequest } from 'states/requestAndApproval'
import { selectedCluster } from 'states/clusterState'
import { selectedNode } from 'states/clusterState/node'
import { selectedProfile } from 'states/applicationState/profile'

import {
  APPLICATIONS,
  TENANT_DETAIL,
  PROJECT_DETAIL,
  APPLICATION_DETAIL,
  POD_DETAIL,
  DEPLOYMENT_DETAIL,
  PENDING_MY_ACTION_LIST,
  MY_REQUESTS_LIST,
  TICKET_DETAIL,
  TICKET_CENTER_KEY,
  TICKET_LIST_KEY,
  TICKET_LIST_TYPE,
  TICKET_LIST,
  CLUSTERS,
  PLATFORMS,
  TENANTS,
  CLUSTER_DETAIL,
  NODE_DETAIL,
  POD_FLAME_GRAPH,
  RESOURCE
} from 'constants/routes/routes'

import { getMatchResourceHandler } from 'helpers/routes'
import { getClusterNameById } from 'helpers/cluster'

import { tenantId, projectId, applicationId } from 'helpers/applicationId'
import { CommonStyledLayout, CommonStyledContent } from 'common-styles/layout'
import {
  TENANT,
  PROJECT,
  APPLICATION,
  POD,
  DEPLOYMENT,
  TICKET,
  APPROVAL_AND_REQUEST,
  buildName,
  CLUSTER,
  NODE
} from 'constants/routes/name'
import {
  TENANT_ID,
  PROJECT_ID,
  APPLICATION_ID,
  POD_ID,
  CLUSTER_ID,
  DEPLOYMENT_ID,
  TICKET_ID,
  PROFILE_ID
} from 'constants/routes/identifier'
import AsyncRoute, { IAsyncRouteProps } from 'components/Common/AsyncRoute'
import SiderMenu from './SiderMenu'

import { Root } from './style'

import { podsControllerGetPodDetail } from 'swagger-api/v3/apis/Pods'
import Resource from 'components/App/ResourceManagement'
import { AZ_QUERY_KEY, AZ_TYPE, AZ_TYPE_QUERY_KEY, COMPONENT_QUERY_KEY, LEAP_CLUSTER_ID } from 'constants/deployment'
import { deploymentControllerGetDeployment } from 'swagger-api/v1/apis/Deployment'
import Announcements from 'components/App/Layout/Announcements'
import OfflineTenantResult from 'components/App/ApplicationsManagement/OfflineTenantResult'
import { globalControllerListOfflineTenants } from 'swagger-api/v1/apis/Global'
import useAsyncFn from 'hooks/useAsyncFn'
import { ITenantDetail } from 'api/types/application/group'

interface IClusterMatches {
  clusterId?: string
  nodeId?: string
}

const { lazy } = React

const ClusterDetail = lazy(() => import('components/App/PlatformManagement/Clusters/Detail'))
const NodeDetail = lazy(() => import('components/App/PlatformManagement/Clusters/NodeDetail'))

const ApplicationsManagement: React.FC & {
  resourceConfigurations?: object
  routeConfigurations?: object
} = () => {
  const [offlineTenantsState, offlineTenantsFetch] = useAsyncFn(globalControllerListOfflineTenants)
  const { tenants: offlineTenants } = offlineTenantsState?.value || {}

  React.useEffect(() => {
    offlineTenantsFetch()
  }, [offlineTenantsFetch])

  const getDeploymentWithResource = React.useCallback(
    async (args: IDeploymentsControllerGetApplicationDeployClusterDetailParams, queryString: string) => {
      const { clusterId } = args
      if (clusterId !== LEAP_CLUSTER_ID) {
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
      } else {
        // leap deployment did not have a deployment detail api, get these meta from url
        // const { azType, az } = queryParams

        const urlSearchParams = new URLSearchParams(queryString)
        const az = urlSearchParams.get(AZ_QUERY_KEY)
        const azType = urlSearchParams.get(AZ_TYPE_QUERY_KEY)
        const componentType = urlSearchParams.get(COMPONENT_QUERY_KEY)
        const { tenantId, projectName, appName, deployName } = args
        const clusterName = getClusterNameById(clusterId)

        const [, , env, cid] = deployName.split('-')
        const leapDeploymentState = {
          clusterName,
          clusterId,
          tenantId,
          projectName,
          appName,
          name: deployName,
          info: {
            env,
            cid,
            azType,
            az,
            componentType
          }
        }

        return leapDeploymentState
      }
    },
    []
  )

  const [selectedTenantState, selectTenantFn, resetTenantStateFn] = useRemoteRecoil(
    groupsControllerGetDetail,
    selectedTenant
  )
  const [selectedProjectState, selectProjectFn, resetProjectFn] = useRemoteRecoil(
    projectControllerGetDetail,
    selectedProject
  )
  const [selectedApplicationState, selectApplicationFn, resetApplicationFn] = useRemoteRecoil(
    applicationControllerGetApplication,
    selectedApplication
  )
  const [selectedPodState, selectPodFn, resetPodFn] = useRemoteRecoil(podsControllerGetPodDetail, selectedPod)
  const [selectedDeploymentState, selectedDeploymentFn, resetDeployFn] = useRemoteRecoil(
    getDeploymentWithResource,
    selectedDeployment
  )
  const setSelectedTreeNodes = useSetRecoilState(selectedTreeNodes)
  const setSelectedExpandedNodes = useSetRecoilState(selectedExpandedNodes)
  const tenantDetail: ITenantDetail = useRecoilValue(selectedTenant)
  const { id: selectedTenantId } = tenantDetail

  // Request and approve
  const [selectedRequestState, selectedRequestFn, resetRequestFn] = useRemoteRecoil(
    ticketControllerGetTicket,
    selectedRequest
  )

  // platform management
  const [selectedClusterState, selectedClusterFn, resetClusterState] = useRemoteRecoil(
    clustersControllerGetClusterInfo,
    selectedCluster
  )

  const [selectedNodeState, selectedNodeFn, resetNodeState] = useRemoteRecoil(
    nodesControllerGetNodeByName,
    selectedNode
  )
  const [selectedProfileState, selectedProfileFn, resetProfileState] = useRemoteRecoil(
    pprofControllerGetPprof,
    selectedProfile
  )
  const [isFlameGraph, setFlameGraphState] = React.useState(false)

  ApplicationsManagement.resourceConfigurations = {
    [TENANT]: getMatchResourceHandler((data: IMatches) => {
      const id = data[TENANT_ID]

      // Fix function getResourceAccessControl called in hoc accessControl probabilistic failure because group name is empty.
      // This is because selectGroupFn is an asynchronous operation. There is a certain probability that when getResourceAccessControl is called, selectGroupFn has not yet returned.

      setSelectedTreeNodes([tenantId({ tenantId: id })])
      setSelectedExpandedNodes([])
      selectTenantFn({ tenantId: id })
    }),
    [PROJECT]: getMatchResourceHandler((data: IMatches) => {
      const id = data[TENANT_ID]
      const projectName = data[PROJECT_ID]

      setSelectedTreeNodes([projectId({ name: projectName, tenantId: id })])
      setSelectedExpandedNodes([tenantId({ tenantId: id })])
      selectProjectFn({ tenantId: id, projectName })
    }),
    [APPLICATION]: getMatchResourceHandler((data: IMatches) => {
      const id = data[TENANT_ID]
      const projectName = data[PROJECT_ID]
      const appName = data[APPLICATION_ID]

      setSelectedTreeNodes([applicationId({ tenantId: id, projectName, name: appName })])
      setSelectedExpandedNodes([projectId({ name: projectName, tenantId: id }), tenantId({ tenantId: id })])
      selectApplicationFn({ tenantId: id, projectName, appName })
    }),
    [DEPLOYMENT]: getMatchResourceHandler((data: IMatches, _, location) => {
      const id = data[TENANT_ID]
      const projectName = data[PROJECT_ID]
      const appName = data[APPLICATION_ID]
      const deployName = data[DEPLOYMENT_ID]
      const clusterId = data[CLUSTER_ID]
      const clusterName = getClusterNameById(clusterId)
      const queryString = location.search

      setSelectedTreeNodes([applicationId({ tenantId: id, projectName, name: appName })])
      setSelectedExpandedNodes([projectId({ name: projectName, tenantId: id }), tenantId({ tenantId: id })])
      selectedDeploymentFn({ tenantId: id, projectName, appName, deployName, clusterName, clusterId }, queryString)
    }),
    [POD]: getMatchResourceHandler((data: IMatches) => {
      const id = data[TENANT_ID]
      const projectName = data[PROJECT_ID]
      const appName = data[APPLICATION_ID]
      const podName = data[POD_ID]
      const clusterId = data[CLUSTER_ID]

      setSelectedTreeNodes([applicationId({ tenantId: id, projectName, name: appName })])
      setSelectedExpandedNodes([projectId({ name: projectName, tenantId: id }), tenantId({ tenantId: id })])
      selectPodFn({ tenantId: id, projectName, appName, podName, clusterId })
    }),
    [APPROVAL_AND_REQUEST]: getMatchResourceHandler((data: IMatches) => {
      const ticketListType = data[TICKET_LIST_TYPE]
      const treeNode = `${buildName(TICKET_LIST_KEY, {
        [TICKET_LIST_TYPE]: ticketListType
      })}`
      setSelectedTreeNodes([treeNode])
      setSelectedExpandedNodes([TICKET_CENTER_KEY, treeNode])
    }),
    [TICKET]: getMatchResourceHandler((data: IMatches) => {
      const accessId = data[TICKET_ID]
      selectedRequestFn({ ticketId: accessId })
    }),
    [CLUSTER]: getMatchResourceHandler((matches: IClusterMatches, path: string) => {
      const clusterMatch = matchPath(location.pathname, CLUSTER_DETAIL)
      clusterMatch && selectedClusterFn({ clusterName: matches.clusterId })
    }),
    [NODE]: getMatchResourceHandler((matches: IClusterMatches, name: string) => {
      selectedNodeFn({ clusterName: matches.clusterId, nodeName: matches.nodeId })
    }),
    [POD_FLAME_GRAPH]: getMatchResourceHandler((data: IMatches) => {
      setFlameGraphState(true)

      const id = data[TENANT_ID]
      const projectName = data[PROJECT_ID]
      const appName = data[APPLICATION_ID]
      const deployName = data[DEPLOYMENT_ID]
      const profileId = data[PROFILE_ID]
      selectedProfileFn({ tenantId: id, projectName, appName, deployName, profileId })
    })
  }

  const asyncRoutes: Array<IAsyncRouteProps> = [
    {
      path: TENANT_DETAIL,
      LazyComponent: TenantDetail,
      asyncState: selectedTenantState,
      onUnmounted: resetTenantStateFn
    },
    {
      path: PROJECT_DETAIL,
      LazyComponent: ProjectDetail,
      asyncState: selectedProjectState,
      onUnmounted: resetProjectFn
    },
    {
      path: APPLICATION_DETAIL,
      LazyComponent: ApplicationDetail,
      asyncState: selectedApplicationState,
      onUnmounted: resetApplicationFn
    },
    {
      path: POD_DETAIL,
      LazyComponent: PodDetail,
      asyncState: selectedPodState,
      onUnmounted: React.useCallback(() => {
        resetPodFn && resetPodFn()
        resetDeployFn && resetDeployFn()
      }, [resetDeployFn, resetPodFn])
    },
    {
      path: DEPLOYMENT_DETAIL,
      LazyComponent: DeploymentDetail,
      asyncState: selectedDeploymentState,
      onUnmounted: resetDeployFn
    },
    {
      path: TICKET_DETAIL,
      LazyComponent: Detail,
      asyncState: selectedRequestState,
      onUnmounted: resetRequestFn
    },
    {
      path: CLUSTER_DETAIL,
      LazyComponent: ClusterDetail,
      asyncState: selectedClusterState,
      onUnmounted: resetClusterState
    },
    {
      path: NODE_DETAIL,
      LazyComponent: NodeDetail,
      asyncState: selectedNodeState,
      onUnmounted: resetNodeState
    },
    {
      path: POD_FLAME_GRAPH,
      LazyComponent: FlameGraph,
      asyncState: selectedProfileState,
      onUnmounted: resetProfileState
    }
  ]

  const isOfflineTenant = offlineTenants?.includes(Number(selectedTenantId))

  const renderAnnouncements = () => {
    const routes = asyncRoutes.map(item => item.path)
    const match = routes.some(item => matchPath(location.pathname, { path: item }))
    if (!match || isOfflineTenant || !selectedTenantId) {
      return null
    }
    return <Announcements tenant={selectedTenantId} closable={false} />
  }

  return (
    <CommonStyledLayout>
      {!isFlameGraph && <SiderMenu />}
      <CommonStyledContent padding={isFlameGraph ? 'none' : undefined}>
        <Root>
          {renderAnnouncements()}
          <Switch>
            {asyncRoutes.map(props => (
              <AsyncRoute
                exact
                key={props.path as string}
                {...props}
                LazyComponent={isOfflineTenant ? OfflineTenantResult : props.LazyComponent}
              />
            ))}
            <Route exact path={PENDING_MY_ACTION_LIST} component={Approvals} />
            <Route exact path={MY_REQUESTS_LIST} component={UserRequests} />
            <Route exact path={CLUSTERS} component={ClusterList} />
            <Route path={PLATFORMS} component={Platforms} />
            <Route path={TENANTS} component={Tenants} />
            <Route path={RESOURCE} component={Resource} />
            <Redirect from='/' to={APPLICATIONS} />
          </Switch>
        </Root>
      </CommonStyledContent>
    </CommonStyledLayout>
  )
}

// TODO more details on matches key
interface IMatches {
  [key: string]: any
}

ApplicationsManagement.routeConfigurations = {
  [TENANT_DETAIL]: {
    whiteList: [TENANT]
  },
  [PROJECT_DETAIL]: {
    whiteList: [TENANT, PROJECT]
  },
  [APPLICATION_DETAIL]: {
    whiteList: [TENANT, PROJECT, APPLICATION]
  },
  [POD_DETAIL]: {
    whitelist: [TENANT, PROJECT, APPLICATION, DEPLOYMENT]
  },
  [POD_FLAME_GRAPH]: {
    whitelist: [TENANT, PROJECT, APPLICATION, DEPLOYMENT, POD_DETAIL]
  },
  [DEPLOYMENT_DETAIL]: {
    whiteList: [TENANT, PROJECT, APPLICATION, DEPLOYMENT]
  },
  [TICKET_DETAIL]: {
    whiteList: [APPROVAL_AND_REQUEST, TICKET]
  },
  [TICKET_LIST]: {
    whiteList: [APPROVAL_AND_REQUEST]
  },
  [CLUSTER_DETAIL]: {
    whiteList: [CLUSTER]
  },
  [NODE_DETAIL]: {
    whiteList: [CLUSTER, NODE]
  }
}

export default routeResourceDetectorHOC(ApplicationsManagement, { shouldDetectResourceForAllRoutes: false })
