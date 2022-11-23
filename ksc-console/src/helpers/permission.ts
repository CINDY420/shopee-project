import { PERMISSION_RESOURCE, PERMISSION_ACTION } from 'constants/permission'
import { IUserInfo } from 'helpers/session'

export const checkPermission = (
  permissions: IUserInfo['permissions'],
  resource: PERMISSION_RESOURCE,
  action: PERMISSION_ACTION = PERMISSION_ACTION.LIST,
): boolean => (permissions || {})?.[resource]?.includes(action)

export const hasRole = (roles: IUserInfo['roles'], roleId: string): boolean =>
  (roles || []).filter((role) => role?.roleId.toString() === roleId).length > 0
