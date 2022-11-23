import * as React from 'react'
import BreadcrumbsBanner, { IBreadcrumbsBannerProps } from 'components/Common/BreadcrumbsBanner'
import history from 'helpers/history'

import { selectedApplication as selectedApplicationState } from 'states/applicationState/application'
import { selectedTenant } from 'states/applicationState/tenant'
import { selectedProject as selectedProjectState } from 'states/applicationState/project'
import { selectedPod as selectedPodState } from 'states/applicationState/pod'
import { selectedDeployment as selectedDeploymentState } from 'states/applicationState/deployment'
import { useRecoilValue } from 'recoil'
import { buildTenantName, buildProjectName, buildApplicationName, buildDeploymentName } from 'constants/routes/name'
import {
  TENANT_DETAIL,
  PROJECT_DETAIL,
  APPLICATION_DETAIL,
  APPLICATIONS,
  POD_DETAIL,
  DEPLOYMENT_DETAIL
} from 'constants/routes/routes'
import { RESOURCE_TYPES } from 'constants/breadcrumb'

import Overlay from './Overlay'

enum CrumbType {
  TENANT = 'tenant',
  PROJECT = 'project',
  APPLICATION = 'application',
  POD = 'pod',
  DEPLOYMENT = 'deployment'
}

const routeCrumbsTree: IBreadcrumbsBannerProps['routeCrumbsTree'] = [
  {
    route: TENANT_DETAIL,
    extendedCrumbs: CrumbType.TENANT,
    children: [
      {
        route: PROJECT_DETAIL,
        extendedCrumbs: CrumbType.PROJECT,
        children: [
          {
            route: APPLICATION_DETAIL,
            extendedCrumbs: CrumbType.APPLICATION,
            children: [
              {
                route: DEPLOYMENT_DETAIL,
                extendedCrumbs: CrumbType.DEPLOYMENT,
                children: [
                  {
                    // TODO add deployment layer here
                    route: POD_DETAIL,
                    extendedCrumbs: CrumbType.POD
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

const crumbLookup = {
  [CrumbType.TENANT]: {
    desc: 'Tenant:',
    onClick: data => {
      history.push(`${APPLICATIONS}/${buildTenantName(data.id)}`)
    },
    overlay: () => <Overlay match={TENANT_DETAIL} resourceType={RESOURCE_TYPES.TENANTS} />
  },
  [CrumbType.PROJECT]: {
    desc: 'Project:',
    onClick: data => {
      history.push(`${APPLICATIONS}/${buildProjectName(data.tenantId, data.name)}`)
    },
    overlay: () => <Overlay match={PROJECT_DETAIL} resourceType={RESOURCE_TYPES.PROJECTS} />
  },
  [CrumbType.APPLICATION]: {
    desc: 'Application:',
    onClick: data => {
      history.push(`${APPLICATIONS}/${buildApplicationName(data.tenantId, data.projectName, data.name)}`)
    },
    overlay: () => <Overlay match={APPLICATION_DETAIL} resourceType={RESOURCE_TYPES.APPLICATIONS} />
  },
  [CrumbType.POD]: {
    desc: 'Pod:'
  },
  [CrumbType.DEPLOYMENT]: {
    desc: 'Deployment:',
    onClick: data => {
      history.push({
        pathname: `${APPLICATIONS}/${buildDeploymentName(
          data.tenantId,
          data.projectName,
          data.applicationName,
          data.name,
          data.clusterId
        )}`
      })
    }
  }
}

const Breadcrumbs: React.FC<{}> = () => {
  const selectedApplication = useRecoilValue(selectedApplicationState)
  const selectedGroup = useRecoilValue(selectedTenant)
  const selectedProject = useRecoilValue(selectedProjectState)
  const selectedPod = useRecoilValue(selectedPodState)
  const selectedDeployment = useRecoilValue(selectedDeploymentState)

  return (
    <BreadcrumbsBanner
      crumbLookup={crumbLookup}
      crumbResourceLookup={{
        [CrumbType.TENANT]: selectedGroup,
        [CrumbType.PROJECT]: selectedProject,
        [CrumbType.APPLICATION]: selectedApplication,
        [CrumbType.POD]: selectedPod,
        [CrumbType.DEPLOYMENT]: {
          tenantId: selectedApplication.tenantId,
          projectName: selectedApplication.projectName,
          applicationName: selectedApplication.name,
          clusterId: selectedPod.clusterId,
          ...selectedDeployment
        }
      }}
      routeCrumbsTree={routeCrumbsTree}
    />
  )
}

export default Breadcrumbs
