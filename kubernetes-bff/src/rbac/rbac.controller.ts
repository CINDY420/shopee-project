import { BadRequestException, Controller, Get, NotFoundException, Param, Query, Req } from '@nestjs/common'
import { GetResourcePermissionsQueryDto } from './dto/rbac.dto'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { RESOURCE_TYPE, PERMISSION_SCOPE } from 'common/constants/rbac'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { RbacService } from './rbac.service'
import { AuthToken } from 'common/decorators/parameters/AuthToken'

@Controller()
export class RbacController {
  constructor(private rbacService: RbacService) {}

  @Get('resource/:scope/accessControl')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.ACCESS)
  async getResourcePermissions(
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string,
    @Param('scope') scope: PERMISSION_SCOPE,
    @Query() query: GetResourcePermissionsQueryDto
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
