import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { SreAddRoleBody, CreateSreAddRoleTicketFEBody } from '@/features/ticket/dto/sre-ticket.dto'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { TicketService } from '@/features/ticket/ticket.service'
import {
  ListUserSreTicketsParams,
  ListUserSreTicketsQuery,
  ListUserSreTicketsResponse,
} from '@/features/ticket/dto/ticket.dto'

@ApiTags('Ticket')
@Controller()
export class TicketController {
  constructor(private readonly openApiService: OpenApiService, private readonly ticketService: TicketService) {}

  // Nest.js supports Google-API-style custom methods paths in this way: https://github.com/nestjs/nest/issues/7412
  @Post('sre/tickets[:]addRole')
  createSreAddRoleTicket(@Body() createSreAddRoleTicketFEBody: CreateSreAddRoleTicketFEBody) {
    return this.ticketService.createSreAddRoleTicket(createSreAddRoleTicketFEBody)
  }

  // addRole callback for sre ticket server to call
  @Post('sre[:]addRole')
  sreAddRole(@Body() sreAddRoleBody: SreAddRoleBody) {
    const { userId, ...others } = sreAddRoleBody
    return this.openApiService.addUserRole(userId, { role: others })
  }

  @Get('users/:email/sre/tickets')
  listUserSreTickets(
    @Param() listUserSreTicketsParams: ListUserSreTicketsParams,
    @Query() listUserSreTicketsQuery: ListUserSreTicketsQuery,
  ): Promise<ListUserSreTicketsResponse> {
    return this.ticketService.listUserSreTickets(listUserSreTicketsParams.email, listUserSreTicketsQuery)
  }
}
