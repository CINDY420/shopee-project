import { Module, forwardRef } from '@nestjs/common'
import { TreesService } from './trees.service'
import { TreesController } from './trees.controller'
import { ESModule } from 'common/modules/es/es.module'
import { ProjectsModule } from 'applications-management/projects/projects.module'

@Module({
  controllers: [TreesController],
  providers: [TreesService],
  imports: [forwardRef(() => ProjectsModule), forwardRef(() => ESModule)],
  exports: [TreesService]
})
export class TreesModule {}
