import { Module } from '@nestjs/common'
import { GlobalModule } from '@/modules/global/global.module'
import { SegmentController } from '@/modules/segment/segment.controller'
import { SegmentService } from '@/modules/segment/segment.service'
import { ClusterModule } from '@/modules/cluster/cluster.module'

@Module({
  controllers: [SegmentController],
  providers: [SegmentService],
  imports: [GlobalModule, ClusterModule],
  exports: [SegmentService],
})
export class SegmentModule {}
