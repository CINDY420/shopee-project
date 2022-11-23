import { Module, forwardRef } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'

import { ClustersModule } from 'platform-management/clusters/clusters.module'
import { GroupsModule } from 'applications-management/groups/groups.module'
import { ApiServerModule } from 'common/modules/apiServer/apiServer.module'

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [forwardRef(() => ClustersModule), forwardRef(() => GroupsModule), forwardRef(() => ApiServerModule)],
  exports: [ProjectsService]
})
export class ProjectsModule {}
