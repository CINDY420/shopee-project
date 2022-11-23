React component example:

```jsx
import * as React from 'react'
import { Router, Route } from 'react-router'
import { Tabs } from 'infrad'
import { useQueryParam, QueryParamProvider } from 'use-query-params'

import EnumStringParamGenerator from 'hooks/queryString/EnumStringParam'
import history from 'helpers/history'

const { TabPane } = Tabs

const { Prompt, Confirm } = PromptCreator({})

const Demo = () => {
  const TABS = ['tab1', 'tab2']

  const enumTabParam = React.useMemo(() => EnumStringParamGenerator(TABS, TABS[0]), [])
  const [selectedTab, setSelectedTab] = useQueryParam('selectedTab', enumTabParam)

  const isCurrentPosition = window.location.hash && window.location.hash.includes('promptcreator')

  return <div>
  <Tabs
      onChange={(key) => setSelectedTab(key)}
      activeKey={selectedTab}
    >
      <TabPane tab={TABS[0]} key={TABS[0]}>
        <Prompt when={isCurrentPosition} onlyPathname={false}>
          1234
        </Prompt>
      </TabPane>
      <TabPane tab={TABS[1]} key={TABS[1]}>
        <Prompt when={isCurrentPosition} onlyPathname={false}>
          5678
        </Prompt>
      </TabPane>
    </Tabs>
  </div>
}


<Router history={history}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <Demo />
  </QueryParamProvider>
</Router>
```
