import { AccessRequestPermissionType } from 'constants/rbacActions'
import { getSession } from 'helpers/session'
import { message } from 'infrad'

export const initialAccessBeforeSubmit = formData => {
  const { type, accessGroups, platformPermissionGroupId, purpose } = formData || {}

  if (type === AccessRequestPermissionType.PLATFORM_USER) {
    return { purpose, permissionGroupId: platformPermissionGroupId }
  } else if (type === AccessRequestPermissionType.TENANT_USER) {
    const tenantId = accessGroups[0]
    const permissionGroupId = accessGroups[1]
    let payload: any = { tenantId, permissionGroupId, purpose }
    const userInfo = getSession()
    const { email } = userInfo
    payload = { email, ...payload }
    return payload
  }
}

const hasRepeatTenant = permissionGroups => {
  if (!permissionGroups || permissionGroups.length === 0) return false
  const tenantIds = permissionGroups.map(item => item[0])
  const noRepeatIds = new Set<number>(tenantIds)
  return tenantIds.length !== noRepeatIds.size
}

const hasBlankTenant = permissionGroups => {
  if (!permissionGroups || permissionGroups.length === 0) return true
  return permissionGroups.find(item => item.length === 0)
}

export const changeRoleBeforeSubmit = formData => {
  const { accessGroups: permissionGroups } = formData || {}

  if (hasRepeatTenant(permissionGroups)) {
    message.info('There are duplicate tenants')
    return
  }
  if (hasBlankTenant(permissionGroups)) {
    message.info('There are blank tenants')
    return
  }

  const roles = permissionGroups.map(item => {
    const [tenantId, permissionGroupId] = item
    return { tenantId, permissionGroupId }
  })
  return { roles }
}
