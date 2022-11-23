import { Module } from '@nestjs/common'
import { EksJobController } from './eks-job.controller'
import { EksJobService } from './eks-job.service'

@Module({
  controllers: [EksJobController],
  providers: [EksJobService],
})
export class EksJobModule {}
