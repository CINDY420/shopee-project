import React from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { CLUSTER, DEFAULT_ROUTE, SEGMENT, TENANT } from 'src/constants/routes/routes'
import Cluster from 'src/components/App/Cluster'
import Segment from 'src/components/App/Segment'
import { Tenant } from 'src/components/App/Tenant'

const Content: React.FC = () => (
  <Switch>
    <Route path={CLUSTER} component={Cluster} />
    <Route exact path={TENANT} component={Tenant} />
    <Route path={SEGMENT} component={Segment} />
    <Redirect to={DEFAULT_ROUTE} />
  </Switch>
)

export default Content
