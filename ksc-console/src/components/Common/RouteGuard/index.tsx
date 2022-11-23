import { useParams } from 'react-router-dom'
import { useDeepCompareEffect } from 'react-use'
import { useRemoteRecoil, ASYNC_STATUS } from 'hooks/useRecoil'
import { routeConfigMap, ROUTE_GUARD_NAME } from 'constants/routes/routeConfigMap'
import ErrorComponent from 'components/Common/ErrorComponent'
import { Row, Spin } from 'infrad'

interface IRouteGuardProps {
  name: ROUTE_GUARD_NAME
}

const RouteGuard = ({ name }: IRouteGuardProps) => {
  const params = useParams()

  const { Component, asyncFn, recoilState } = routeConfigMap[name] || {}
  const [selectedState, selectFn] = useRemoteRecoil(asyncFn, recoilState)

  useDeepCompareEffect(() => {
    selectFn?.(params)
  }, [params])

  if (selectedState.status === ASYNC_STATUS.FINISHED && Component) return <Component />

  if (selectedState.status === ASYNC_STATUS.ERROR) {
    if (selectedState?.error?.code === 403) return <ErrorComponent status="403" />

    return <ErrorComponent status="error" />
  }

  if (selectedState.status === ASYNC_STATUS.INITIAL) return null

  if (selectedState.status === ASYNC_STATUS.ONGOING)
    return (
      <Row justify="center" align="middle" style={{ width: '100%', height: '100%' }}>
        <Spin />
      </Row>
    )

  return null
}

export default RouteGuard
