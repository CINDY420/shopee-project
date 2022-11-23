import { Module } from '@nestjs/common'
import { HpaService } from '@/features/hpa/hpa.service'
import { HpaController } from '@/features/hpa/hpa.controller'

@Module({
  controllers: [HpaController],
  providers: [HpaService],
})
export class HpaModule {}
