import { Module } from '@nestjs/common'
import { TicketController } from '@/features/ticket/ticket.controller'
import { SreTicketService } from '@/features/ticket/sre-ticket.service'
import { TicketService } from '@/features/ticket/ticket.service'

@Module({
  controllers: [TicketController],
  providers: [SreTicketService, TicketService],
})
export class TicketModule {}
