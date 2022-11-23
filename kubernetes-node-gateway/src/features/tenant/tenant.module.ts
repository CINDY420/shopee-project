import { TenantController } from '@/features/tenant/tenant.controller'
import { TenantService } from '@/features/tenant/tenant.service'
import { Module } from '@nestjs/common'

@Module({
  controllers: [TenantController],
  imports: [TenantService],
  providers: [TenantService],
})
export class TenantModule {}
