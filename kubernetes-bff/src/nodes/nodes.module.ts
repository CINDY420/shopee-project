import { Module, forwardRef } from '@nestjs/common'
import { NodesService } from './nodes.service'
import { NodesController } from './nodes.controller'

import { ClustersModule } from 'platform-management/clusters/clusters.module'
import { ESModule } from 'common/modules/es/es.module'
import { AgentModule } from 'common/modules/agent/agent.module'

@Module({
  controllers: [NodesController],
  providers: [NodesService],
  imports: [forwardRef(() => ClustersModule), forwardRef(() => AgentModule), forwardRef(() => ESModule)],
  exports: [NodesService]
})
export class NodesModule {}
