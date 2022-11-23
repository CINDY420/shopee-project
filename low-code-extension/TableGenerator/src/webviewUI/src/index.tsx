import * as React from 'react'
import { render } from 'react-dom'

import App from './App'

// import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

render(<App />, document.getElementById('root'))

// Connect HMR
if ((module as any).hot) {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(module as any).hot.accept(['./App'], () => {
    // Store definition changed, recreate a new one from old state
    render(<App />, document.getElementById('root'))
  })
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(module as any).hot.accept([], () => {
    // Component definition changed, re-render app
    render(<App />, document.getElementById('root'))
  })
}
