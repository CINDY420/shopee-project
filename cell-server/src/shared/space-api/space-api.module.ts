import { Module } from '@nestjs/common'
import { SpaceApiService } from '@/shared/space-api/space-api.service'
import { HttpModule } from '@infra-node-kit/http'

@Module({
  imports: [HttpModule],
  providers: [SpaceApiService],
  exports: [SpaceApiService],
})
export class SpaceApiModule {}
