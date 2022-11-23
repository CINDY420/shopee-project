import { FetchModule } from '@/modules/fetch/fetch.module'
import { TenantController } from '@/modules/tenant/tenant.controller'
import { TenantService } from '@/modules/tenant/tenant.service'
import { Module } from '@nestjs/common'

@Module({
  controllers: [TenantController],
  imports: [FetchModule],
  providers: [TenantService],
})
export class TenantModule {}
