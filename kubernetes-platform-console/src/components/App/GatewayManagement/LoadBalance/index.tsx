import * as React from 'react'
import { useSetRecoilState } from 'recoil'
import { Switch, Redirect, Route } from 'react-router-dom'
import routeResourceDetectorHOC from 'react-resource-detector'

import { selectedGateway, selectedGatewayLoadBalanceResourceType } from 'states/gatewayState'
import { getMatchResourceHandler } from 'helpers/routes'
import { gatewaySelectedExpandedNodes, gatewaySelectedTreeNodes } from 'states/gatewayState/tree'

import { GATEWAY_ID, RESOURCE_ID } from 'constants/routes/identifier'
import {
  buildGatewayName,
  GATEWAY_LOAD_BALANCE_RESOURCE as GATEWAY_LOAD_BALANCE_RESOURCE_NAME,
  buildGatewayLoadBalanceResourceName
} from 'constants/routes/gateway/name'
import {
  GATEWAY,
  GATEWAY_LOAD_BALANCE_RESOURCE,
  GATEWAY_LOAD_BALANCE_GIT_TEMPLATE_RENDER
} from 'constants/routes/gateway/routes'

import GitTemplateRender from './GitTemplateRender'

import { Root } from '../style'

interface IMatches {
  [key: string]: any
}

const LoadBalance: React.FC & {
  resourceConfigurations?: object
  routeConfigurations?: object
} = () => {
  const setSelectedGateway = useSetRecoilState(selectedGateway)
  const setSelectedGatewayLoadBalanceResourceType = useSetRecoilState(selectedGatewayLoadBalanceResourceType)

  const setSelectedTreeNodes = useSetRecoilState(gatewaySelectedTreeNodes)
  const setSelectedExpandedNodes = useSetRecoilState(gatewaySelectedExpandedNodes)

  LoadBalance.resourceConfigurations = {
    [GATEWAY_LOAD_BALANCE_RESOURCE_NAME]: getMatchResourceHandler((data: IMatches) => {
      const gatewayType = data[GATEWAY_ID]
      const resourceName = data[RESOURCE_ID]

      setSelectedGateway({ name: gatewayType })
      setSelectedGatewayLoadBalanceResourceType({ name: resourceName, gatewayType })

      setSelectedTreeNodes([buildGatewayLoadBalanceResourceName({ gatewayType, resourceName })])
      setSelectedExpandedNodes([buildGatewayName({ gatewayType })])
    })
  }

  return (
    <Root>
      <Switch>
        <Route path={GATEWAY_LOAD_BALANCE_GIT_TEMPLATE_RENDER} component={GitTemplateRender} />
        <Redirect from='/' to={GATEWAY_LOAD_BALANCE_GIT_TEMPLATE_RENDER} />
      </Switch>
    </Root>
  )
}

LoadBalance.routeConfigurations = {
  [GATEWAY_LOAD_BALANCE_RESOURCE]: {
    whiteList: [GATEWAY, GATEWAY_LOAD_BALANCE_RESOURCE_NAME]
  }
}

export default routeResourceDetectorHOC(LoadBalance, { shouldDetectResourceForAllRoutes: true })
