import { Module } from '@nestjs/common'
import { ClusterService } from '@/features/cluster/cluster.service'
import { ClusterController } from '@/features/cluster/cluster.controller'

@Module({
  imports: [ClusterService],
  controllers: [ClusterController],
  providers: [ClusterService],
})
export class ClusterModule {}
