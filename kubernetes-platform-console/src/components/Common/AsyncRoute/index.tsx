import * as React from 'react'
import Loading from 'hocs/loading'
import ErrorWrap from 'hocs/error'

import { Route } from 'react-router-dom'
import { RouteProps } from 'react-router'
import { IAsyncState, AsyncStatus } from 'hooks/useRecoil'

export interface IAsyncRouteProps extends RouteProps {
  /** The selectedResourceState when the api request is initiated, the object attributes include loading, value, error */
  asyncState: IAsyncState<any>
  /** Component that needs to be rendered under the current route */
  LazyComponent: React.ComponentType
  /** The callback operation when the component is destroyed due to the routing change */
  onUnmounted?: () => void
}

/**
 * AsyncRoute is used for the unified processing of routing components,
 * such as adding Loading state, Error state or Empty state to the component,
 * and setting callback operations when routing changes.
 *
 * For more descriptions of properties inherited from React-router, such as location and exact, please refer to https://reactrouter.com/web/guides/quick-start
 */
const AsyncRoute: React.FC<IAsyncRouteProps> = ({ asyncState, LazyComponent, onUnmounted, ...others }) => {
  React.useEffect(() => {
    return () => {
      if (onUnmounted) {
        onUnmounted()
      }
    }
  }, [onUnmounted])

  return (
    <Route
      {...others}
      component={Loading(
        ErrorWrap(LazyComponent, asyncState.value, asyncState.error),
        asyncState.status === AsyncStatus.INITIAL || asyncState.status === AsyncStatus.ONGOING
      )}
    />
  )
}

export default AsyncRoute
