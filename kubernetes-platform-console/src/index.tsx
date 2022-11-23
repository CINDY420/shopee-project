import * as React from 'react'
import { render } from 'react-dom'

import App from './App'

import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

import * as Sentry from '@sentry/react'
// Insert Sentry SDK
Sentry.init({
  dsn: 'https://d9d7beaaa0e54b51af3a19c6641386b8@sentry3.sto.shopee.io/42',

  // Only in live environment can sentry be enabled
  enabled: __SERVER_ENV__ === 'live',

  // Distinguish events with server
  environment: __SERVER_ENV__,
  release: __RELEASE__,
  // Ignore not found errors
  ignoreErrors: [/Not Found$/]
})

render(<App />, document.getElementById('root'))
