import * as React from 'react'
import { Result } from 'infrad'

/**
 * HOC for getting protected component, user needs to pass a checker function to determine
 * if the decorated component should be shown
 * @param DecoratedComponent decorated component
 * @param checker checker function
 */
const Protected = (DecoratedComponent: React.ComponentType, checker: () => boolean): React.ComponentType => {
  return checker()
    ? DecoratedComponent
    : () => <Result status='403' title="You don't have permission to view this page" />
}

export default Protected
