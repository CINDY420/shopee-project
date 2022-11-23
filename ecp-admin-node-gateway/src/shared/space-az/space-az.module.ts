import { Global, Module } from '@nestjs/common'
import { SpaceAZService } from '@/shared/space-az/space-az.service'
import { HttpModule } from '@infra-node-kit/http'
import { AuthModule } from '@/shared/auth/auth.module'

@Global()
@Module({
  imports: [HttpModule.register({ concurrency: 100 }), AuthModule],
  providers: [SpaceAZService],
  exports: [SpaceAZService],
})
export class SpaceAZModule {}
