import { Module } from '@nestjs/common'
import { ProjectsModule } from 'applications-management/projects/projects.module'
import { AuthModule } from 'common/modules/auth/auth.module'
import { TicketController } from './ticket.controller'
import { TicketService } from './ticket.service'

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [AuthModule, ProjectsModule]
})
export class TicketModule {}
