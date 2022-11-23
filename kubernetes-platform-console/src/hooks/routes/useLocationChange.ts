import * as React from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Trigger a callback function when location changes
 * @param callback A function which will be triggered when location changes
 */

export default callback => {
  const location = useLocation()
  React.useEffect(() => {
    callback(location)
  }, [location, callback])
}
