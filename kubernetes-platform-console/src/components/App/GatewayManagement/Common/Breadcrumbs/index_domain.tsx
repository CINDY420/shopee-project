import * as React from 'react'
import { useRecoilValue } from 'recoil'

import history from 'helpers/history'
import {
  selectedGateway as selectedGatewayState,
  selectedGatewayTenant as selectedGatewayTenantState
} from 'states/gatewayState'
import { selectedGatewayProject as selectedGatewayProjectState } from 'states/gatewayState/project'
import {
  GATEWAY,
  GATEWAY_SERVICES_GROUP_DETAIL,
  GATEWAY_SERVICES_PROJECT_DETAIL,
  buildGatewayGroupRoute
} from 'constants/routes/gateway/routes'

import BreadcrumbsBanner, { IBreadcrumbsBannerProps } from 'components/Common/BreadcrumbsBanner'
import { RESOURCE_TYPES } from 'constants/breadcrumb'

import Overlay from './Overlay'

enum CrumbType {
  GATEWAY = 'gateway',
  SERVICES_TENANT = 'tenant',
  SERVICES_PROJECT = 'project'
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
      }
    ]
  }
]

const crumbLookup = {
  [CrumbType.GATEWAY]: {},
  [CrumbType.SERVICES_TENANT]: {
    desc: 'Tenant: ',
    onClick: data => {
      const { gatewayType, tenantId } = data
      history.push(buildGatewayGroupRoute({ gatewayType, tenantId }))
    },
    overlay: () => <Overlay match={GATEWAY_SERVICES_GROUP_DETAIL} resourceType={RESOURCE_TYPES.TENANTS} />
  },
  [CrumbType.SERVICES_PROJECT]: {
    desc: 'Project: ',
    overlay: () => <Overlay match={GATEWAY_SERVICES_PROJECT_DETAIL} resourceType={RESOURCE_TYPES.PROJECTS} />
  }
}

const Breadcrumbs: React.FC = () => {
  const selectedProject = useRecoilValue(selectedGatewayProjectState)
  const selectedGateway = useRecoilValue(selectedGatewayState)
  const selectedTenant = useRecoilValue(selectedGatewayTenantState)

  return (
    <BreadcrumbsBanner
      crumbLookup={crumbLookup}
      crumbResourceLookup={{
        [CrumbType.GATEWAY]: selectedGateway,
        [CrumbType.SERVICES_TENANT]: selectedTenant,
        [CrumbType.SERVICES_PROJECT]: selectedProject
      }}
      routeCrumbsTree={routeCrumbsTree}
    />
  )
}

export default Breadcrumbs
