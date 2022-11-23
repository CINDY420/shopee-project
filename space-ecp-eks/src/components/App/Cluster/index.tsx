import React from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { CLUSTER, CREATE_CLUSTER, CLUSTER_DETAIL, SECRET_DETAIL } from 'src/constants/routes/routes'
import CreateCluster from 'src/components/App/Cluster/CreateCluster'
import ClusterTable from 'src/components/App/Cluster/ClusterTable'
import ClusterDetail from 'src/components/App/Cluster/ClusterDetail'
import SecretDetail from 'src/components/App/Cluster/ClusterDetail/Configuration/SecretDetail'

const Cluster: React.FC = () => (
  <Switch>
    <Route exact path={CLUSTER} component={ClusterTable} />
    <Route exact path={CREATE_CLUSTER} component={CreateCluster} />
    <Route exact path={CLUSTER_DETAIL} component={ClusterDetail} />
    <Route exact path={SECRET_DETAIL} component={SecretDetail} />
    <Redirect to={CLUSTER} />
  </Switch>
)

export default Cluster
