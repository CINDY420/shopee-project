import React from 'react'
import { Navigate, Outlet, RouteObject } from 'react-router-dom'
import {
  LOGIN,
  ACCESS_APPLY,
  ROOT,
  PROJECT_MGT,
  TENANT,
  PROJECT,
  JOB,
  PLATFORMS,
  TENANTS,
  CLUSTER_MANAGEMENT,
  CLUSTER,
  CREATE_PERIODIC_JOB,
  PERIODIC_JOB,
  PERIODIC_INSTANCE,
  EDIT_PERIODIC_JOB,
  CREATE_JOB,
  EDIT_JOB,
  OPERATION_HISTORY,
} from 'constants/routes/route'
import RouteGuard from 'components/Common/RouteGuard'
import { ROUTE_GUARD_NAME } from 'constants/routes/routeConfigMap'
import { IUserInfo } from 'helpers/session'
import { PERMISSION_RESOURCE } from 'constants/permission'
import { checkPermission, hasRole } from 'helpers/permission'
import Layout from 'components/App/Layout'
import Login from 'components/App/Login'
import AccessApply from 'components/App/AccessApply'
import { CLUSTER_ADMIN_ID, PLATFORM_ADMIN_ID } from 'constants/auth'
import Cluster from 'components/App/ClusterManagement/Cluster'
import CreatePeriodicJob from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob'
import CreateJob from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob'
import OperationHistory from 'components/App/OperationHistory'
const ProjectMGT = React.lazy(() => import('components/App/ProjectMGT'))
const Platform = React.lazy(() => import('components/App/Platform'))
const TenantManagement = React.lazy(() => import('components/App/TenantManagement'))

interface IListRoutesProps {
  pathRedirectToTenant?: string
  permissions?: IUserInfo['permissions']
  roles?: IUserInfo['roles']
}

interface IPermissionChildrenRoute extends RouteObject {
  permissionKey?: string
  roleKeys?: string[]
}

export const listRoutes = ({
  pathRedirectToTenant,
  permissions,
  roles,
}: IListRoutesProps): RouteObject[] => {
  const hasPermissionChildrenRoutes: IPermissionChildrenRoute[] = [
    {
      path: PROJECT_MGT,
      element: <ProjectMGT />,
      permissionKey: PERMISSION_RESOURCE.PROJECT,
      children: [
        { path: TENANT, element: <RouteGuard name={ROUTE_GUARD_NAME.TENANT_DETAIL} /> },
        { path: PROJECT, element: <RouteGuard name={ROUTE_GUARD_NAME.PROJECT_DETAIL} /> },
        { path: JOB, element: <RouteGuard name={ROUTE_GUARD_NAME.JOB_DETAIL} /> },
        { path: CREATE_JOB, element: <CreateJob /> },
        { path: EDIT_JOB, element: <CreateJob /> },
        { path: CREATE_PERIODIC_JOB, element: <CreatePeriodicJob /> },
        { path: CREATE_PERIODIC_JOB, element: <CreatePeriodicJob /> },
        { path: EDIT_PERIODIC_JOB, element: <CreatePeriodicJob /> },
        { path: PERIODIC_JOB, element: <RouteGuard name={ROUTE_GUARD_NAME.PERIODIC_JOB_DETAIL} /> },
        {
          path: PERIODIC_INSTANCE,
          element: <RouteGuard name={ROUTE_GUARD_NAME.INSTANCE_DETAIL} />,
        },
        {
          path: PROJECT_MGT,
          element: pathRedirectToTenant ? <Navigate to={pathRedirectToTenant} /> : null,
        },
      ],
    },
    { path: PLATFORMS, element: <Platform />, roleKeys: [PLATFORM_ADMIN_ID] },
    { path: TENANTS, element: <TenantManagement />, roleKeys: [PLATFORM_ADMIN_ID] },
    { path: OPERATION_HISTORY, element: <OperationHistory />, roleKeys: [PLATFORM_ADMIN_ID] },
    {
      path: CLUSTER_MANAGEMENT,
      element: <Outlet />,
      roleKeys: [CLUSTER_ADMIN_ID, PLATFORM_ADMIN_ID],
      children: [
        { path: CLUSTER_MANAGEMENT, element: <Cluster /> },
        { path: CLUSTER, element: <RouteGuard name={ROUTE_GUARD_NAME.CLUSTER_DETAIL} /> },
      ],
    },
    { path: ACCESS_APPLY, element: <AccessApply /> },
  ].filter((item) => {
    if (!permissions) return true

    if (item.permissionKey) return checkPermission(permissions, item.permissionKey)

    if (item.roleKeys && roles) return item.roleKeys.some((roleKey) => hasRole(roles, roleKey))

    return true
  })

  return [
    { path: LOGIN, element: <Login /> },
    {
      path: ROOT,
      element: <Layout />,
      children: hasPermissionChildrenRoutes,
    },
    { path: '*', element: pathRedirectToTenant ? <Navigate to={pathRedirectToTenant} /> : null },
  ]
}
