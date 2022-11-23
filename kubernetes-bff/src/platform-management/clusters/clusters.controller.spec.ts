import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { AgentModule } from 'common/modules/agent/agent.module'
import { NodesModule } from 'nodes/nodes.module'
import { ClustersController } from './clusters.controller'
import { ESService } from 'common/modules/es/es.service'
import { ClustersService } from './clusters.service'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { ApiServerModule } from 'common/modules/apiServer/apiServer.module'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { GroupsService } from 'applications-management/groups/groups.service'
import { EventService } from 'common/modules/event/event.service'
import { EventModule } from 'common/modules/event/event.module'
import { AuthService } from 'common/modules/auth/auth.service'
import { CacheModule } from '@nestjs/common'

describe.skip('ClustersController', () => {
  let controller: ClustersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        CacheModule.register(),
        AgentModule,
        NodesModule,
        ApiServerModule,
        EventModule
      ],
      controllers: [ClustersController],
      providers: [ClustersService, ESService, ProjectsService, MetricsService, GroupsService, EventService, AuthService]
    }).compile()

    controller = module.get<ClustersController>(ClustersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
