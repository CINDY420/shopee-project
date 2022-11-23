import { DeployConfigController } from '@/modules/deploy-config/deploy-config.controller'
import { DeployConfigService } from '@/modules/deploy-config/deploy-config.service'
import { FetchModule } from '@/modules/fetch/fetch.module'
import { Module } from '@nestjs/common'

@Module({
  controllers: [DeployConfigController],
  imports: [FetchModule],
  providers: [DeployConfigService],
  exports: [DeployConfigService],
})
export class DeployConfigModule {}
