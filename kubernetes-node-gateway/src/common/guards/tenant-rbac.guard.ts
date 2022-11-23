import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { RBAC_TENANT_RESOURCE_ACTION_META_KEY } from '@/common/constants/rbac'
import { AUTH_USER, JWT_COOKIE_KEY } from '@/common/constants/sessions'
import { AuthService } from '@/shared/auth/auth.service'
import {
  TenantResourcePermissionMeta,
  TENANT_LOCATION,
} from '@/common/decorators/parameters/tenant-resource-info-for-tenant-rbac-guard'
import { RBACCheckTenantResourceAction } from '@/common/helpers/rbac'
import { IExpressRequestWithContext } from '@/common/interfaces/http'
import { Logger } from '@/common/utils/logger'

@Injectable()
export class TenantRbacGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService, private readonly logger: Logger) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const tenantRbacConfigList = this.reflector.get<TenantResourcePermissionMeta>(
      RBAC_TENANT_RESOURCE_ACTION_META_KEY,
      context.getHandler(),
    )

    if (!tenantRbacConfigList) {
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

    const [tenantIdLocation, tenantIdKey, resource, action] = tenantRbacConfigList
    let tenantId: number
    if (tenantIdLocation === TENANT_LOCATION.PARAMS) {
      tenantId = Number(request.params[tenantIdKey])
    } else if (tenantIdLocation === TENANT_LOCATION.QUERY) {
      tenantId = Number(request.query[tenantIdKey])
    } else {
      this.logger.error(`Unrecognized tenantIdLocation ${tenantIdLocation}`)
      return true
    }

    if (!tenantId || isNaN(tenantId)) {
      this.logger.error(`Can't retrieve tenant id from ${tenantIdLocation} with key ${tenantIdKey}`)
      return true
    }
    const authToken = request.cookies[JWT_COOKIE_KEY]
    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

    return RBACCheckTenantResourceAction(tenantPermissions, tenantId, resource, action)
  }
}
