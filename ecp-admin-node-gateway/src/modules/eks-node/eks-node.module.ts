import { Module } from '@nestjs/common'
import { EksNodeController } from '@/modules/eks-node/eks-node.controller'
import { EksNodeService } from '@/modules/eks-node/eks-node.service'

@Module({
  controllers: [EksNodeController],
  providers: [EksNodeService],
})
export class EksNodeModule {}
