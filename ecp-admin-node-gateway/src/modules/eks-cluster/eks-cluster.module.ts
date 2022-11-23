import { Module } from '@nestjs/common'
import { EksClusterService } from '@/modules/eks-cluster/eks-cluster.service'
import { EksClusterController } from '@/modules/eks-cluster/eks-cluster.controller'

@Module({
  providers: [EksClusterService],
  controllers: [EksClusterController],
})
export class EksClusterModule {}
