import { Global, Module } from '@nestjs/common'
import { EcpAdminConfigService } from '@/shared/config/config.service'

@Global()
@Module({
  providers: [EcpAdminConfigService],
  exports: [EcpAdminConfigService],
})
export class ConfigModule {}
