import { Module } from '@nestjs/common'
import { PprofService } from './pprof.service'
import { PprofController } from './pprof.controller'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { ClientManagerService } from 'common/modules/client-manager/client-manager.service'
import { AgentService } from 'common/modules/agent/agent.service'

@Module({
  providers: [PprofService, ClustersService, ClientManagerService, AgentService],
  controllers: [PprofController]
})
export class PprofModule {}
