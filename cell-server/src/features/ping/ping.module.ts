import { Module } from '@nestjs/common'

import { PingController } from '@/features/ping/ping.controller'

@Module({
  controllers: [PingController],
})
export class PingModule {}
