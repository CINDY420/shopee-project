
```jsx
import * as React from 'react'
import { Router } from 'react-router'

import history from 'helpers/history'

const CrumbType  = {
  REQUESTS: 'requests',
  REQUEST: 'request'
}

const routeCrumbsTree = [
  {
    route: '/',
    extendedCrumbs: CrumbType.REQUESTS,
    children: [
      {
        route: '/request',
        extendedCrumbs: CrumbType.REQUEST
      }
    ]
  }
]

const crumbLookup = {
  [CrumbType.REQUESTS]: {
    onClick: data => {
      history.push('/')
    }
  }
}

const crumbResourceLookup = {
  [CrumbType.REQUESTS]: { name: 'All requests' },
  [CrumbType.REQUEST]: { name: 'Request detail' }
}

const uselessFunction = () => {}

<Router history={history}>
  <BreadcrumbsBanner
    crumbLookup={crumbLookup}
    crumbResourceLookup={crumbResourceLookup}
    routeCrumbsTree={routeCrumbsTree}
  />
</Router>
```


