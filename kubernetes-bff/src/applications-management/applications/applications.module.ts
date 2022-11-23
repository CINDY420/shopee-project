import { Module } from '@nestjs/common'
import { ApplicationsService } from './applications.service'
import { ApplicationsController } from './applications.controller'
import { ProjectsModule } from 'applications-management/projects/projects.module'
import { ClustersModule } from 'platform-management/clusters/clusters.module'

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  imports: [ProjectsModule, ClustersModule],
  exports: [ApplicationsService]
})
export class ApplicationsModule {}
