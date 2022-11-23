import { Injectable } from '@nestjs/common'
import {
  RESOURCE_TYPE,
  PERMISSION_SCOPE,
  RESOURCE_ACTION,
  PermissionEnvMap,
  PLATFORM_ROLE_SCOPE
} from 'common/constants/rbac'
import { AuthService } from 'common/modules/auth/auth.service'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'

type IPermissions = Record<RESOURCE_TYPE, RESOURCE_ACTION[]>

@Injectable()
export class RbacService {
  constructor(private authService: AuthService) {}

  async getResourcePermissions(
    authUser: IAuthUser,
    scope: PERMISSION_SCOPE,
    resource: RESOURCE_TYPE | RESOURCE_TYPE[],
    authToken: string,
    tenantId?: number
  ): Promise<IPermissions> {
    let { roles } = authUser

    if (tenantId) {
      roles = roles.filter(
        ({ tenantId: userTenantId, roleScope }) =>
          userTenantId === Number(tenantId) || roleScope === PLATFORM_ROLE_SCOPE
      )
    }

    const rolesPermissionsList = await Promise.all(
      roles.map(async ({ roleId }) => {
        const { permissions } = await this.authService.getRolePermissions(roleId, authToken)
        const globalPermissions = permissions.filter(({ permissionScope }) => permissionScope === scope)
        return globalPermissions
      })
    )

    const queryResourceList = Array.isArray(resource) ? resource : [resource]
    const queriedPermissionsMap = queryResourceList.reduce((map, resource) => {
      map[resource] = []
      return map
    }, {})
    rolesPermissionsList.forEach((permissionList) => {
      permissionList.forEach(({ resource, action, label }) => {
        const resourceActionList = queriedPermissionsMap[resource]
        const env = PermissionEnvMap[label]
        const envAction = env ? `${action}${env}` : action
        if (resourceActionList && !resourceActionList.includes(envAction)) {
          queriedPermissionsMap[resource].push(envAction)
        }
      })
    })

    return queriedPermissionsMap as IPermissions
  }
}
