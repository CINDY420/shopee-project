import { Module } from '@nestjs/common'
import { SpaceApiService } from '@/shared/space-api/space-api.service'

@Module({
  exports: [SpaceApiService],
  providers: [SpaceApiService],
})
export class SpaceApiModule {}
