import { Module } from '@nestjs/common'
import { ClusterController } from '@/modules/cluster/cluster.controller'
import { ClusterService } from '@/modules/cluster/cluster.service'
import { GlobalModule } from '@/modules/global/global.module'

@Module({
  imports: [GlobalModule],
  controllers: [ClusterController],
  providers: [ClusterService],
  exports: [ClusterService],
})
export class ClusterModule {}
