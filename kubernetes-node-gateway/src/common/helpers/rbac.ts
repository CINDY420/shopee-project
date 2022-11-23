import { ITenantPermissions } from '@/shared/auth/auth.interface'
import { PLATFORM_TENANT_ID, RESOURCE_ACTION, RESOURCE_TYPE } from '../constants/rbac'

export const RBACCheckTenantResourceAction = (
  tenantPermissions: ITenantPermissions,
  tenantId: number,
  resource: RESOURCE_TYPE,
  action: RESOURCE_ACTION,
): boolean => {
  const platformTenantPermissions = tenantPermissions[PLATFORM_TENANT_ID]

  // if this user has permission in all of the tenants
  if (platformTenantPermissions?.[resource]?.includes(action)) {
    return true
  }

  const singleTenantPermissions = tenantPermissions[tenantId]
  if (singleTenantPermissions?.[resource]?.includes(action)) {
    return true
  }

  return false
}
