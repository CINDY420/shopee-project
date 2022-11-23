import React from 'react'
import { RecoilState } from 'recoil'
import { tenantControllerGetTenant } from 'swagger-api/apis/Tenant'
import { projectControllerGetProject } from 'swagger-api/apis/Project'
import { jobControllerGetJob } from 'swagger-api/apis/Job'
import {
  selectedTenant,
  selectedProject,
  selectedJob,
  selectedCluster,
  selectedPeriodicJobInstance,
  selectedPeriodicJob,
} from 'states'
import { PERMISSION_RESOURCE } from 'constants/permission'
import { clusterControllerGetCluster } from 'swagger-api/apis/Cluster'
import { periodicJobControllerGetPeriodicJob } from 'swagger-api/apis/PeriodicJob'

export interface IRouteConfigMap {
  Component: React.LazyExoticComponent<React.FunctionComponent>
  asyncFn: (params: unknown) => Promise<unknown>
  recoilState: RecoilState<unknown>
  permissionKey: PERMISSION_RESOURCE
}

export enum ROUTE_GUARD_NAME {
  TENANT_DETAIL = 'tenantDetail',
  PROJECT_DETAIL = 'projectDetail',
  JOB_DETAIL = 'jobDetail',
  CLUSTER_DETAIL = 'clusterDetail',
  PERIODIC_JOB_DETAIL = 'periodicJobDetail',
  INSTANCE_DETAIL = 'instanceDetail',
}

export const routeConfigMap: Record<string, IRouteConfigMap> = {
  [ROUTE_GUARD_NAME.TENANT_DETAIL]: {
    Component: React.lazy(() => import('components/App/ProjectMGT/TenantDetail')),
    asyncFn: tenantControllerGetTenant,
    recoilState: selectedTenant,
    permissionKey: PERMISSION_RESOURCE.PROJECT,
  },
  [ROUTE_GUARD_NAME.PROJECT_DETAIL]: {
    Component: React.lazy(() => import('components/App/ProjectMGT/ProjectDetail')),
    asyncFn: projectControllerGetProject,
    recoilState: selectedProject,
    permissionKey: PERMISSION_RESOURCE.SHOPEE_JOB,
  },
  [ROUTE_GUARD_NAME.JOB_DETAIL]: {
    Component: React.lazy(() => import('components/App/ProjectMGT/JobDetail')),
    asyncFn: jobControllerGetJob,
    recoilState: selectedJob,
    permissionKey: PERMISSION_RESOURCE.POD,
  },
  [ROUTE_GUARD_NAME.CLUSTER_DETAIL]: {
    Component: React.lazy(() => import('components/App/ClusterManagement/ClusterDetail')),
    asyncFn: clusterControllerGetCluster,
    recoilState: selectedCluster,
    permissionKey: PERMISSION_RESOURCE.CLUSTER,
  },
  [ROUTE_GUARD_NAME.PERIODIC_JOB_DETAIL]: {
    Component: React.lazy(
      () =>
        import('components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail'),
    ),
    asyncFn: periodicJobControllerGetPeriodicJob,
    recoilState: selectedPeriodicJob,
    permissionKey: PERMISSION_RESOURCE.POD,
  },
  [ROUTE_GUARD_NAME.INSTANCE_DETAIL]: {
    Component: React.lazy(
      () =>
        import(
          'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail/PeriodicJobTabs/Instance/PeriodicInstanceDetail'
        ),
    ),
    asyncFn: jobControllerGetJob,
    recoilState: selectedPeriodicJobInstance,
    permissionKey: PERMISSION_RESOURCE.POD,
  },
}
