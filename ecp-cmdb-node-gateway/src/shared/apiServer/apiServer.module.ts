import { Global, Module } from '@nestjs/common'
import { ApiServerService } from 'src/shared/apiServer/apiServer.service'

@Global()
@Module({
  providers: [ApiServerService],
  exports: [ApiServerService],
})
export class ApiServerModule {}
