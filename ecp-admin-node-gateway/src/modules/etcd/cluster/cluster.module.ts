import { Module } from '@nestjs/common'
import { EtcdClusterController } from '@/modules/etcd/cluster/cluster.controller'
import { EtcdClusterService } from '@/modules/etcd/cluster/cluster.service'

@Module({
  controllers: [EtcdClusterController],
  providers: [EtcdClusterService],
  exports: [EtcdClusterService],
})
export class EtcdClusterModule {}
