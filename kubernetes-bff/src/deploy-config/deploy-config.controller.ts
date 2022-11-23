import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common'
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger'

import { success } from 'common/helpers/response'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import {
  DeployConfigParam,
  GetDeployConfigRequestQuery,
  GetDeployConfigResponse,
  UpdateDeployConfigResponse,
  UpdateDeployConfigRequestBody
} from 'deploy-config/dto/deploy-config.dto'
import { DeployConfigService } from 'deploy-config/deploy-config.service'
import { TenantResourceGuard, TENANT_LOCATION } from 'common/decorators/parameters/TenantResourceGuard'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'

@ApiTags('DeployConfig')
@Controller('/tenants/:tenantId/projects/:projectName/applications/:appName')
export class DeployConfigController {
  constructor(private readonly service: DeployConfigService) {}

  @Get('deploy-config')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @ApiResponse({ status: 200, type: GetDeployConfigResponse, description: 'get deploy config' })
  async getDeployConfig(
    @Param() param: DeployConfigParam,
    @Query() query: GetDeployConfigRequestQuery,
    @AuthUser() user: IAuthUser,
    @AuthToken() token: string
  ) {
    const result = await this.service.getDeployConfig(param, query.env, token)
    return success(result)
  }

  @Post('deploy-config')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.APPLICATION_DEPLOY_CONFIG,
    action: RESOURCE_ACTION.Edit
  })
  @ApiBody({ type: UpdateDeployConfigRequestBody })
  @ApiResponse({ status: 200, type: UpdateDeployConfigResponse, description: 'update deploy config' })
  async updateDeployConfig(
    @Param() param: DeployConfigParam,
    @Body() body: UpdateDeployConfigRequestBody,
    @AuthUser() user: IAuthUser,
    @AuthToken() token: string
  ) {
    const result = await this.service.updateDeployConfig(param, body, user.Email, token)
    return success(result)
  }
}
