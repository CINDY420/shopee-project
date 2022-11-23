import { IsString } from 'class-validator'

export class CancelTicketParam {
  @IsString()
  ticketId: string
}
