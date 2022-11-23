import * as React from 'react'
import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'infrad'
import 'infrad/dist/antd.less'
import GlobalStyle from 'common-styles/globalStyles'
import AppIndex from 'components/App'

/*
 * Report document completed duration
 * window.addEventListener('load', async () => {
 *   const loadingDuration = performance.timing.domComplete - performance.timing.navigationStart
 *   try {
 *     await prometheusControllerPostPerformance({ payload: { loadingDuration } })
 *   } catch (err) {
 *     // There is no need to show err
 *   }
 * })
 */

const App: React.FC = () => (
  <RecoilRoot>
    <GlobalStyle />
    <BrowserRouter>
      <ConfigProvider getPopupContainer={() => document.body}>
        <AppIndex />
      </ConfigProvider>
    </BrowserRouter>
  </RecoilRoot>
)

export default App
