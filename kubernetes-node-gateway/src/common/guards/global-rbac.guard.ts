import { RbacService } from '@/features/rbac/rbac.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import {
  RBAC_GLOBAL_RESOURCE_ACTION_META_KEY,
  PERMISSION_SCOPE,
  RESOURCE_TYPE,
  RESOURCE_ACTION,
} from '@/common/constants/rbac'
import { IExpressRequestWithContext } from '@/common/interfaces/http'
import { Logger } from '@/common/utils/logger'
import { AUTH_USER, JWT_COOKIE_KEY } from '@/common/constants/sessions'

type GlobalResourceVerbMeta = [RESOURCE_TYPE, RESOURCE_ACTION]

@Injectable()
export class GlobalRbacGuard implements CanActivate {
  constructor(private reflector: Reflector, private rbacService: RbacService, private readonly logger: Logger) {
    this.logger.setContext(GlobalRbacGuard.name)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const globalRBACConfigList = this.reflector.get<GlobalResourceVerbMeta>(
      RBAC_GLOBAL_RESOURCE_ACTION_META_KEY,
      context.getHandler(),
    )
    if (!globalRBACConfigList) {
      return true
    }

    const request = context.switchToHttp().getRequest<IExpressRequestWithContext>()
    const authUser = request[AUTH_USER]
    if (!authUser) {
      this.logger.error(
        'Auth user cannot be extracted from request, please make sure this route has been guarded by AuthGuard',
      )
      return true
    }

    const authToken = request.cookies[JWT_COOKIE_KEY]
    const [resource, action] = globalRBACConfigList
    const permissions = await this.rbacService.getResourcePermissions(
      authUser,
      PERMISSION_SCOPE.GLOBAL,
      resource,
      authToken,
    )
    const requestResourcePermissionActions = permissions[resource] || []
    const hasPermission = requestResourcePermissionActions.includes(action)

    return hasPermission
  }
}
