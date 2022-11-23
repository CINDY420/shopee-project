import React from 'react'
import { Route, Switch, Redirect, matchPath } from 'react-router'
import {
  CLUSTER,
  ADD_EKS_CLUSTER,
  ADD_OTHER_CLUSTER,
  CLUSTER_DETAIL,
} from 'src/constants/routes/routes'
import AddEKSCluster from 'src/components/App/Cluster/AddEKSCluster'
import ClusterTable from 'src/components/App/Cluster/ClusterTable'
import ClusterDetail from 'src/components/App/Cluster/ClusterDetail'
import AddOtherCluster from 'src/components/App/Cluster/AddOtherCluster'
import { fetch } from 'src/rapper'
import Fetch from 'src/hocs/fetch'

interface IClusterDetailRouteParams {
  clusterId: string
}

// rapper overrideFetch only take effect in runtime, so must call rapper fetch in a function
const fetchClusterDetailFn = () => {
  const match = matchPath<IClusterDetailRouteParams>(location.pathname, {
    path: CLUSTER_DETAIL,
  })
  const clusterId = match?.params.clusterId || ''
  return fetch['GET/ecpadmin/clusters/{clusterId}']({ clusterId })
}
const FetchClusterDetail = Fetch(ClusterDetail, fetchClusterDetailFn)

const Cluster: React.FC = () => (
  <Switch>
    <Route exact path={CLUSTER} component={ClusterTable} />
    <Route exact path={ADD_EKS_CLUSTER} component={AddEKSCluster} />
    <Route exact path={ADD_OTHER_CLUSTER} component={AddOtherCluster} />
    <Route exact path={CLUSTER_DETAIL} component={FetchClusterDetail} />
    <Redirect to={CLUSTER} />
  </Switch>
)

export default Cluster
