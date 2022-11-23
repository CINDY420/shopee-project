import { Module } from '@nestjs/common'
import { ApplicationsModule } from 'applications-management/applications/applications.module'
import { ProjectsModule } from 'applications-management/projects/projects.module'
import { ClustersModule } from 'platform-management/clusters/clusters.module'
import { FreezesController } from './freezes.controller'
import { FreezesService } from './freezes.service'

@Module({
  imports: [ProjectsModule, ApplicationsModule, ClustersModule],
  controllers: [FreezesController],
  providers: [FreezesService]
})
export class FreezesModule {}
