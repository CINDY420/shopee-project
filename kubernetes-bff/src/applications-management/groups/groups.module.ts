import { Module, forwardRef } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { ClustersModule } from 'platform-management/clusters/clusters.module'
import { ESModule } from 'common/modules/es/es.module'
import { MetricsModule } from 'common/modules/metrics/metrics.module'
import { ProjectsModule } from '../projects/projects.module'

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [
    forwardRef(() => ClustersModule),
    forwardRef(() => ESModule),
    forwardRef(() => MetricsModule),
    forwardRef(() => ProjectsModule)
  ],
  exports: [GroupsService]
})
export class GroupsModule {}
