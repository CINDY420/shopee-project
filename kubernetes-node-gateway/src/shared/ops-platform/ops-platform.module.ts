import { Module } from '@nestjs/common'
import { OpsPlatformService } from '@/shared/ops-platform/ops-platform.service'
import { AuthModule } from '@/shared/auth/auth.module'

@Module({
  imports: [AuthModule],
  exports: [OpsPlatformService],
  providers: [OpsPlatformService],
})
export class OpsPlatformModule {}
