import React from 'react'
import { ConfigProvider } from 'infrad'
import { QueryParamProvider } from 'use-query-params'
import { Route, Switch, Redirect } from 'react-router'
import { DEFAULT_ROUTE, NO_PERMISSION } from 'src/constants/routes/routes'
import Layout from 'src/components/App/Layout'
import NoPermission from 'src/components/App/NoPermission'

import 'infrad/dist/antd.css'

// set global config here
const App: React.FC = () => (
  <QueryParamProvider ReactRouterRoute={Route}>
    <ConfigProvider getPopupContainer={(triggerNode) => triggerNode}>
      <Switch>
        <Route path={DEFAULT_ROUTE} component={Layout} />
        <Route path={NO_PERMISSION} component={NoPermission} />
        <Redirect to={DEFAULT_ROUTE} />
      </Switch>
    </ConfigProvider>
  </QueryParamProvider>
)

export default App
