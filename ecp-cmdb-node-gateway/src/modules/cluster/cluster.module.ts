import { Module } from '@nestjs/common'
import { ClusterService } from '@/modules/cluster/cluster.service'
import { ClusterController } from '@/modules/cluster/cluster.controller'

@Module({
  providers: [ClusterService],
  controllers: [ClusterController],
})
export class ClusterModule {}
