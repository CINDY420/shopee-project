import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Controller, Get, Post, Put, Param, Query, Body, BadRequestException, ForbiddenException } from '@nestjs/common'

import {
  CreateReleaseFreezeBodyDto,
  GetLastReleaseFreezeParamsDto,
  getLastReleaseFreezeResponseDto,
  GetReleaseFreezeParamsDto,
  ListFreezesQueryDto,
  ListReleaseFreezesResponseDto,
  ReleaseFreezeItemDto,
  StopReleaseFreezeParamsDto,
  UpdateReleaseFreezeBodyDto,
  UpdateReleaseFreezeParamsDto
} from './dto/freezes.dto'
import { FreezesService } from './freezes.service'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { RBACCheckTenantResourceAction } from 'common/helpers/rbac'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { AuthService } from 'common/modules/auth/auth.service'
import { PLATFORM_TENANT_ID, RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { isInputDateValid } from 'common/helpers/date'
import { envToLiveOrNonLive } from 'common/helpers/env'
import { UssService } from 'common/modules/uss/uss.service'

@ApiTags('ReleaseFreezes')
@Controller()
export class FreezesController {
  constructor(
    private readonly openApi: OpenApiService,
    private readonly freezesService: FreezesService,
    private readonly authService: AuthService,
    private readonly ussService: UssService
  ) {}

  @Get('/getLastReleaseFreeze')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RELEASE_FREEZE)
  @ApiOperation({ description: 'Get the last release freeze.' })
  @ApiResponse({ status: 200, type: getLastReleaseFreezeResponseDto })
  async GetLastReleaseFreeze(
    @Query() query: GetLastReleaseFreezeParamsDto,
    @AuthToken() authToken: string
  ): Promise<getLastReleaseFreezeResponseDto> {
    const { env } = query
    const binaryEnv = envToLiveOrNonLive(env)
    return env
      ? this.freezesService.getLastReleaseFreeze(authToken, binaryEnv)
      : this.freezesService.getLastReleaseFreeze(authToken, '')
  }

  @Get('/releaseFreezes')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RELEASE_FREEZE)
  @ApiOperation({ description: 'Get release freeze list.' })
  @ApiResponse({ status: 200, type: ListReleaseFreezesResponseDto })
  async ListReleaseFreezes(
    @Query() query: ListFreezesQueryDto,
    @AuthToken() authToken: string
  ): Promise<ListReleaseFreezesResponseDto> {
    return this.openApi.listReleaseFreezes(query, authToken)
  }

  @Post('/releaseFreezes')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RELEASE_FREEZE)
  @ApiOperation({ description: 'Create a new release freeze.' })
  @ApiResponse({ status: 200, type: Object })
  async CreateReleaseFreeze(
    @Body() body: CreateReleaseFreezeBodyDto,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    // const { tenantId } = params
    const { envs, startTime, endTime } = body

    if (envs.length < 1) {
      throw new BadRequestException('invalid params: envs')
    }
    if (!isInputDateValid(startTime, endTime)) {
      throw new BadRequestException('invalid date input')
    }

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    const action = RESOURCE_ACTION.Create
    const hasPermission = RBACCheckTenantResourceAction(
      tenantPermissions,
      PLATFORM_TENANT_ID,
      RESOURCE_TYPE.RELEASE_FREEZE,
      action
    )
    if (!hasPermission) {
      throw new ForbiddenException('Only Platform Admin can create a release freeze')
    }
    return this.openApi.createReleaseFreeze(body, authToken, authUser.Email)
  }

  @Put('/releaseFreezes/:releaseFreezeId')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RELEASE_FREEZE)
  @ApiOperation({ description: 'Edit a release freeze' })
  @ApiResponse({ status: 200, type: Object })
  async UpdateReleaseFreeze(
    @Param() params: UpdateReleaseFreezeParamsDto,
    @Body() body: UpdateReleaseFreezeBodyDto,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    const { releaseFreezeId } = params
    const { envs, startTime, endTime } = body

    if (envs.length < 1) {
      throw new BadRequestException('invalid params: envs')
    }
    if (!isInputDateValid(startTime, endTime)) {
      throw new BadRequestException('invalid date input')
    }

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    const action = RESOURCE_ACTION.Edit
    const hasPermission = RBACCheckTenantResourceAction(
      tenantPermissions,
      PLATFORM_TENANT_ID,
      RESOURCE_TYPE.RELEASE_FREEZE,
      action
    )
    if (!hasPermission) {
      throw new ForbiddenException('Only Platform Admin can edit a release freeze')
    }
    return this.openApi.updateReleaseFreeze(releaseFreezeId, body, authToken, authUser.Email)
  }

  @Post('/releaseFreezes/:releaseFreezeId/stop')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RELEASE_FREEZE)
  @ApiOperation({ description: 'Stop a release freeze' })
  @ApiResponse({ status: 200, type: Object })
  async StopReleaseFreeze(
    @Param() params: StopReleaseFreezeParamsDto,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    const { releaseFreezeId } = params

    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    const action = RESOURCE_ACTION.Stop
    const hasPermission = RBACCheckTenantResourceAction(
      tenantPermissions,
      PLATFORM_TENANT_ID,
      RESOURCE_TYPE.RELEASE_FREEZE,
      action
    )
    if (!hasPermission) {
      throw new ForbiddenException('Only Platform Admin can stop a release freeze')
    }

    return this.openApi.stopReleaseFreeze(releaseFreezeId, authToken, authUser.Email)
  }

  @Get('/releaseFreezes/:releaseFreezeId')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.RELEASE_FREEZE)
  @ApiOperation({ description: 'Get release freeze.' })
  @ApiResponse({ status: 200, type: ReleaseFreezeItemDto })
  async GetReleaseFreeze(
    @Param() params: GetReleaseFreezeParamsDto,
    @AuthToken() authToken: string
  ): Promise<ReleaseFreezeItemDto> {
    const { releaseFreezeId } = params
    return this.openApi.getReleaseFreeze(releaseFreezeId, authToken)
  }
}
