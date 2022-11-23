import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { RBAC_TENANT_RESOURCE_ACTION_META_KEY } from 'common/constants/rbac'
import { AUTH_USER, JWT_COOKIE_KEY } from 'common/constants/sessions'
import { TENANT_LOCATION, TENANT_RESOURCE_PERMISSION_META } from 'common/decorators/parameters/TenantResourceGuard'

import { AuthService } from 'common/modules/auth/auth.service'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'
import { RBACCheckTenantResourceAction } from 'common/helpers/rbac'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class TenantRbacGuard implements CanActivate {
  private readonly logger = new Logger(TenantRbacGuard.name)

  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const tenantRbacConfig = this.reflector.get<TENANT_RESOURCE_PERMISSION_META>(
      RBAC_TENANT_RESOURCE_ACTION_META_KEY,
      context.getHandler()
    )
    if (!tenantRbacConfig) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const authUser = request[AUTH_USER] as IAuthUser
    if (!authUser) {
      this.logger.error(
        'Auth user cannot be extracted from request, please make sure this route has been guarded by AuthGuard'
      )
      return true
    }

    const [tenantIdLocation, tenantIdKey, resource, action] = tenantRbacConfig
    let tenantId
    if (tenantIdLocation === TENANT_LOCATION.PARAMS) {
      tenantId = request.params[tenantIdKey]
    } else if (tenantIdLocation === TENANT_LOCATION.QUERY) {
      tenantId = request.query[tenantIdKey]
    } else {
      this.logger.error(`Unrecognized tenantIdLocation ${tenantIdLocation}`)
      return true
    }

    if (!tenantId) {
      this.logger.error(`Can't retrieve tenant id from ${tenantIdLocation} with key ${tenantIdKey}`)
      return true
    }
    const authToken = request.cookies[JWT_COOKIE_KEY]
    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    return RBACCheckTenantResourceAction(tenantPermissions, tenantId, resource, action)
  }
}
