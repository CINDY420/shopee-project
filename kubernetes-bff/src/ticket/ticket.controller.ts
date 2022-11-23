import { Body, Controller, Get, Headers, Param, Post, Query, Delete } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { TicketService } from './ticket.service'
import {
  IListTicketsQueryDto,
  IListTicketsResponse,
  ITicketDetail,
  ITicket,
  IPostResponse,
  IListMyTickets,
  IMyTickets,
  ApplyTerminalAccessBody
} from './dto/ticket.dto'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { TenantResourceGuard, TENANT_LOCATION } from 'common/decorators/parameters/TenantResourceGuard'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('myApproverPendingTickets')
  @ApiResponse({ status: 200, type: IListTicketsResponse, description: 'Return tickets which need I approve' })
  async getMyApproverPendingTickets(
    @AuthToken() authToken: string,
    @Query() query: IListTicketsQueryDto,
    @AuthUser() authUser: IAuthUser
  ) {
    return await this.ticketService.listMyApproverPendingTickets(authUser, authToken, query)
  }

  @Get('myApproverHistoryTickets')
  @ApiResponse({ status: 200, type: IListTicketsResponse, description: 'Return tickets which I have processed' })
  async getMyApproverHistory(
    @Query() query: IListTicketsQueryDto,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    return await this.ticketService.listMyApproverHistoryTickets(authUser, authToken, query)
  }

  @Get('myTickets')
  @ApiResponse({ status: 200, type: IMyTickets, description: 'Return tickets which I have created' })
  async getMyPendingHistory(
    @Query() query: IListMyTickets,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    return await this.ticketService.listMyTickets(authUser, authToken, query)
  }

  @TenantResourceGuard({
    tenantIdLocation: TENANT_LOCATION.PARAMS,
    tenantIdKey: 'tenantId',
    resource: RESOURCE_TYPE.TENANT,
    action: RESOURCE_ACTION.View
  })
  @Post('tenants/:tenantId/projects/:projectName/terminalAccesses')
  @ApiResponse({ status: 200, type: ITicket, description: 'Apply terminal access' })
  async applyTerminalAccess(
    @Param('tenantId') tenantId: number,
    @Param('projectName') project: string,
    @AuthUser() authUser: IAuthUser,
    @Body() info: ApplyTerminalAccessBody,
    @Headers('Host') host: string,
    @AuthToken() authToken: string
  ) {
    return await this.ticketService.applyTerminalAccess({
      tenant: tenantId,
      project,
      info,
      authUser,
      host,
      authToken
    })
  }

  @Get(':ticketId/detail')
  @ApiResponse({ status: 200, type: ITicketDetail })
  async getTicketDetail(@Param('ticketId') ticketId: string, @AuthToken() authToken: string) {
    const tickedDetail = await this.ticketService.getTicketById(ticketId, authToken)
    return tickedDetail
  }

  @Delete(':ticketId')
  @ApiOperation({ description: 'Cancel Ticket' })
  @ApiResponse({ status: 200, type: null })
  async cancelTicket(@Param('ticketId') ticketId: string, @AuthUser() authUser: IAuthUser) {
    return this.ticketService.cancelTicket(ticketId, authUser)
  }

  @Post(':ticketId/approve')
  @ApiResponse({ status: 200, type: IPostResponse })
  async approveTicket(
    @Param('ticketId') ticketId: string,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser,
    @Headers('Host') host: string
  ) {
    await this.ticketService.approveTicket(ticketId, authToken, authUser, host)
    return { message: `Approve ${ticketId} successfully!` }
  }

  @Post(':ticketId/reject')
  @ApiResponse({ status: 200, type: IPostResponse })
  async rejectTicket(
    @Param('ticketId') ticketId: string,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser,
    @Headers('Host') host: string
  ) {
    await this.ticketService.rejectTicket(ticketId, authToken, authUser, host)
    return { message: `Reject ${ticketId} successfully!` }
  }
}
