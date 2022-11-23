import { Module } from '@nestjs/common'
import { QuotaService } from '@/modules/quota/quota.service'
import { QuotaController } from '@/modules/quota/quota.controller'

@Module({
  providers: [QuotaService],
  controllers: [QuotaController],
})
export class QuotaModule {}
