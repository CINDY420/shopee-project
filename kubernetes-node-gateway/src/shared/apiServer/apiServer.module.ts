import { CacheModule, Global, Module } from '@nestjs/common'
import { ApiServerService } from './apiServer.service'

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [ApiServerService],
  exports: [ApiServerService],
})
export class ApiServerModule {}
