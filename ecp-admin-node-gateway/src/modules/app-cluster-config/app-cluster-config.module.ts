import { Module } from '@nestjs/common'
import { ClusterModule } from '@/modules/cluster/cluster.module'
import { AppClusterConfigController } from '@/modules/app-cluster-config/app-cluster-config.controller'
import { AppClusterConfigService } from '@/modules/app-cluster-config/app-cluster-config.service'
import { SegmentModule } from '@/modules/segment/segment.module'

@Module({
  controllers: [AppClusterConfigController],
  providers: [AppClusterConfigService],
  imports: [ClusterModule, SegmentModule],
})
export class AppClusterConfigModule {}
