import { FetchController } from '@/modules/fetch/fetch.controller'
import { FetchService } from '@/modules/fetch/fetch.service'
import { HttpModule } from '@infra-node-kit/http'
import { SpaceAuthService } from '@infra-node-kit/space-auth'
import { Module } from '@nestjs/common'

@Module({
  controllers: [FetchController],
  imports: [HttpModule],
  providers: [FetchService, SpaceAuthService],
  exports: [FetchService],
})
export class FetchModule {}
