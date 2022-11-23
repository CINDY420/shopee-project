import { Module } from '@nestjs/common'
import { EksPvcService } from '@/modules/eks-pvc/eks-pvc.service'
import { EksPvcController } from '@/modules/eks-pvc/eks-pvc.controller'

@Module({
  providers: [EksPvcService],
  controllers: [EksPvcController],
})
export class EksPvcModule {}
