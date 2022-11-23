import * as React from 'react'
import { Switch, Route } from 'react-router-dom'

import Layout from './Layout'
import Login from './Login'
import { LOGIN, ROOT } from 'constants/routes/routes'

export default () => (
  <Switch>
    <Route path={LOGIN} component={Login} />
    <Route path={ROOT} component={Layout} />
  </Switch>
)
