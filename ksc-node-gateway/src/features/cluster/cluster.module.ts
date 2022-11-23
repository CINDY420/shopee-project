import { Module } from '@nestjs/common'
import { ClusterController } from '@/features/cluster/cluster.controller'
import { ClusterService } from '@/features/cluster/cluster.service'
import { MetricsService } from '@/common/modules/metrics/metrics.service'

@Module({
  controllers: [ClusterController],
  providers: [MetricsService, ClusterService],
})
export class ClusterModule {}
