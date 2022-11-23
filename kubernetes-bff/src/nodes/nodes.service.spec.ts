import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { AgentService } from 'common/modules/agent/agent.service'
import { NodesService } from './nodes.service'
import { ESService } from 'common/modules/es/es.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { CacheModule } from '@nestjs/common'

describe('NodesService', () => {
  let service: NodesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        CacheModule.register()
      ],
      providers: [NodesService, AgentService, ESService, ApiServerService, ClustersService, MetricsService]
    }).compile()

    service = module.get<NodesService>(NodesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
