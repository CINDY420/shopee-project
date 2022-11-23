import {
  PermissionEnvMap,
  PERMISSION_SCOPE,
  PLATFORM_ROLE_SCOPE,
  RESOURCE_ACTION,
  RESOURCE_TYPE,
} from '@/common/constants/rbac'
import { IAuthUser } from '@/common/decorators/parameters/auth-user'
import { Logger } from '@/common/utils/logger'
import { AuthService } from '@/shared/auth/auth.service'
import { Injectable } from '@nestjs/common'

type IPermissions = Partial<Record<RESOURCE_TYPE, RESOURCE_ACTION[]>>

function isResourceAction(action: string): action is RESOURCE_ACTION {
  const values = Object.values(RESOURCE_ACTION)
  return values.includes(action as RESOURCE_ACTION)
}

@Injectable()
export class RbacService {
  constructor(private authService: AuthService, private readonly logger: Logger) {
    this.logger.setContext(AuthService.name)
  }

  async getResourcePermissions(
    authUser: IAuthUser,
    scope: PERMISSION_SCOPE,
    resource: RESOURCE_TYPE | RESOURCE_TYPE[],
    authToken: string,
    tenantId?: string,
  ): Promise<IPermissions> {
    let { roles } = authUser

    if (tenantId) {
      roles = roles.filter(
        ({ tenantId: userTenantId, roleScope }) =>
          userTenantId === Number(tenantId) || roleScope === PLATFORM_ROLE_SCOPE,
      )
    }

    const rolesPermissionsList = await Promise.all(
      roles.map(async ({ roleId }) => {
        const { permissions } = await this.authService.getRolePermissions(roleId, authToken)
        const globalPermissions = permissions.filter(({ permissionScope }) => permissionScope === scope)
        return globalPermissions
      }),
    )

    const queryResourceList = Array.isArray(resource) ? resource : [resource]
    const queriedPermissionsMap = queryResourceList.reduce<IPermissions>((map, resource) => {
      map[resource] = []
      return map
    }, {})
    rolesPermissionsList.forEach((permissionList) => {
      permissionList.forEach(({ resource, action, label }) => {
        const resourceActionList = queriedPermissionsMap[resource]
        const env = label ? PermissionEnvMap[label] : undefined
        const envAction = env ? `${action}${env}` : action
        if (isResourceAction(envAction) && resourceActionList && !resourceActionList.includes(envAction)) {
          resourceActionList.push(envAction)
        }
      })
    })

    return queriedPermissionsMap
  }
}
