import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ERROR } from '@/common/constants/error'
import { throwError } from '@/common/utils/throw-error'
import { Logger } from '@/common/utils/logger'
import { CreateTicketBody, CreateTicketResponse } from '@/features/ticket/dto/ticket-service/create-ticket.dto'
import { TicketService } from '@/features/ticket/ticket.service'
import { TICKET_TYPE } from '@/features/ticket/dto/ticket-service/ticket.model'
import { GetTicketsResponse, ListTicketsQuery } from '@/features/ticket/dto/ticket-service/list-tickets.dto'
import { UpdateTasksBody, UpdateTasksParam } from '@/features/ticket/dto/ticket-service/update-tasks.dto'
import { GetTicketParam, GetTicketResponse } from '@/features/ticket/dto/ticket-service/get-ticket.dto'
import {
  UpdateTicketFormBody,
  UpdateTicketFormParam,
} from '@/features/ticket/dto/ticket-service/update-ticket-form.dto'
import { CancelTicketParam } from '@/features/ticket/dto/ticket-service/cancel-ticket.dto'
import { Pagination } from '@/common/decorators/parameters/pagination'
import { PaginateInterceptor } from '@/common/interceptors/pagination.inteceptor'

@ApiTags('Ticket')
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService, private readonly logger: Logger) {}

  /**
   * 创建工单
   * create shopee ticket
   */
  @Post()
  createTicket(@Body() ticket: CreateTicketBody, @Headers('Host') host: string): Promise<CreateTicketResponse> {
    switch (ticket.type) {
      case TICKET_TYPE.DEPLOYMENT_SCALE:
        return this.ticketService.createScaleDeploymentTicket(ticket, host)
      case TICKET_TYPE.ADD_ROLE:
      case TICKET_TYPE.TERMINAL:
      case TICKET_TYPE.CHANGE_ROLE:
        return throwError(ERROR.SYSTEM_ERROR.TICKET_SERVICE.UNSUPPORTED_TICKET_TYPE)
      default:
        // never type will ensure that: new TICKET_TYPE will be handled
        const _neverShowTicketType: never = ticket.type
        throwError(ERROR.SYSTEM_ERROR.TICKET_SERVICE.UNSUPPORTED_TICKET_TYPE)
    }
  }

  /**
   * 获取工单详情
   * get ticket's detail
   */
  @Get('/:ticketId')
  getTicket(@Param() getTicketParam: GetTicketParam): Promise<GetTicketResponse> {
    return this.ticketService.getTicket(getTicketParam.ticketId)
  }

  /**
   * 取消工单
   * cancel a ticket by id
   */
  @Delete('/:ticketId')
  cancelTicket(@Param() cancelTicketParam: CancelTicketParam): Promise<void> {
    return this.ticketService.cancelTicket(cancelTicketParam.ticketId)
  }

  /**
   * 更新工单表单，目前(2021.12.21仅STC工单有更新功能)
   * patch ticket form data
   */
  @Patch('/:ticketId/forms')
  async updateTicketForm(
    @Param() updateTicketFormParam: UpdateTicketFormParam,
    @Body() updateTicketFormBody: UpdateTicketFormBody,
  ): Promise<null> {
    await this.ticketService.updateTicket(updateTicketFormParam.ticketId, updateTicketFormBody.form)
    return null
  }

  /**
   * get ticket list
   */
  @Pagination({
    key: 'items',
    countKey: 'total',
    defaultOrder: 'metaInfo.createTime desc',
    canPaginationFilter: false,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get()
  listTickets(@Query() listTicketsQuery: ListTicketsQuery): Promise<GetTicketsResponse> {
    return this.ticketService.listTickets(listTicketsQuery)
  }

  /**
   * 审批 / 拒绝工单
   */
  @Put('/:ticketId/tasks/:taskId')
  async updateTask(
    @Param() updateTasksParams: UpdateTasksParam,
    @Body() updateTasksBody: UpdateTasksBody,
    @Headers('Host') host: string,
  ): Promise<null> {
    const executeTasksResult = await this.ticketService.executeTasks(updateTasksParams, updateTasksBody, host)
    if (executeTasksResult?.failedTasks?.length) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.SHOPEE_TICKET_CENTER_ERROR.TASK_EXECUTE_FAILED,
        executeTasksResult.failedTasks[0].reason,
      )
    }
    return null
  }
}
