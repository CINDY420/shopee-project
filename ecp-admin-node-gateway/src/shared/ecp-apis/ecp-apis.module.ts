import { Global, Module } from '@nestjs/common'
import { HttpModule } from '@infra-node-kit/http'
import { EcpApisService } from '@/shared/ecp-apis/ecp-apis.service'
import { AuthModule } from '@/shared/auth/auth.module'

@Global()
@Module({
  imports: [HttpModule.register({ concurrency: 100 }), AuthModule],
  providers: [EcpApisService],
  exports: [EcpApisService],
})
export class EcpApisModule {}
