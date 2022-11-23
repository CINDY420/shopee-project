import { Module } from '@nestjs/common'
import { GlobalController } from '@/modules/global/global.controller'
import { GlobalService } from '@/modules/global/global.service'

@Module({
  controllers: [GlobalController],
  providers: [GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}
