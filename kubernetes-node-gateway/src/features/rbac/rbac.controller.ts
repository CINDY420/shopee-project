import { AUDIT_RESOURCE_TYPE } from '@/common/constants/audit-resource-type'
import { PERMISSION_SCOPE } from '@/common/constants/rbac'
import { AuditResourceType } from '@/common/decorators/parameters/audit-resource-type'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { RbacService } from '@/features/rbac/rbac.service'
import { GetResourcePermissionsQuery } from '@/features/rbac/dto/get-resource-permissions.dto'
import { AuthUser, IAuthUser } from '@/common/decorators/parameters/auth-user'
import { AuthToken } from '@/common/decorators/parameters/auth-token'

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('resource/:scope/accessControl')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.ACCESS)
  async getResourcePermissions(
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string,
    @Param('scope') scope: PERMISSION_SCOPE,
    @Query() query: GetResourcePermissionsQuery,
  ) {
    const { resources, tenantId } = query
    try {
      const permissions = await this.rbacService.getResourcePermissions(authUser, scope, resources, authToken, tenantId)
      return permissions
    } catch (err) {
      return {}
    }
  }
}
