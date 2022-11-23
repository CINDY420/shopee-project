import { Module } from '@nestjs/common'
import { EksPvService } from '@/modules/eks-pv/eks-pv.service'
import { EksPvController } from '@/modules/eks-pv/eks-pv.controller'

@Module({
  providers: [EksPvService],
  controllers: [EksPvController],
})
export class EksPvModule {}
