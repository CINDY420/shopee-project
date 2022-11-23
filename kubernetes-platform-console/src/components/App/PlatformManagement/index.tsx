import * as React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import routeResourceDetectorHOC from 'react-resource-detector'

import { useRemoteRecoil } from 'hooks/useRecoil'
import { selectedCluster } from 'states/clusterState'
import { selectedNode } from 'states/clusterState/node'

import { getMatchResourceHandler } from 'helpers/routes'
import history from 'helpers/history'
import { CLUSTERS, CLUSTER_DETAIL, NODE_DETAIL } from 'constants/routes/routes'
import { CLUSTER, NODE } from 'constants/routes/name'
import AsyncRoute, { IAsyncRouteProps } from 'components/Common/AsyncRoute'
import { clustersControllerGetClusterInfo } from 'swagger-api/v3/apis/Cluster'
import { nodesControllerGetNodeByName } from 'swagger-api/v3/apis/Nodes'

import ClusterTree from 'components/App/PlatformManagement/Clusters/Tree'
import ClusterList from 'components/App/PlatformManagement/Clusters/List'
// import Platforms from 'components/App/PlatformManagement/Platforms'
// import Tenants from 'components/App/PlatformManagement/Tenants'

import { CommonStyledLayout, CommonStyledSider, CommonStyledContent } from 'common-styles/layout'
import { Root } from './style'

const { lazy } = React

const ClusterDetail = lazy(() => import('./Clusters/Detail'))
const NodeDetail = lazy(() => import('./Clusters/NodeDetail'))

const Cluster: React.FC & {
  resourceConfigurations?: object
  routeConfigurations?: object
} = () => {
  const [selectedClusterState, selectedClusterFn, resetClusterState] = useRemoteRecoil(
    clustersControllerGetClusterInfo,
    selectedCluster
  )

  const [selectedNodeState, selectedNodeFn, resetNodeState] = useRemoteRecoil(
    nodesControllerGetNodeByName,
    selectedNode
  )

  Cluster.resourceConfigurations = {
    [CLUSTER]: getMatchResourceHandler((matches: IClusterMatches, name: string) => {
      selectedClusterFn({ clusterName: matches.clusterId })
    }),
    [NODE]: getMatchResourceHandler((matches: IClusterMatches, name: string) => {
      selectedNodeFn({ clusterName: matches.clusterId, nodeName: matches.nodeId })
    })
  }

  const asyncRoutes: Array<IAsyncRouteProps> = [
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
    }
  ]

  return (
    <CommonStyledLayout>
      <CommonStyledSider width={240}>
        <ClusterTree location={history.location} />
      </CommonStyledSider>
      <CommonStyledContent>
        <Root>
          <Switch>
            <Route exact path={CLUSTERS} component={ClusterList} />
            {asyncRoutes.map(props => (
              <AsyncRoute exact key={props.path as string} {...props} />
            ))}
            {/* <Route path={PLATFORMS} component={Platforms} />
            <Route path={TENANTS} component={Tenants} /> */}
            <Redirect from='/' to={CLUSTERS} />
          </Switch>
        </Root>
      </CommonStyledContent>
    </CommonStyledLayout>
  )
}

interface IClusterMatches {
  clusterId?: string
  nodeId?: string
}

Cluster.routeConfigurations = {
  [CLUSTER_DETAIL]: {
    whiteList: [CLUSTER]
  },
  [NODE_DETAIL]: {
    whiteList: [CLUSTER, NODE]
  }
}

export default routeResourceDetectorHOC(Cluster, { shouldDetectResourceForAllRoutes: false })
