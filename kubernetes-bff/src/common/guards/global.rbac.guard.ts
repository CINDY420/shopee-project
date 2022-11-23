import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { RBAC_GLOBAL_RESOURCE_ACTION_META_KEY, PERMISSION_SCOPE } from 'common/constants/rbac'
import { AUTH_USER, JWT_COOKIE_KEY } from 'common/constants/sessions'

import { GLOBAL_RESOURCE_VERB_META } from 'common/decorators/parameters/GlobalResourceGuard'
import { RbacService } from 'rbac/rbac.service'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class GlobalRbacGuard implements CanActivate {
  private readonly logger = new Logger(GlobalRbacGuard.name)

  constructor(private reflector: Reflector, private rbacService: RbacService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const globalRBACConfig = this.reflector.get<GLOBAL_RESOURCE_VERB_META>(
      RBAC_GLOBAL_RESOURCE_ACTION_META_KEY,
      context.getHandler()
    )
    if (!globalRBACConfig) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const authUser = request[AUTH_USER]
    if (!authUser) {
      this.logger.error(
        'Auth user cannot be extracted from request, please make sure this route has been guarded by AuthGuard'
      )
      return true
    }

    const authToken = request.cookies[JWT_COOKIE_KEY]
    const [resource, action] = globalRBACConfig
    const permissions = await this.rbacService.getResourcePermissions(
      authUser,
      PERMISSION_SCOPE.GLOBAL,
      resource,
      authToken
    )
    const requestResourcePermissionActions = permissions[resource] || []
    const hasPermission = requestResourcePermissionActions.includes(action)

    return hasPermission
  }
}
