import { Module } from '@nestjs/common'
import { OpenApiModule } from '@/shared/open-api/open-api.module'
import { DeployConfigService } from '@/features/deploy-config/deploy-config.service'
import { DeployConfigController } from '@/features/deploy-config/deploy-config.controller'

@Module({
  imports: [OpenApiModule],
  controllers: [DeployConfigController],
  providers: [DeployConfigService],
})
export class DeployConfigModule {}
