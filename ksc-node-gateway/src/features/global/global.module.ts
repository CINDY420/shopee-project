import { Module } from '@nestjs/common'
import { GlobalController } from '@/features/global/global.controller'

@Module({
  controllers: [GlobalController],
})
export class GlobalModule {}
