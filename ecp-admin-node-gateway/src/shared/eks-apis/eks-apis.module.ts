import { Global, Module } from '@nestjs/common'
import { HttpModule } from '@infra-node-kit/http'
import { EksApisService } from '@/shared/eks-apis/eks-apis.service'
import { AuthModule } from '@/shared/auth/auth.module'

@Global()
@Module({
  imports: [HttpModule.register({ concurrency: 100 }), AuthModule],
  providers: [EksApisService],
  exports: [EksApisService],
})
export class EksApisModule {}
