import { Module, forwardRef } from '@nestjs/common'
import { ClustersService } from './clusters.service'
import { ClustersController } from './clusters.controller'
import { NodesModule } from 'nodes/nodes.module'
import { ProjectsModule } from 'applications-management/projects/projects.module'
import { FlavorController } from 'platform-management/clusters/flavor.controller'

@Module({
  controllers: [ClustersController, FlavorController],
  providers: [ClustersService],
  imports: [forwardRef(() => NodesModule), forwardRef(() => ProjectsModule)],
  exports: [ClustersService]
})
export class ClustersModule {}
