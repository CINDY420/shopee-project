import { Module } from '@nestjs/common'
import { PeriodicJobController } from '@/features/periodicJob/job.controller'

@Module({
  controllers: [PeriodicJobController],
})
export class PeriodicJobModule {}
