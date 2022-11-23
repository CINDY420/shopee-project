import { Module } from '@nestjs/common'
import { DeployConfigController } from 'deploy-config/deploy-config.controller'
import { DeployConfigService } from 'deploy-config/deploy-config.service'
import { OpenApiService } from 'common/modules/openApi/openApi.service'

@Module({
  controllers: [DeployConfigController],
  providers: [OpenApiService, DeployConfigService]
})
export class DeployConfigModule {}
