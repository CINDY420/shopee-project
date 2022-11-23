import { Module } from '@nestjs/common'
import { EksSecretController } from '@/modules/eks-secret/eks-secret.controller'
import { EksSecretService } from '@/modules/eks-secret/eks-secret.service'

@Module({
  controllers: [EksSecretController],
  providers: [EksSecretService],
})
export class EksSecretModule {}
