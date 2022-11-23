import { FetchModule } from '@/modules/fetch/fetch.module'
import { GlobalController } from '@/modules/global/global.controller'
import { GlobalService } from '@/modules/global/global.service'
import { Module } from '@nestjs/common'

@Module({
  controllers: [GlobalController],
  imports: [FetchModule],
  providers: [GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}
