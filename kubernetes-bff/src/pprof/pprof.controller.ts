import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { PprofService } from 'pprof/pprof.service'
import { success, pSuccess, RESPONSE_CODE, fail } from 'common/helpers/response'
import {
  CreatePprofRequest,
  PprofCommonParams,
  GetPprofListQuery,
  CreatePprofResponse,
  GetPprofListResponse,
  GetProfCronJobQuery,
  GetPprofObjectResponse,
  GetProfParams,
  PROFILING_TYPE_LIST,
  GetPprofResponse,
  CreatePprofCronjobRequest,
  CreatePprofCronjobResponse,
  GetPprofCronjobResponse
} from 'pprof/dto/pprof.dto'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { TenantResourceGuard, TENANT_LOCATION } from 'common/decorators/parameters/TenantResourceGuard'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { AuthToken } from 'common/decorators/parameters/AuthToken'

@ApiTags('pprof')
@Controller('tenants/:tenantId/projects/:projectName/apps/:appName/deploys/:deployName/pprof')
export class PprofController {
  constructor(private readonly pprofService: PprofService, private readonly openApi: OpenApiService) {}

  @Post()
  @ApiResponse({ status: 200, type: CreatePprofResponse, description: 'start profiling' })
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  async createPprof(
    @Param() param: PprofCommonParams,
    @Body() body: CreatePprofRequest,
    @AuthToken() authToken: string,
    @AuthUser() user: IAuthUser
  ) {
    const result = await this.openApi.createPprof(param, body, authToken, user.Email)
    return success(result)
  }

  @Get()
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: GetPprofListResponse, description: 'get profiling history list' })
  async getPprofList(
    @Param() param: PprofCommonParams,
    @Query() query: GetPprofListQuery,
    @AuthToken() authToken: string
  ) {
    const { list, total, offset, limit } = await this.openApi.listPprofs(param, query, authToken)
    return pSuccess(list, total, offset, limit)
  }

  @Get('/detail/:profileId')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: GetPprofResponse, description: 'get profiling detail' })
  async getPprof(@Param() param: GetProfParams, @AuthToken() authToken: string) {
    const pprof = await this.openApi.getPprof(param, authToken)
    return pprof
  }

  @Get('objects')
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @ApiResponse({ status: 200, type: GetPprofObjectResponse, description: 'get profiling object' })
  getPprofObject(@Param() param: PprofCommonParams) {
    return success(PROFILING_TYPE_LIST)
  }

  @Post('cronjob')
  @ApiResponse({ status: 200, type: CreatePprofCronjobResponse, description: 'create pprof cornjob' })
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  async createPprofCronjob(
    @Param() param: PprofCommonParams,
    @Body() body: CreatePprofCronjobRequest,
    @AuthToken() authToken: string,
    @AuthUser() user: IAuthUser
  ) {
    const result = await this.openApi.createPprofCronjob(param, body, authToken, user.Email)
    if (result.code !== RESPONSE_CODE.SUCCESS) {
      return fail(result.code, result.message)
    }
    return success(result)
  }

  @Get('cronjob')
  @ApiResponse({ status: 200, type: GetPprofCronjobResponse, description: 'create pprof cornjob' })
  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.DEPLOYMENT,
    action: RESOURCE_ACTION.View
  })
  @AuditResourceType(AUDIT_RESOURCE_TYPE.POD)
  async getPprofCronjob(
    @Param() param: PprofCommonParams,
    @Query() query: GetProfCronJobQuery,
    @AuthToken() authToken: string
  ) {
    const result = await this.openApi.getPprofCronjob(param, query, authToken)
    return success(result)
  }
}
