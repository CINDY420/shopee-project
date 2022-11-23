import { Module } from '@nestjs/common'
import { EksEnumsController } from '@/modules/eks-enums/eks-enums.controller'
import { EksEnumsService } from '@/modules/eks-enums/eks-enums.service'

@Module({
  controllers: [EksEnumsController],
  providers: [EksEnumsService],
})
export class EksEnumsModule {}
