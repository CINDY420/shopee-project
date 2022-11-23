import { Module } from '@nestjs/common'
import { PodController } from '@/features/pod/pod.controller'

@Module({
  controllers: [PodController],
})
export class PodModule {}
