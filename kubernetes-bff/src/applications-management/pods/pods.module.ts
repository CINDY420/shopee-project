import { forwardRef, Module } from '@nestjs/common'
import { PodsService } from './pods.service'
import { PodsController } from './pods.controller'
import { ClustersModule } from 'platform-management/clusters/clusters.module'
import { ApplicationsModule } from 'applications-management/applications/applications.module'
import { AgentModule } from 'common/modules/agent/agent.module'
import { PodsGateway } from './pods.gateway'
import { LogsGateway } from './logs.gateway'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { PprofService } from 'pprof/pprof.service'
import { TerminalAuditService } from './terminal.audit.service'

@Module({
  providers: [PodsService, LogsGateway, PodsGateway, OpenApiService, PprofService, TerminalAuditService],
  controllers: [PodsController],
  imports: [forwardRef(() => ClustersModule), forwardRef(() => AgentModule), forwardRef(() => ApplicationsModule)],
  exports: [PodsService]
})
export class PodsModule {}
