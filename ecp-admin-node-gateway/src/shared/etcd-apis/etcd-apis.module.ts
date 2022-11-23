import { Global, Module } from '@nestjs/common'
import { HttpModule } from '@infra-node-kit/http'
import { AuthModule } from '@/shared/auth/auth.module'
import { EtcdApisService } from '@/shared/etcd-apis/etcd-apis.service'

@Global()
@Module({
  imports: [HttpModule.register({ concurrency: 100 }), AuthModule],
  providers: [EtcdApisService],
  exports: [EtcdApisService],
})
export class EtcdApisModule {}
