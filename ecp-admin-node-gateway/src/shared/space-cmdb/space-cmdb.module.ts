import { Global, Module } from '@nestjs/common'
import { HttpModule } from '@infra-node-kit/http'
import { AuthModule } from '@/shared/auth/auth.module'
import { SpaceCMDBService } from '@/shared/space-cmdb/space-cmdb.service'

@Global()
@Module({
  imports: [HttpModule.register({ concurrency: 100 }), AuthModule],
  providers: [SpaceCMDBService],
  exports: [SpaceCMDBService],
})
export class SpaceCMDBModule {}
