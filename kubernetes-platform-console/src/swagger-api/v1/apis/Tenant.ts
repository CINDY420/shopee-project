import fetch from 'helpers/fetchV1'
import * as types from '../models'

type TenantControllerListEnableHybridDeployTenantsFn = () => Promise<types.IListEnableHybridDeployTenantsResponse>

export const tenantControllerListEnableHybridDeployTenants: TenantControllerListEnableHybridDeployTenantsFn = async () => {
  const body = await fetch({
    resource: 'v1/tenant:enableHybridDeployTenants',
    method: 'GET'
  })

  return body
}
