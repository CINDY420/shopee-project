import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'

import configuration from 'common/config/configuration'
import { ApplicationsService } from './applications.service'
import { ESService } from 'common/modules/es/es.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { GroupsService } from 'applications-management/groups/groups.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { AgentService } from 'common/modules/agent/agent.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('ApplicationsService', () => {
  let service: ApplicationsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      providers: [
        ESService,
        ApplicationsService,
        ApiServerService,
        ProjectsService,
        MetricsService,
        GroupsService,
        ClustersService,
        AgentService,
        AuthService
      ]
    }).compile()

    service = module.get<ApplicationsService>(ApplicationsService)
  })

  it.skip('should be defined', () => {
    expect(service).toBeDefined()
  })
})
