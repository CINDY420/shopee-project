import * as React from 'react'
import { useHistory } from 'react-router-dom'

export const ECP_REGION_QUERY_KEY = 'ecp_region'
export const DEFAULT_REGION = 'ap'

const RouteSetRegion: React.FC = () => {
  const history = useHistory()

  React.useEffect(() => {
    const search = new URLSearchParams(history.location.search)
    const ecpRegion = search.get(ECP_REGION_QUERY_KEY)
    if (ecpRegion) {
      localStorage.setItem(ECP_REGION_QUERY_KEY, ecpRegion)
    }
  }, [history.location])

  const setRegion = React.useCallback(() => {
    const search = new URLSearchParams(history.location.search)
    const lastEcpRegion = localStorage.getItem(ECP_REGION_QUERY_KEY)
    const ecpRegion = lastEcpRegion === 'null' ? DEFAULT_REGION : lastEcpRegion
    if (!search.get(ECP_REGION_QUERY_KEY)) {
      search.append(ECP_REGION_QUERY_KEY, ecpRegion)
      history.location.search = `?${search.toString()}`
      history.replace(history.location)
    }
  }, [history])

  React.useEffect(() => {
    setRegion()
  }, [setRegion])

  return null
}

export default RouteSetRegion
