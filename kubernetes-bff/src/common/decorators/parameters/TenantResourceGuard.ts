import { SetMetadata } from '@nestjs/common'
import { RESOURCE_TYPE, RESOURCE_ACTION, RBAC_TENANT_RESOURCE_ACTION_META_KEY } from 'common/constants/rbac'

export enum TENANT_LOCATION {
  PARAMS = 'params',
  QUERY = 'query'
}
export type TENANT_RESOURCE_PERMISSION_META = [TENANT_LOCATION, string, RESOURCE_TYPE, RESOURCE_ACTION]

/**
 * set the meta data for tenant resource rbac check
 * @param groupLocation params or query string
 * @param tenantIdKey key of tenantId which is used to retrieve group name from groupLocation
 * @param resource resource name
 * @param verb verb
 * @example
 * @TenantResourceGuard({
 *  tenantIdLocation: TENANT_LOCATION.PARAMS,
 *  tenantIdKey: 'tenantId',
 *  resource: RESOURCE_TYPE.Pod,
 *  action: RESOURCE_ACTION.VIEW
 * })
 * get() {
 *  // your business code
 * }
 */
export const TenantResourceGuard = ({
  tenantIdLocation,
  tenantIdKey,
  resource,
  action
}: {
  tenantIdLocation: TENANT_LOCATION
  tenantIdKey: string
  resource: RESOURCE_TYPE
  action: RESOURCE_ACTION
}) => {
  return SetMetadata(RBAC_TENANT_RESOURCE_ACTION_META_KEY, [tenantIdLocation, tenantIdKey, resource, action])
}
