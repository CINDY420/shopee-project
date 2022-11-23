import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { ApplicationsService } from 'applications-management/applications/applications.service'
import configuration from 'common/config/configuration'

import { AgentService } from 'common/modules/agent/agent.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { PodsService } from './pods.service'
import { ESService } from 'common/modules/es/es.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { GroupsService } from 'applications-management/groups/groups.service'
import { ClientManagerService } from 'common/modules/client-manager/client-manager.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('PodsService', () => {
  let service: PodsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      providers: [
        PodsService,
        ClustersService,
        AgentService,
        ESService,
        ApiServerService,
        ApplicationsService,
        ProjectsService,
        MetricsService,
        GroupsService,
        ClientManagerService,
        AuthService
      ]
    }).compile()

    service = module.get<PodsService>(PodsService)
  })

  it.skip('should be defined', () => {
    expect(service).toBeDefined()
  })
})
