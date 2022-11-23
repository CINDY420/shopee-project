import { Module, forwardRef } from '@nestjs/common'
import { DeploymentsService } from './deployments.service'
import { DeploymentsController } from './deployments.controller'

import { ClustersModule } from 'platform-management/clusters/clusters.module'
import { ProjectsModule } from 'applications-management/projects/projects.module'
import { ApplicationsModule } from 'applications-management/applications/applications.module'
import { PodsModule } from 'applications-management/pods/pods.module'

@Module({
  controllers: [DeploymentsController],
  imports: [
    forwardRef(() => ClustersModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => ApplicationsModule),
    forwardRef(() => PodsModule)
  ],
  providers: [DeploymentsService],
  exports: [DeploymentsService]
})
export class DeploymentsModule {}
