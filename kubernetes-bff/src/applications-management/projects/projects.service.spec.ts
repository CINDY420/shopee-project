import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { ProjectsService } from './projects.service'
import { ESService } from 'common/modules/es/es.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { GroupsService } from 'applications-management/groups/groups.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { AgentService } from 'common/modules/agent/agent.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('ProjectsService', () => {
  let service: ProjectsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      providers: [
        ProjectsService,
        ESService,
        MetricsService,
        GroupsService,
        ClustersService,
        ConfigService,
        AgentService,
        ApiServerService,
        AuthService
      ]
    }).compile()

    service = module.get<ProjectsService>(ProjectsService)
  })

  it.skip('should be defined', () => {
    expect(service).toBeDefined()
  })
})
