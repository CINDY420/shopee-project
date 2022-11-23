import { FetchModule } from '@/modules/fetch/fetch.module'
import { DeploymentController } from '@/modules/deployment/deployment.controller'
import { DeploymentService } from '@/modules/deployment/deployment.service'
import { Module } from '@nestjs/common'

@Module({
  controllers: [DeploymentController],
  imports: [FetchModule],
  providers: [DeploymentService],
  exports: [DeploymentService],
})
export class DeploymentModule {}
