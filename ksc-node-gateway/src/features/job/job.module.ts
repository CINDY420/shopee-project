import { Module } from '@nestjs/common'
import { JobController } from '@/features/job/job.controller'
import { JobService } from '@/features/job/job.service'

@Module({
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
