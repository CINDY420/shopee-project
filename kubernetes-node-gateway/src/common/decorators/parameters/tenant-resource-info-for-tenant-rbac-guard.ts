import { SetMetadata } from '@nestjs/common'
import { RESOURCE_TYPE, RESOURCE_ACTION, RBAC_TENANT_RESOURCE_ACTION_META_KEY } from '@/common/constants/rbac'

export enum TENANT_LOCATION {
  PARAMS = 'params',
  QUERY = 'query',
}
export type TenantResourcePermissionMeta = [TENANT_LOCATION, string, RESOURCE_TYPE, RESOURCE_ACTION]

/**
 * set the meta data for tenant resource rbac check
 * @param groupLocation params or query string
 * @param tenantIdKey key of tenantId which is used to retrieve group name from groupLocation
 * @param resource resource name
 * @param action verb
 * @example
 * @TenantResourceInfoForTenantRbacGuard({
 *  tenantIdLocation: TENANT_LOCATION.PARAMS,
 *  tenantIdKey: 'tenantId',
 *  resource: RESOURCE_TYPE.Pod,
 *  action: RESOURCE_ACTION.VIEW
 * })
 * get() {
 *  // your business code
 * }
 */
export const TenantResourceInfoForTenantRbacGuard = ({
  tenantIdLocation,
  tenantIdKey,
  resource,
  action,
}: {
  tenantIdLocation: TENANT_LOCATION
  tenantIdKey: string
  resource: RESOURCE_TYPE
  action: RESOURCE_ACTION
}) => SetMetadata(RBAC_TENANT_RESOURCE_ACTION_META_KEY, [tenantIdLocation, tenantIdKey, resource, action])
