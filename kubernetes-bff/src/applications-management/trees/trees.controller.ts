import { Controller, Get, Param } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { TreesService } from './trees.service'
import { ITenantTree, IApplicationTree } from './dto/trees.dto'

import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'

import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { AuthToken } from 'common/decorators/parameters/AuthToken'

@ApiTags('Tree')
@Controller()
export class TreesController {
  constructor(private readonly treesService: TreesService) {}

  @Get('tree/projects')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, type: ITenantTree, description: 'get group tree and project tree' })
  getTenantProjectTree(@AuthUser() authUser: IAuthUser, @AuthToken() authToken: string) {
    return this.treesService.getTenantProjectTree(authUser, authToken)
  }

  @Get('tree/tenants/:tenantId/projects/:projectName/apps')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  // huadong TODO update
  // @GroupResourceGuard({
  //   groupLocation: GROUP_LOCATION.PARAMS,
  //   groupKey: 'groupName',
  //   resource: GROUP_RESOURCES.APPLICATION,
  //   verb: ACCESS_CONTROL_VERBS.VIEW
  // })
  @ApiResponse({ status: 200, type: IApplicationTree, description: 'get application tree' })
  getApplicationTree(
    @Param('tenantId') tenantId: number,
    @Param('projectName') projectName: string,
    @AuthToken() authToken: string
  ) {
    return this.treesService.getApplicationTree({ tenantId, projectName }, authToken)
  }
}
