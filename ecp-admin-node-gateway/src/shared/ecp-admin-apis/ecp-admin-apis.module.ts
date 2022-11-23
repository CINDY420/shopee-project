import { Global, Module } from '@nestjs/common'
import { HttpModule } from '@infra-node-kit/http'
import { AuthModule } from '@/shared/auth/auth.module'
import { EcpAdminApisService } from '@/shared/ecp-admin-apis/ecp-admin-apis.service'

@Global()
@Module({
  imports: [HttpModule.register({ concurrency: 100 }), AuthModule],
  providers: [EcpAdminApisService],
  exports: [EcpAdminApisService],
})
export class EcpAdminApisModule {}
