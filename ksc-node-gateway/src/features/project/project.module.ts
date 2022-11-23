import { Module } from '@nestjs/common'
import { ProjectController } from '@/features/project/project.controller'
import { ProjectService } from '@/features/project/project.service'

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
