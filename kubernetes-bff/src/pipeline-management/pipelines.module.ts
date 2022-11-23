import { Module } from '@nestjs/common'
import { ApplicationsModule } from 'applications-management/applications/applications.module'
import { ProjectsModule } from 'applications-management/projects/projects.module'
import { FreezesModule } from 'release-freezes-management/freezes.module'
import { FreezesService } from 'release-freezes-management/freezes.service'
import { PipelinesController } from './pipelines.controller'
import { PipelinesService } from './pipelines.service'

@Module({
  imports: [ProjectsModule, ApplicationsModule, FreezesModule],
  controllers: [PipelinesController],
  providers: [PipelinesService, FreezesService]
})
export class PipelinesModule {}
