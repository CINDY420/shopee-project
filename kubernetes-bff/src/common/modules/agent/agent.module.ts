import { forwardRef, Global, Module } from '@nestjs/common'
import { ClustersModule } from 'platform-management/clusters/clusters.module'
import { AgentService } from './agent.service'

@Global()
@Module({
  providers: [AgentService],
  exports: [AgentService],
  imports: [forwardRef(() => ClustersModule)]
})
export class AgentModule {}
