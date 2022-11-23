import * as React from 'react'
import { Result } from 'infrad'

import NotFound from './notFound'

interface IError {
  code?: number
  details?: string[]
  message?: string
}

const ErrorWrap = (
  DecoratedComponent: React.ComponentType,
  resource: object | undefined,
  error: IError
): React.ComponentType => {
  if (error && error.code === 403) {
    return () => <Result status='403' title="You don't have permission to view this page" />
  }

  if (error && error.code === 404) {
    return () => <Result status='404' title="The resource you visited doesn't exist" />
  }

  if (error && (error.code === 500 || error.code === 503)) {
    return () => <Result status='500' subTitle={error.message || 'Sorry, the server is wrong.'} />
  }

  return NotFound(DecoratedComponent, resource)
}

export default ErrorWrap
