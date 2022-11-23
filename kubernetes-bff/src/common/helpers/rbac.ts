import { PLATFORM_TENANT_ID, RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'
import { ITenantPermissions } from 'common/modules/auth/auth.service'
import { IRbacUser } from 'rbac/entities/rbac.entity'

export const RBACCheckGroupResource = (rbacUser: IRbacUser, verb: string, groupName: string, resource: string) => {
  // const { groups = {} } = rbacUser || {}
  const groups = {}
  const groupRole = groups[groupName]
  if (groupRole) {
    const { rules } = groupRole
    const access = rules[resource]
    if (access) {
      const { availableVerbs } = access
      const flag = availableVerbs[verb]
      if (flag) return true
    }
  }
  return false
}

export const RBACCheckTenantResourceAction = (
  tenantPermissions: ITenantPermissions,
  tenantId: number,
  resource: RESOURCE_TYPE,
  action: RESOURCE_ACTION
): boolean => {
  const platformTenantPermissions = tenantPermissions[PLATFORM_TENANT_ID]

  // if this user has permission in all of the tenants
  if (
    platformTenantPermissions &&
    platformTenantPermissions[resource] &&
    platformTenantPermissions[resource].includes(action)
  ) {
    return true
  }

  const singleTenantPermissions = tenantPermissions[tenantId]
  if (
    singleTenantPermissions &&
    singleTenantPermissions[resource] &&
    singleTenantPermissions[resource].includes(action)
  ) {
    return true
  }

  return false
}
