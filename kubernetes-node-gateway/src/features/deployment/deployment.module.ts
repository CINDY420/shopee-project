import { Module } from '@nestjs/common'
import { DeploymentService } from '@/features/deployment/deployment.service'
import { DeploymentController } from '@/features/deployment/deployment.controller'

@Module({
  imports: [DeploymentService],
  controllers: [DeploymentController],
  providers: [DeploymentService],
})
export class DeploymentModule {}
