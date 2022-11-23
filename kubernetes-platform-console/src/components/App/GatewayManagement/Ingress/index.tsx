import * as React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import routeResourceDetectorHOC from 'react-resource-detector'

import { getMatchResourceHandler } from 'helpers/routes'
import { useRemoteRecoil } from 'hooks/useRecoil'
import { GATEWAY_INGRESS, GATEWAY, buildIngressName, buildGatewayName } from 'constants/routes/gateway/name'
import { CLUSTER_ID, GATEWAY_ID } from 'constants/routes/identifier'
import { GATEWAYS } from 'constants/routes/routes'
import { GATEWAY_INGRESS_LIST } from 'constants/routes/gateway/routes'

import { selectedIngress } from 'states/gatewayState'
import { selectedClusterIngress } from 'states/gatewayState/ingress'
import { gatewaySelectedExpandedNodes, gatewaySelectedTreeNodes } from 'states/gatewayState/tree'
import { clustersControllerGetClusterInfo } from 'swagger-api/v3/apis/Cluster'

import AsyncRoute, { IAsyncRouteProps } from 'components/Common/AsyncRoute'
import IngressList from './IngressList'

import { Root } from '../style'

interface IMatches {
  [key: string]: any
}

const Ingress: React.FC & {
  resourceConfigurations?: object
  routeConfigurations?: object
} = () => {
  const [selectedClusterState, setClusterName, resetClusterFn] = useRemoteRecoil(
    clustersControllerGetClusterInfo,
    selectedClusterIngress
  )

  const setSelectedIngress = useSetRecoilState(selectedIngress)
  const setSelectedTreeNodes = useSetRecoilState(gatewaySelectedTreeNodes)
  const setSelectedExpandedNodes = useSetRecoilState(gatewaySelectedExpandedNodes)

  Ingress.resourceConfigurations = {
    [GATEWAY_INGRESS]: getMatchResourceHandler((data: IMatches) => {
      const gatewayType = data[GATEWAY_ID]
      const clusterId = data[CLUSTER_ID]

      setSelectedIngress({ name: clusterId })
      setSelectedTreeNodes([buildIngressName({ gatewayType, clusterName: clusterId })])
      setSelectedExpandedNodes([buildGatewayName({ gatewayType })])
      setClusterName({ clusterName: clusterId })
    })
  }

  const asyncRoutes: Array<IAsyncRouteProps> = [
    {
      path: GATEWAY_INGRESS_LIST,
      LazyComponent: IngressList,
      asyncState: selectedClusterState,
      onUnmounted: resetClusterFn
    }
  ]

  return (
    <Root>
      <Switch>
        {asyncRoutes.map(props => (
          <AsyncRoute exact key={props.path as string} {...props} />
        ))}
        <Redirect from='/' to={GATEWAYS} />
      </Switch>
    </Root>
  )
}

Ingress.routeConfigurations = {
  [GATEWAY_INGRESS_LIST]: {
    whiteList: [GATEWAY, GATEWAY_INGRESS]
  }
}

export default routeResourceDetectorHOC(Ingress, { shouldDetectResourceForAllRoutes: true })
