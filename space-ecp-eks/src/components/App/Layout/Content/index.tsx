import React from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { CLUSTER, DEFAULT_ROUTE } from 'src/constants/routes/routes'
import Cluster from 'src/components/App/Cluster'

const Content: React.FC = () => (
  <Switch>
    <Route path={CLUSTER} component={Cluster} />
    <Redirect to={DEFAULT_ROUTE} />
  </Switch>
)

export default Content
