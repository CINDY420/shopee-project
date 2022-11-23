import * as React from 'react'
import { RecoilRoot } from 'recoil'
import { Router } from 'react-router'
import { Route } from 'react-router-dom'
import { ConfigProvider } from 'infrad'
import 'infrad/dist/antd.less'

import AppLayout from 'components/App'
import history from 'helpers/history'
import { QueryParamProvider } from 'use-query-params'

import { prometheusControllerPostPerformance } from 'swagger-api/v3/apis/Index'

import './global.css'

// Report document completed duration
window.addEventListener('load', async () => {
  const loadingDuration = performance.timing.domComplete - performance.timing.navigationStart
  try {
    await prometheusControllerPostPerformance({ payload: { loadingDuration } })
  } catch (err) {
    // There is no need to show err
  }
})

const App: React.FC = () => (
  <RecoilRoot>
    <Router history={history}>
      <QueryParamProvider ReactRouterRoute={Route}>
        <ConfigProvider getPopupContainer={triggerNode => triggerNode}>
          <AppLayout />
        </ConfigProvider>
      </QueryParamProvider>
    </Router>
  </RecoilRoot>
)

export default App
