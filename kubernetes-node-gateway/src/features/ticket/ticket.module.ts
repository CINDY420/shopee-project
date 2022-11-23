import { Module } from '@nestjs/common'
import { ElasticsearchModule } from '@/shared/elasticsearch/elasticsearch.module'
import { AuthModule } from '@/shared/auth/auth.module'
import { OpenApiModule } from '@/shared/open-api/open-api.module'
import { TicketController } from '@/features/ticket/ticket.controller'
import { ElasticTicketService } from '@/features/ticket/elastic-ticket.service'
import { MailerModule } from '@/shared/mailer/mailer.module'
import { ShopeeTicketCenterService } from '@/features/ticket/shopee-ticket-center.service'
import { TicketService } from '@/features/ticket/ticket.service'

@Module({
  imports: [ElasticsearchModule, AuthModule, MailerModule, OpenApiModule],
  controllers: [TicketController],
  providers: [ShopeeTicketCenterService, TicketService, ElasticTicketService],
})
export class TicketModule {}
