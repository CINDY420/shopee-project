import * as React from 'react'
import { Result } from 'infrad'

const NotFound = (DecoratedComponent: React.ComponentType, resource: object | undefined): React.ComponentType => {
  return resource === undefined
    ? () => <Result status='404' title="The resource you visited doesn't exist" />
    : DecoratedComponent
}

export default NotFound
