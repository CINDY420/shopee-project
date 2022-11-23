import { MailerService } from '@/shared/mailer/mailer.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
