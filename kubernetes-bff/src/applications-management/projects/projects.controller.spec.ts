import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { ESService } from 'common/modules/es/es.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { GroupsService } from 'applications-management/groups/groups.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { AgentService } from 'common/modules/agent/agent.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('ProjectsController', () => {
  let controller: ProjectsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      controllers: [ProjectsController],
      providers: [
        ProjectsService,
        ESService,
        ClustersService,
        GroupsService,
        MetricsService,
        AgentService,
        ApiServerService,
        AuthService
      ]
    }).compile()

    controller = module.get<ProjectsController>(ProjectsController)
  })

  it.skip('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
