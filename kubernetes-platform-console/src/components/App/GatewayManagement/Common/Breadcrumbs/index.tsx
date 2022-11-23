import * as React from 'react'
import { useRecoilValue } from 'recoil'

import history from 'helpers/history'
import {
  selectedGateway as selectedGatewayState,
  selectedGatewayLoadBalanceResourceType as selectedGatewayLoadBalanceResourceTypeState
} from 'states/gatewayState'
import { selectedGatewayProject as selectedGatewayProjectState } from 'states/gatewayState/project'
import {
  GATEWAY,
  GATEWAY_SERVICES_GROUP_DETAIL,
  GATEWAY_SERVICES_PROJECT_DETAIL,
  GATEWAY_LOAD_BALANCE_RESOURCE,
  buildGatewayGroupRoute
} from 'constants/routes/gateway/routes'

import BreadcrumbsBanner, { IBreadcrumbsBannerProps } from 'components/Common/BreadcrumbsBanner'
import { RESOURCE_TYPES } from 'constants/breadcrumb'

import Overlay from './Overlay'

enum CrumbType {
  GATEWAY = 'gateway',
  SERVICES_TENANT = 'tenant',
  SERVICES_PROJECT = 'project',
  LOAD_BALANCE_GIT_TEMPLATE_RENDER = 'git template render'
}

const routeCrumbsTree: IBreadcrumbsBannerProps['routeCrumbsTree'] = [
  {
    route: GATEWAY,
    extendedCrumbs: CrumbType.GATEWAY,
    children: [
      {
        route: GATEWAY_SERVICES_GROUP_DETAIL,
        extendedCrumbs: CrumbType.SERVICES_TENANT,
        children: [
          {
            route: GATEWAY_SERVICES_PROJECT_DETAIL,
            extendedCrumbs: CrumbType.SERVICES_PROJECT
          }
        ]
      },
      {
        route: GATEWAY_LOAD_BALANCE_RESOURCE,
        extendedCrumbs: CrumbType.LOAD_BALANCE_GIT_TEMPLATE_RENDER
      }
    ]
  }
]

const crumbLookup = {
  [CrumbType.GATEWAY]: {},
  [CrumbType.SERVICES_TENANT]: {
    desc: 'Tenant:',
    onClick: data => {
      const { gatewayType, id } = data
      history.push(buildGatewayGroupRoute({ gatewayType, tenantId: id }))
    },
    overlay: () => <Overlay match={GATEWAY_SERVICES_GROUP_DETAIL} resourceType={RESOURCE_TYPES.TENANTS} />
  },
  [CrumbType.SERVICES_PROJECT]: {
    desc: 'Project:',
    overlay: () => <Overlay match={GATEWAY_SERVICES_PROJECT_DETAIL} resourceType={RESOURCE_TYPES.PROJECTS} />
  },
  [CrumbType.LOAD_BALANCE_GIT_TEMPLATE_RENDER]: {}
}

const Breadcrumbs: React.FC = () => {
  const selectedProject = useRecoilValue(selectedGatewayProjectState)
  const { tenantName, tenantId } = selectedProject
  const selectedGateway = useRecoilValue(selectedGatewayState)
  const selectedGatewayLoadBalanceResourceType = useRecoilValue(selectedGatewayLoadBalanceResourceTypeState)

  return (
    <BreadcrumbsBanner
      crumbLookup={crumbLookup}
      crumbResourceLookup={{
        [CrumbType.GATEWAY]: selectedGateway,
        [CrumbType.SERVICES_TENANT]: { name: tenantName, id: tenantId },
        [CrumbType.SERVICES_PROJECT]: selectedProject,
        [CrumbType.LOAD_BALANCE_GIT_TEMPLATE_RENDER]: selectedGatewayLoadBalanceResourceType
      }}
      routeCrumbsTree={routeCrumbsTree}
    />
  )
}

export default Breadcrumbs
