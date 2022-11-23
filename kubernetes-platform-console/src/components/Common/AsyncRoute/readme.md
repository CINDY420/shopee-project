React component example:

```jsx
import * as React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { Router } from 'react-router'
import { createBrowserHistory } from 'history'

import { AsyncStatus } from 'hooks/useRecoil'

const PATHS = {
  A: '/',
  B: '/b',
  C: '/c'
}

const asyncRoutes = [
    {
      path: PATHS.A,
      LazyComponent: () => <div>aaaaaaa</div>,
      asyncState: {
        loading: AsyncStatus.FINISHED,
        value: 'aaaaa'
      }
    },
    {
      path: PATHS.B,
      LazyComponent: () => <div>error example</div>,
      asyncState: {
        loading: AsyncStatus.Error,
        error: {
          message: 'no permission',
          code: 403,
          details: []
        }
      },
      onUnmounted: () => {
        message.info('run onUnmounted function!')
      }
    },
    {
      path: PATHS.C,
      LazyComponent: () => <div>loading example</div>,
      asyncState: {
        loading: AsyncStatus.ONGOING
      }
    }
  ]


// 这个函数是为了解决style guide的报错，没实际用处
const noUse = () => {}

<Router history={createBrowserHistory()}>
  <Switch>
    {asyncRoutes.map(({ path, LazyComponent, asyncState, onUnmounted }) => (
      <AsyncRoute exact key={path} path={path} LazyComponent={LazyComponent} asyncState={asyncState} onUnmounted={onUnmounted} />
    ))}
  </Switch>
</Router>
```
