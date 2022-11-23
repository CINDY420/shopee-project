import * as React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import routeResourceDetectorHOC from 'react-resource-detector'

import { useRemoteRecoil } from 'hooks/useRecoil'
import { projectControllerGetDetail } from 'swagger-api/v1/apis/Project'
import { groupsControllerGetDetail } from 'swagger-api/v3/apis/Tenants'
import { getMatchResourceHandler } from 'helpers/routes'
import { TENANT_ID, PROJECT_ID, GATEWAY_ID } from 'constants/routes/identifier'
import AsyncRoute, { IAsyncRouteProps } from 'components/Common/AsyncRoute'
import { selectedGatewayProject } from 'states/gatewayState/project'
import { selectedGateway, selectedGatewayTenant } from 'states/gatewayState'

import { gatewaySelectedExpandedNodes, gatewaySelectedTreeNodes } from 'states/gatewayState/tree'

import { GATEWAYS } from 'constants/routes/routes'
import {
  GATEWAY,
  GATEWAY_SERVICES_GROUP_DETAIL,
  GATEWAY_SERVICES_PROJECT_DETAIL
} from 'constants/routes/gateway/routes'
import {
  GATEWAY_SERVICES_TENANT,
  GATEWAY_SERVICES_PROJECT,
  buildGatewayProjectName,
  buildGatewayName,
  buildGatewayGroupName
} from 'constants/routes/gateway/name'

import ProjectDetail from './ProjectDetail'

import { Root } from '../style'

interface IMatches {
  [key: string]: any
}

const GatewayManagement: React.FC & {
  resourceConfigurations?: object
  routeConfigurations?: object
} = () => {
  const [selectedProjectState, selectProjectFn, resetProjectFn] = useRemoteRecoil(
    projectControllerGetDetail, // TODO: service application api @zebin.lu
    selectedGatewayProject
  )

  const setSelectedGateway = useSetRecoilState(selectedGateway)
  const [, selectTenantFn] = useRemoteRecoil(groupsControllerGetDetail, selectedGatewayTenant)

  const setSelectedTreeNodes = useSetRecoilState(gatewaySelectedTreeNodes)
  const setSelectedExpandedNodes = useSetRecoilState(gatewaySelectedExpandedNodes)

  GatewayManagement.resourceConfigurations = {
    [GATEWAY_SERVICES_TENANT]: getMatchResourceHandler((data: IMatches) => {
      const tenantId = data[TENANT_ID]

      selectTenantFn({ tenantId })
    }),
    [GATEWAY_SERVICES_PROJECT]: getMatchResourceHandler((data: IMatches) => {
      const gatewayType = data[GATEWAY_ID]
      const tenantId = data[TENANT_ID]
      const projectName = data[PROJECT_ID]

      setSelectedGateway({ name: gatewayType })

      setSelectedTreeNodes([buildGatewayProjectName({ gatewayType, tenantId, projectName })])
      setSelectedExpandedNodes([buildGatewayName({ gatewayType }), buildGatewayGroupName({ gatewayType, tenantId })])
      selectProjectFn({ tenantId, projectName })
    })
  }

  const asyncRoutes: Array<IAsyncRouteProps> = [
    {
      path: GATEWAY_SERVICES_PROJECT_DETAIL,
      LazyComponent: ProjectDetail,
      asyncState: selectedProjectState,
      onUnmounted: resetProjectFn
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

GatewayManagement.routeConfigurations = {
  [GATEWAY_SERVICES_GROUP_DETAIL]: {
    whiteList: [GATEWAY, GATEWAY_SERVICES_TENANT]
  },
  [GATEWAY_SERVICES_PROJECT_DETAIL]: {
    whiteList: [GATEWAY, GATEWAY_SERVICES_TENANT, GATEWAY_SERVICES_PROJECT]
  }
}

export default routeResourceDetectorHOC(GatewayManagement, { shouldDetectResourceForAllRoutes: true })
