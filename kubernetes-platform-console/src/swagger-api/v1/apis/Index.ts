import fetch from 'helpers/fetchV1'
// import * as types from '../models'

type PingControllerPongFn = () => Promise<any>

export const pingControllerPong: PingControllerPongFn = async () => {
  const body = await fetch({
    resource: 'v1/ping',
    method: 'GET'
  })

  return body
}

export interface IRbacControllerGetResourcePermissionsParams {
  scope: string
  resources: (
    | 'Cluster'
    | 'ClusterQuota'
    | 'Node'
    | 'Tenant'
    | 'GlobalUser'
    | 'GlobalBot'
    | 'OperationLog'
    | 'TerminalTicket'
    | 'AccessTicket'
    | 'TenantUser'
    | 'TenantBot'
    | 'ProjectQuota'
    | 'Project'
    | 'Application'
    | 'Application/DeployConfig'
    | 'Service'
    | 'Ingress'
    | 'Deployment'
    | 'Pod'
    | 'Pod/Terminal'
    | 'Pipeline'
    | 'ReleaseFreeze'
    | 'OPS'
    | 'HPARules'
    | 'HPAController'
    | 'Zone'
  )[]
  tenantId?: string
}

type RbacControllerGetResourcePermissionsFn = (params: IRbacControllerGetResourcePermissionsParams) => Promise<{}>

export const rbacControllerGetResourcePermissions: RbacControllerGetResourcePermissionsFn = async ({
  scope,
  resources,
  tenantId
}) => {
  const body = await fetch({
    resource: `v1/rbac/resource/${scope}/accessControl`,
    method: 'GET',
    params: { resources, tenantId }
  })

  return body
}
