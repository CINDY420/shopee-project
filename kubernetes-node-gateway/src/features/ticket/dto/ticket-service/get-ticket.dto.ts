import { IsString } from 'class-validator'
import { Ticket } from '@/features/ticket/dto/ticket-service/ticket.model'

export class GetTicketParam {
  @IsString()
  ticketId: string
}

export class GetTicketResponse extends Ticket {}
