import { Module } from '@nestjs/common'
import { RequestsController } from './requests.controller'
import { RequestsService } from './requests.service'
import { RoleModule } from 'userRole/role.module'
import { ProjectsModule } from 'applications-management/projects/projects.module'

@Module({
  providers: [RequestsService],
  imports: [RoleModule, ProjectsModule],
  controllers: [RequestsController],
  exports: [RequestsService]
})
export class RequestsModule {}
