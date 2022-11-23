import { Module } from '@nestjs/common'
import { TenantController } from '@/modules/tenant/tenant.controller'
import { TenantService } from '@/modules/tenant/tenant.service'

@Module({
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
