import { DeploymentModule } from '@/modules/deployment/deployment.module'
import { FetchModule } from '@/modules/fetch/fetch.module'
import { SduController } from '@/modules/sdu/sdu.controller'
import { SduService } from '@/modules/sdu/sdu.service'
import { ApiServerModule } from '@/shared/apiServer/apiServer.module'
import { Module } from '@nestjs/common'

@Module({
  controllers: [SduController],
  imports: [FetchModule, DeploymentModule, ApiServerModule],
  providers: [SduService],
  exports: [SduService],
})
export class SduModule {}
