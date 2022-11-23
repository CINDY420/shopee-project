import { Controller, Post, Get, Param, Headers, UseInterceptors, Body, Req } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import {
  RequestDetailResponseDto,
  RequestListResponseDto,
  LatestAccessApplyRecordParam,
  IESTicket
} from './dto/requests.dto'

import { RequestsService } from './requests.service'

import { Pagination } from 'common/decorators/methods'
import { PaginateInterceptor } from 'common/interceptors/paginate.interceptor'
import { RbacUser } from 'common/decorators/parameters/RbacUser'
import { IRbacUser } from 'rbac/entities/rbac.entity'
import { AuthService } from 'common/modules/auth/auth.service'
import { AuthToken } from 'common/decorators/parameters/AuthToken'

@ApiTags('Requests')
@Controller()
export class RequestsController {
  constructor(private readonly requestsService: RequestsService, private readonly authService: AuthService) {}

  // huadong TODO
  @Post('tenants/:tenantId/projects/:projectName/applyAccess')
  async applyAccess(
    @Param('tenantId') tenantId: number,
    @Param('projectName') projectName: string,
    @AuthUser() authUser: IAuthUser,
    @Headers('Host') host: string,
    @Body() info: { reason: string },
    @AuthToken() authToken: string
  ) {
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    return this.requestsService.applyAccess({ groupName: tenantName, projectName, info, authUser, host })
  }

  // @Get('access/:requestId/accessDetail')
  // @ApiResponse({ type: RequestDetailResponseDto, description: 'Return request detail' })
  // requestDetail(@Param('requestId') requestId: string, @RbacUser() rbacUser: IRbacUser) {
  //   return this.requestsService.requestDetail(requestId, rbacUser)
  // }

  @Get('approverPendingList')
  @ApiResponse({ status: 200, type: RequestListResponseDto, description: 'Return approver pending list' })
  @Pagination({
    key: 'items',
    countKey: 'totalCount',
    defaultOrder: 'createtime'
  })
  @UseInterceptors(PaginateInterceptor)
  approverPendingList(@AuthUser() authUser: IAuthUser, @RbacUser() rbacUser: IRbacUser) {
    return this.requestsService.approverPendingList(authUser, rbacUser)
  }

  @Get('approverHistoryList')
  @ApiResponse({ status: 200, type: RequestListResponseDto, description: 'Return approver history list' })
  @Pagination({
    key: 'items',
    countKey: 'totalCount',
    defaultOrder: 'updatetime'
  })
  @UseInterceptors(PaginateInterceptor)
  approverHistoryList(@AuthUser() authUser: IAuthUser, @RbacUser() rbacUser: IRbacUser) {
    return this.requestsService.approverHistoryList(authUser, rbacUser)
  }

  @Get('requestPendingList')
  @ApiResponse({ status: 200, type: RequestListResponseDto, description: 'Return request pending list' })
  @Pagination({
    key: 'items',
    countKey: 'totalCount',
    defaultOrder: 'createtime'
  })
  @UseInterceptors(PaginateInterceptor)
  requestPendingList(@AuthUser() authUser: IAuthUser) {
    return this.requestsService.requestPendingList(authUser)
  }

  @Get('requestHistoryList')
  @ApiResponse({ status: 200, type: RequestListResponseDto, description: 'Return request history list' })
  @Pagination({
    key: 'items',
    countKey: 'totalCount',
    defaultOrder: 'updatetime'
  })
  @UseInterceptors(PaginateInterceptor)
  requestHistoryList(@AuthUser() authUser: IAuthUser) {
    return this.requestsService.requestHistoryList(authUser)
  }

  @Get('requestList/:requestType')
  @ApiResponse({ status: 200, type: RequestListResponseDto, description: 'Return request list' })
  @Pagination({
    key: 'items',
    countKey: 'totalCount',
    defaultOrder: 'createtime'
  })
  @UseInterceptors(PaginateInterceptor)
  requestList(@AuthUser() authUser: IAuthUser, @Param('requestType') requestType: string) {
    return this.requestsService.requestList(authUser, requestType)
  }

  @Post('approveRequest/:requestId')
  approveRequest(
    @Param('requestId') requestId: string,
    @AuthUser() authUser: IAuthUser,
    @Headers('Host') host: string,
    @RbacUser() rbacUser: IRbacUser
  ) {
    return this.requestsService.approveRequest(requestId, authUser, host, rbacUser)
  }

  @Post('rejectRequest/:requestId')
  rejectRequest(
    @Param('requestId') requestId: string,
    @AuthUser() authUser: IAuthUser,
    @Headers('Host') host: string,
    @RbacUser() rbacUser: IRbacUser
  ) {
    return this.requestsService.rejectRequest(requestId, authUser, host, rbacUser)
  }

  @Get('tenants/:tenantId/projects/:projectName/activeaccess')
  @ApiResponse({ status: 200, type: IESTicket, description: 'Return latest terminal access apply record' })
  async latestAccessApplyRecord(
    @Param() param: LatestAccessApplyRecordParam,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const { tenantId, projectName } = param
    await this.authService.getTenantById(tenantId, authToken)
    const latestAccessApplyRecord = await this.requestsService.getLatestAccessApplyRecord(
      tenantId,
      projectName,
      authUser.ID,
      authUser.Email
    )
    return latestAccessApplyRecord
  }
}
