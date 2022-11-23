import { TicketEvent } from '@/features/ticket/dto/shopee-ticket-center/shopee-ticket.model'

export class GetTicketEventResponse {
  items: TicketEvent[]
  total: string
}
