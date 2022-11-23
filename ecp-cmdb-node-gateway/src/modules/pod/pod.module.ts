import { FetchModule } from '@/modules/fetch/fetch.module'
import { PodController } from '@/modules/pod/pod.controller'
import { PodService } from '@/modules/pod/pod.service'
import { Module } from '@nestjs/common'

@Module({
  controllers: [PodController],
  imports: [FetchModule],
  providers: [PodService],
  exports: [PodService],
})
export class PodModule {}
