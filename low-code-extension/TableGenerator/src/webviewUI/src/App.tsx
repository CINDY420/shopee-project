import * as React from 'react'
import { RecoilRoot } from 'recoil'
import { ConfigProvider } from 'antd'
// import 'antd/dist/antd.css'
import 'antd/dist/antd.dark.css'
import AppLayout from 'components/App'

import './global.css'

const App: React.FC = () => (
  <RecoilRoot>
    <ConfigProvider
      getPopupContainer={(triggerNode) => {
        if (triggerNode) return triggerNode
        return document.body
      }}
    >
      <AppLayout />
    </ConfigProvider>
  </RecoilRoot>
)

export default App
