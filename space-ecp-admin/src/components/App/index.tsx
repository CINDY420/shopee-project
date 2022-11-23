import React from 'react'
import Layout from 'src/components/App/Layout'
import { ConfigProvider } from 'infrad'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5'
import { parse, stringify } from 'query-string'

// set global config here
const App: React.FC = () => (
  <QueryParamProvider
    adapter={ReactRouter5Adapter}
    options={{
      searchStringToObject: parse,
      objectToSearchString: stringify,
    }}
  >
    <ConfigProvider
      getPopupContainer={(triggerNode) => {
        if (triggerNode) {
          return triggerNode.parentNode as HTMLElement
        }
        return document.body
      }}
    >
      <Layout />
    </ConfigProvider>
  </QueryParamProvider>
)

export default App
