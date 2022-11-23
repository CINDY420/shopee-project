import { Module } from '@nestjs/common'
import { TenantController } from '@/features/tenant/tenant.controller'
import { TenantService } from '@/features/tenant/tenant.service'

@Module({
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
